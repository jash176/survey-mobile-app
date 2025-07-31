import { RatingType } from "@/components/survey/Rating";

export enum SurveyTypes {
  text = "text",
  mcq = "mcq",
  rating = "rating",
  link = "link",
}

interface SurveyPage {
  id: string;
  survey_id?: string;
  title: string;
  description: string;
  type: keyof typeof SurveyTypes;
  placeholder: string;
  redirect_url: string;
  link_text: string;
  low_label: string;
  high_label: string;
  rating_type?: RatingType;
  rating_scale: number;
  options: string[];
  allow_multiple: boolean;
}

export interface SurveyOption {
  id: string;
  page_id: string;
  option_text: string;
}

export interface ISurvey {
  id: string;
  title: string;
  description: string;
  user_id?: string;
  pages: SurveyPage[];
}

export type SurveyPageInput = Omit<SurveyPage, "id">;
export type SurveyInput = {
  title: string;
  description: string;
  user_id?: string;
  pages: SurveyPageInput[];
};

// Local interface for managing survey state with additional UI properties
export interface SurveyLocal {
  title: string;
  description: string;
  pages: PageLocal[];
}

export interface PageLocal extends SurveyPageInput {
  id: string; // For local state management
}

export type DatabaseSurveyFields = {
  id: string;
  title: string;
  description: string;
  user_id?: string;
  survey_pages: DatabaseSurveyPages[];
};

export type DatabaseSurveyPages = Omit<SurveyPage, "options"> & {
  survey_options?: SurveyOption[];
};
