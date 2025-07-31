import React from "react";
import { Input } from "../ui/Input";

interface TextSurveyContentProps {
  value: string;
  onChangeText: (value: string) => void;
  label: string;
  placeholder?: string;
}

const TextSurveyContent: React.FC<TextSurveyContentProps> = (props) => {
  const { onChangeText, value, label, placeholder } = props;
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      label={label}
      placeholder={placeholder}
    />
  );
};

export default TextSurveyContent;
