import { PageLocal, SurveyTypes } from "@/types/survey.interface";
import React from "react";
import Link from "./Link";
import MultiChoice from "./MultiChoice";
import Question from "./Question";
import Rating, { RatingType } from "./Rating";

interface CreateSurveyPreviewProps {
  survey: PageLocal;
}

const CreateSurveyPreview: React.FC<CreateSurveyPreviewProps> = (props) => {
  const { survey } = props;
  const title = survey.title;
  const description = survey.description;
  const linkText = survey.link_text || "";
  const ratingType = survey.rating_type;
  const lowLabel = survey.low_label;
  const highLabel = survey.high_label;
  const options = survey.options || [];
  const ratingScale = survey.rating_scale || 10;

  switch (survey.type) {
    case SurveyTypes.text:
      return (
        <Question
          title={title}
          description={description}
          placeholder={survey.placeholder}
          onSubmit={() => {}}
        />
      );
    case SurveyTypes.link:
      return (
        <Link
          title={title}
          description={description}
          linkText={linkText}
          onLinkPress={() => {}}
        />
      );
    case SurveyTypes.rating:
      return (
        <Rating
          title={title}
          description={description}
          type={ratingType as RatingType}
          lowLabel={lowLabel}
          highLabel={highLabel}
          onRatingChange={() => {}}
          ratingScale={ratingScale}
        />
      );
    case SurveyTypes.mcq:
      return (
        <MultiChoice
          title={title}
          description={description}
          options={options}
          onSelect={() => {}}
        />
      );
    default:
      return null;
  }
};

export default CreateSurveyPreview;
