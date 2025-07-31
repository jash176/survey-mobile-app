import { FilterState } from "@/contexts/FilterContext";
import { ISurvey } from "@/types/survey.interface";

export const filterSurveys = (
  surveys: ISurvey[],
  filters: FilterState
): ISurvey[] => {
  return surveys.filter((survey) => {
    // Filter by survey types
    if (filters.selectedType) {
      const surveyTypes = survey.pages.map((page) => page.type);
      const hasMatchingType = surveyTypes.includes(filters.selectedType);

      if (!hasMatchingType) {
        return false;
      }
    }

    return true;
  });
};
