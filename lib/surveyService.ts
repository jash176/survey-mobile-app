import {
  DatabaseSurveyFields,
  ISurvey,
  SurveyInput,
  SurveyPageInput,
} from "@/types/survey.interface";
import { supabase } from "./supabase";

// Custom error types for better error handling
export class SurveyServiceError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: any
  ) {
    super(message);
    this.name = "SurveyServiceError";
  }
}

export class SurveyService {
  private static readonly SURVEY_SELECT_QUERY = `
    *,
    survey_pages (
      *,
      survey_options (*)
    )
  `;

  /**
   * Transform raw database data to our survey interface
   */
  private static transformSurveyData(data: DatabaseSurveyFields): ISurvey {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      user_id: data.user_id,
      pages:
        data.survey_pages.map((page) => ({
          id: page.id,
          survey_id: page.survey_id,
          title: page.title,
          description: page.description,
          type: page.type,
          placeholder: page.placeholder,
          redirect_url: page.redirect_url,
          link_text: page.link_text,
          low_label: page.low_label,
          high_label: page.high_label,
          rating_type: page.rating_type,
          rating_scale: page.rating_scale,
          allow_multiple: page.allow_multiple,
          options:
            page.survey_options?.map((option) => option.option_text) || [],
        })) || [],
    };
  }

  /**
   * Create survey page data for database insertion
   */
  private static createPageData(page: SurveyPageInput, surveyId: string) {
    return {
      survey_id: surveyId,
      title: page.title,
      description: page.description,
      type: page.type,
      placeholder: page.placeholder || null,
      redirect_url: page.redirect_url || null,
      link_text: page.link_text || null,
      rating_type: page.rating_type || null,
      low_label: page.low_label || null,
      high_label: page.high_label || null,
      rating_scale: page.rating_scale || null,
      allow_multiple: page.allow_multiple || false,
    };
  }

  /**
   * Create survey options for a page
   */
  private static async createSurveyOptions(
    pageId: string,
    options: string[]
  ): Promise<void> {
    if (!options || options.length === 0) return;

    const optionsToInsert = options.map((optionText) => ({
      page_id: pageId,
      option_text: optionText,
    }));

    const { error } = await supabase
      .from("survey_options")
      .insert(optionsToInsert);

    if (error) {
      throw new SurveyServiceError(
        "Failed to create survey options",
        "createSurveyOptions",
        error
      );
    }
  }

  /**
   * Create a single survey page with its options
   */
  private static async createSurveyPage(
    page: SurveyPageInput,
    surveyId: string
  ): Promise<void> {
    const pageData = this.createPageData(page, surveyId);
    const { data: createdPage, error: pageError } = await supabase
      .from("survey_pages")
      .insert(pageData)
      .select()
      .single();

    console.log("PageData : ", pageData, pageError);
    if (pageError) {
      throw new SurveyServiceError(
        "Failed to create survey page",
        "createSurveyPage",
        pageError
      );
    }

    // Create options if this is a multiple choice question
    if (page.type === "mcq" && page.options) {
      await this.createSurveyOptions(createdPage.id, page.options);
    }
  }

  /**
   * Delete all pages and options for a survey
   */
  private static async deleteSurveyPages(surveyId: string): Promise<void> {
    // Get all page IDs for this survey
    const { data: pages, error: pagesFetchError } = await supabase
      .from("survey_pages")
      .select("id")
      .eq("survey_id", surveyId);

    if (pagesFetchError) {
      throw new SurveyServiceError(
        "Failed to fetch survey pages for deletion",
        "deleteSurveyPages",
        pagesFetchError
      );
    }

    // Delete survey options for all pages
    if (pages && pages.length > 0) {
      const pageIds = pages.map((page) => page.id);
      const { error: optionsError } = await supabase
        .from("survey_options")
        .delete()
        .in("page_id", pageIds);

      if (optionsError) {
        throw new SurveyServiceError(
          "Failed to delete survey options",
          "deleteSurveyPages",
          optionsError
        );
      }
    }

    // Delete survey pages
    const { error: pagesError } = await supabase
      .from("survey_pages")
      .delete()
      .eq("survey_id", surveyId);

    if (pagesError) {
      throw new SurveyServiceError(
        "Failed to delete survey pages",
        "deleteSurveyPages",
        pagesError
      );
    }
  }

  /**
   * Create a new survey with its pages and options
   */
  static async createSurvey(
    survey: SurveyInput,
    userId: string
  ): Promise<{ survey: ISurvey | null; error: any }> {
    try {
      // Create the survey
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .insert({
          title: survey.title,
          description: survey.description,
          user_id: userId,
        })
        .select()
        .single();

      if (surveyError) {
        throw new SurveyServiceError(
          "Failed to create survey",
          "createSurvey",
          surveyError
        );
      }

      // Create pages if they exist
      if (survey.pages && survey.pages.length > 0) {
        for (const page of survey.pages) {
          await this.createSurveyPage(page, surveyData.id);
        }
      }

      // Fetch the complete survey with pages and options
      const { survey: completeSurvey, error: fetchError } =
        await this.getSurveyById(surveyData.id);

      if (fetchError) {
        throw new SurveyServiceError(
          "Failed to fetch created survey",
          "createSurvey",
          fetchError
        );
      }

      return { survey: completeSurvey, error: null };
    } catch (error) {
      console.error("Error in createSurvey:", error);
      return { survey: null, error };
    }
  }

  /**
   * Get all surveys for a user with their pages and options
   */
  static async getSurveysByUser(
    userId: string
  ): Promise<{ surveys: ISurvey[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("surveys")
        .select(this.SURVEY_SELECT_QUERY)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new SurveyServiceError(
          "Failed to fetch surveys",
          "getSurveysByUser",
          error
        );
      }

      const transformedSurveys =
        data?.map((survey) => this.transformSurveyData(survey)) || [];

      return { surveys: transformedSurveys, error: null };
    } catch (error) {
      console.error("Error in getSurveysByUser:", error);
      return { surveys: null, error };
    }
  }

  /**
   * Get a single survey by ID with its pages and options
   */
  static async getSurveyById(
    surveyId: string
  ): Promise<{ survey: ISurvey | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("surveys")
        .select(this.SURVEY_SELECT_QUERY)
        .eq("id", surveyId)
        .single();

      if (error) {
        throw new SurveyServiceError(
          "Failed to fetch survey",
          "getSurveyById",
          error
        );
      }

      const transformedSurvey = this.transformSurveyData(data);

      return { survey: transformedSurvey, error: null };
    } catch (error) {
      console.error("Error in getSurveyById:", error);
      return { survey: null, error };
    }
  }

  /**
   * Update an existing survey
   */
  static async updateSurvey(
    surveyId: string,
    survey: Partial<SurveyInput>
  ): Promise<{ survey: ISurvey | null; error: any }> {
    try {
      // Delete existing pages and options
      await this.deleteSurveyPages(surveyId);

      // Update the survey basic info
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .update({
          title: survey.title,
          description: survey.description,
        })
        .eq("id", surveyId)
        .select()
        .single();

      if (surveyError) {
        throw new SurveyServiceError(
          "Failed to update survey",
          "updateSurvey",
          surveyError
        );
      }

      // Create new pages if they exist
      if (survey.pages && survey.pages.length > 0) {
        for (const page of survey.pages) {
          await this.createSurveyPage(page, surveyId);
        }
      }

      // Fetch the updated survey with all its data
      const { survey: updatedSurvey, error: fetchError } =
        await this.getSurveyById(surveyId);

      if (fetchError) {
        throw new SurveyServiceError(
          "Failed to fetch updated survey",
          "updateSurvey",
          fetchError
        );
      }

      return { survey: updatedSurvey, error: null };
    } catch (error) {
      console.error("Error in updateSurvey:", error);
      return { survey: null, error };
    }
  }

  /**
   * Delete a survey and all its pages and options
   */
  static async deleteSurvey(surveyId: string): Promise<{ error: any }> {
    try {
      // Delete all pages and options
      await this.deleteSurveyPages(surveyId);

      // Delete the survey
      const { error: surveyError } = await supabase
        .from("surveys")
        .delete()
        .eq("id", surveyId);

      if (surveyError) {
        throw new SurveyServiceError(
          "Failed to delete survey",
          "deleteSurvey",
          surveyError
        );
      }

      return { error: null };
    } catch (error) {
      console.error("Error in deleteSurvey:", error);
      return { error };
    }
  }
}
