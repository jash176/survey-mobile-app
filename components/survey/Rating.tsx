import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Rating type enum
export enum RatingType {
  NPS = "NPS",
  NUMBER = "NUMBER",
  EMOJI = "EMOJI",
}

interface RatingProps {
  title?: string;
  description?: string;
  lowLabel?: string;
  highLabel?: string;
  type: keyof typeof RatingType;
  onRatingChange: (rating: number) => void;
}

const Rating = ({
  title = "How likely are you to recommend us to a friend?",
  description,
  lowLabel = "Very unlikely",
  highLabel = "Very likely",
  type = RatingType.NPS,
  onRatingChange,
}: RatingProps) => {
  const handleRatingSelect = (rating: number) => {
    onRatingChange(rating);
  };

  const renderNumRating = (isNps?: boolean) => {
    return (
      <View className="flex-row justify-between items-center mt-4">
        {Array.from({ length: isNps ? 11 : 10 }, (_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleRatingSelect(i)}
            className={`px-2 h-12 border justify-center items-center border-borderPrimary bg-[#32384d59] rounded-md`}
          >
            <Text className={`text-base font-bold text-white`}>
              {isNps ? i : i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderEmojiRating = () => {
    const emojis = ["😡", "😞", "😐", "😊", "😍"];

    return (
      <View className="flex-row justify-between items-center mt-4">
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleRatingSelect(index + 1)}
            className={`grow mx-2 h-12 border justify-center items-center border-borderPrimary bg-[#32384d59] rounded-md`}
          >
            <Text className="text-3xl mb-1">{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRatingContent = () => {
    switch (type) {
      case RatingType.NPS:
        return renderNumRating(true);
      case RatingType.EMOJI:
        return renderEmojiRating();
      case RatingType.NUMBER:
        return renderNumRating();
      default:
        return renderNumRating();
    }
  };

  return (
    <View>
      <Text className="text-white text-xl font-medium mb-2">{title}</Text>

      {description && (
        <Text className="text-gray-400 text-base mb-4">{description}</Text>
      )}

      {/* Rating Content */}
      {renderRatingContent()}

      {(lowLabel || highLabel) && (
        <View className="flex-row justify-between mt-3">
          {lowLabel && (
            <Text className="text-gray-400 text-xs">{lowLabel}</Text>
          )}
          {highLabel && (
            <Text className="text-gray-400 text-xs">{highLabel}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Rating;
