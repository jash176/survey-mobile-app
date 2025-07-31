import { theme } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "../ui/Button";
import IconButton from "../ui/IconButton";
import { Input } from "../ui/Input";

interface MultiChoiceSurveyContentProps {
  options: string[];
  onUpdateOptions: (options: string[]) => void;
}

const MultiChoiceSurveyContent: React.FC<MultiChoiceSurveyContentProps> = (
  props
) => {
  const { options, onUpdateOptions } = props;
  const [newOption, setNewOption] = useState("");
  const handleAddOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, newOption.trim()];
      onUpdateOptions(updatedOptions);
      setNewOption("");
    }
  };

  const handleDeleteOption = (optionIndex: number) => {
    const updatedOptions = options.filter((_, i) => i !== optionIndex);
    onUpdateOptions(updatedOptions);
  };
  return (
    <>
      <View>
        <Text className="text-white font-medium mb-2">Options</Text>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Input
              value={newOption}
              onChangeText={setNewOption}
              placeholder="Add an option"
              onSubmitEditing={handleAddOption}
            />
          </View>
          <Button title="Add option" onPress={handleAddOption} />
        </View>
      </View>
      {options.length > 0 && (
        <View className="gap-2">
          {options.map((option, optionIndex) => (
            <View
              key={optionIndex}
              className="flex-row items-center p-[6px] justify-between px-3 bg-[#24283833] rounded-lg border border-borderPrimary"
            >
              <Text className="text-textPrimary flex-1">{option}</Text>
              <IconButton
                onPress={() => handleDeleteOption(optionIndex)}
                icon={
                  <Feather
                    name="trash-2"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                }
                title="Delete"
              />
            </View>
          ))}
        </View>
      )}
    </>
  );
};

export default MultiChoiceSurveyContent;
