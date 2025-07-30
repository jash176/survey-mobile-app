import { RatingType } from '@/components/survey/Rating';
import { supabase } from './supabase';

export interface SurveyPage {
  id?: string;
  survey_id?: string;
  title: string;
  description: string;
  type: 'text' | 'link' | 'rating' | 'mcq';
  placeholder?: string;
  redirect_url?: string;
  link_text?: string;
  rating_type?: RatingType;
  rating_scale?: number;
  options?: string[]; // This will be used for UI but not stored in survey_pages
  allow_multiple?: boolean;
}

export interface SurveyOption {
  id?: string;
  page_id: string;
  option_text: string;
}

export interface ISurvey {
  id?: string;
  title: string;
  description: string;
  user_id?: string;
  pages?: SurveyPage[];
}

export class SurveyService {
  /**
   * Create a new survey with its pages and options
   */
  static async createSurvey(survey: ISurvey, userId: string): Promise<{ survey: ISurvey | null; error: any }> {
    try {
      // Start a transaction by creating the survey first
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          title: survey.title,
          description: survey.description,
          user_id: userId,
        })
        .select()
        .single();

      if (surveyError) {
        console.error('Error creating survey:', surveyError);
        return { survey: null, error: surveyError };
      }

      // If there are pages, create them
      if (survey.pages && survey.pages.length > 0) {
        for (const page of survey.pages) {
          // Create the survey page
          const { data: pageData, error: pageError } = await supabase
            .from('survey_pages')
            .insert({
              survey_id: surveyData.id,
              title: page.title,
              description: page.description,
              type: page.type,
              placeholder: page.placeholder || null,
              redirect_url: page.redirect_url || null,
              link_text: page.link_text || null,
              rating_type: page.rating_type || null,
              rating_scale: page.rating_scale || null,
              allow_multiple: page.allow_multiple || false,
            })
            .select()
            .single();

          if (pageError) {
            console.error('Error creating survey page:', pageError);
            return { survey: null, error: pageError };
          }

          // If this is a multi-choice question and has options, create them
          if (page.type === 'mcq' && page.options && page.options.length > 0) {
            const optionsToInsert = page.options.map(optionText => ({
              page_id: pageData.id,
              option_text: optionText,
            }));

            const { error: optionsError } = await supabase
              .from('survey_options')
              .insert(optionsToInsert);

            if (optionsError) {
              console.error('Error creating survey options:', optionsError);
              return { survey: null, error: optionsError };
            }
          }
        }
      }

      // Return the created survey with its ID
      return { 
        survey: { 
          ...survey, 
          id: surveyData.id,
        }, 
        error: null 
      };

    } catch (error) {
      console.error('Error in createSurvey:', error);
      return { survey: null, error };
    }
  }

  /**
   * Get all surveys for a user with their pages and options
   */
  static async getSurveysByUser(userId: string): Promise<{ surveys: ISurvey[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select(`
          *,
          survey_pages (
            *,
            survey_options (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching surveys:', error);
        return { surveys: null, error };
      }

      // Transform the data to match our interface
      const transformedSurveys = data?.map(survey => ({
        id: survey.id,
        title: survey.title,
        description: survey.description,
        user_id: survey.user_id,
        pages: survey.survey_pages?.map((page: any) => ({
          id: page.id,
          survey_id: page.survey_id,
          title: page.title,
          description: page.description,
          type: page.type,
          placeholder: page.placeholder,
          redirect_url: page.redirect_url,
          rating_type: page.rating_type,
          rating_scale: page.rating_scale,
          allow_multiple: page.allow_multiple,
          options: page.survey_options?.map((option: any) => option.option_text) || [],
        })) || [],
      })) || [];

      return { surveys: transformedSurveys, error: null };
    } catch (error) {
      console.error('Error in getSurveysByUser:', error);
      return { surveys: null, error };
    }
  }

  /**
   * Get a single survey by ID with its pages and options
   */
  static async getSurveyById(surveyId: string): Promise<{ survey: ISurvey | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select(`
          *,
          survey_pages (
            *,
            survey_options (*)
          )
        `)
        .eq('id', surveyId)
        .single();

      if (error) {
        console.error('Error fetching survey:', error);
        return { survey: null, error };
      }

      // Transform the data to match our interface
      const transformedSurvey = {
        id: data.id,
        title: data.title,
        description: data.description,
        user_id: data.user_id,
        pages: data.survey_pages?.map((page: any) => ({
          id: page.id,
          survey_id: page.survey_id,
          title: page.title,
          description: page.description,
          type: page.type,
          placeholder: page.placeholder,
          redirect_url: page.redirect_url,
          rating_type: page.rating_type,
          rating_scale: page.rating_scale,
          allow_multiple: page.allow_multiple,
          options: page.survey_options?.map((option: any) => option.option_text) || [],
        })) || [],
      };

      return { survey: transformedSurvey, error: null };
    } catch (error) {
      console.error('Error in getSurveyById:', error);
      return { survey: null, error };
    }
  }

  /**
   * Update an existing survey
   */
  static async updateSurvey(surveyId: string, survey: Partial<ISurvey>): Promise<{ survey: ISurvey | null; error: any }> {
    try {
      // First, delete all existing pages and options for this survey
      const { data: existingPages, error: pagesFetchError } = await supabase
        .from('survey_pages')
        .select('id')
        .eq('survey_id', surveyId);

      if (pagesFetchError) {
        console.error('Error fetching existing pages for update:', pagesFetchError);
        return { survey: null, error: pagesFetchError };
      }

      // Delete existing options for all pages
      if (existingPages && existingPages.length > 0) {
        const pageIds = existingPages.map(page => page.id);
        const { error: optionsError } = await supabase
          .from('survey_options')
          .delete()
          .in('page_id', pageIds);

        if (optionsError) {
          console.error('Error deleting existing options:', optionsError);
          return { survey: null, error: optionsError };
        }
      }

      // Delete existing pages
      const { error: pagesDeleteError } = await supabase
        .from('survey_pages')
        .delete()
        .eq('survey_id', surveyId);

      if (pagesDeleteError) {
        console.error('Error deleting existing pages:', pagesDeleteError);
        return { survey: null, error: pagesDeleteError };
      }

      // Update the survey basic info
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .update({
          title: survey.title,
          description: survey.description,
        })
        .eq('id', surveyId)
        .select()
        .single();

      if (surveyError) {
        console.error('Error updating survey:', surveyError);
        return { survey: null, error: surveyError };
      }

      // If there are pages, create them
      if (survey.pages && survey.pages.length > 0) {
        for (const page of survey.pages) {
          // Create the survey page
          const { data: pageData, error: pageError } = await supabase
            .from('survey_pages')
            .insert({
              survey_id: surveyId,
              title: page.title,
              description: page.description,
              type: page.type,
              placeholder: page.placeholder || null,
              redirect_url: page.redirect_url || null,
              link_text: page.link_text || null,
              rating_type: page.rating_type || null,
              rating_scale: page.rating_scale || null,
              allow_multiple: page.allow_multiple || false,
            })
            .select()
            .single();

          if (pageError) {
            console.error('Error creating survey page:', pageError);
            return { survey: null, error: pageError };
          }

          // If this is a multi-choice question and has options, create them
          if (page.type === 'mcq' && page.options && page.options.length > 0) {
            const optionsToInsert = page.options.map(optionText => ({
              page_id: pageData.id,
              option_text: optionText,
            }));

            const { error: optionsError } = await supabase
              .from('survey_options')
              .insert(optionsToInsert);

            if (optionsError) {
              console.error('Error creating survey options:', optionsError);
              return { survey: null, error: optionsError };
            }
          }
        }
      }

      // Return the updated survey
      return { survey: surveyData, error: null };
    } catch (error) {
      console.error('Error in updateSurvey:', error);
      return { survey: null, error };
    }
  }

  /**
   * Delete a survey and all its pages and options
   */
  static async deleteSurvey(surveyId: string): Promise<{ error: any }> {
    try {
      // First, get all page IDs for this survey
      const { data: pages, error: pagesFetchError } = await supabase
        .from('survey_pages')
        .select('id')
        .eq('survey_id', surveyId);

      if (pagesFetchError) {
        console.error('Error fetching survey pages for deletion:', pagesFetchError);
        return { error: pagesFetchError };
      }

      // Delete survey options for all pages
      if (pages && pages.length > 0) {
        const pageIds = pages.map(page => page.id);
        const { error: optionsError } = await supabase
          .from('survey_options')
          .delete()
          .in('page_id', pageIds);

        if (optionsError) {
          console.error('Error deleting survey options:', optionsError);
          return { error: optionsError };
        }
      }

      // Delete survey pages
      const { error: pagesError } = await supabase
        .from('survey_pages')
        .delete()
        .eq('survey_id', surveyId);

      if (pagesError) {
        console.error('Error deleting survey pages:', pagesError);
        return { error: pagesError };
      }

      // Delete the survey
      const { error: surveyError } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

      if (surveyError) {
        console.error('Error deleting survey:', surveyError);
        return { error: surveyError };
      }

      return { error: null };
    } catch (error) {
      console.error('Error in deleteSurvey:', error);
      return { error };
    }
  }
} 