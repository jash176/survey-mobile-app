import { theme } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import Slider from "@react-native-community/slider";
import React from "react";
import { Text, View } from "react-native";
import IconButton from "../ui/IconButton";
import { Input } from "../ui/Input";
import { RatingType } from "./Rating";

interface RatingSurveyContentProps {
  onChangeRatingType: (value: RatingType) => void;
  lowLabel: string;
  onChangeLowLabel: (value: string) => void;
  highLabel: string;
  onChangeHighLabel: (value: string) => void;
  ratingType?: RatingType;
  ratingScale: number;
  onChangeRatingScale: (value: number) => void;
}

const RatingSurveyContent: React.FC<RatingSurveyContentProps> = (props) => {
  const {
    onChangeRatingType,
    highLabel,
    lowLabel,
    onChangeHighLabel,
    onChangeLowLabel,
    ratingType,
    onChangeRatingScale,
    ratingScale,
  } = props;
  return (
    <>
      <View>
        <Text className="text-white font-medium mb-2">Survey type</Text>
        <View className="flex-row flex-wrap items-center gap-3">
          <IconButton
            onPress={() => onChangeRatingType(RatingType.NPS)}
            className="grow"
            icon={
              <AntDesign
                name="star"
                size={16}
                color={theme.colors.textSecondary}
              />
            }
            title="NPS"
            style={{
              backgroundColor:
                ratingType === RatingType.NPS ? "#242838" : "transparent",
            }}
          />
          <IconButton
            onPress={() => onChangeRatingType(RatingType.NUMBER)}
            className="grow"
            icon={
              <Octicons
                name="number"
                size={16}
                color={theme.colors.textSecondary}
              />
            }
            title="Number"
            style={{
              backgroundColor:
                ratingType === RatingType.NUMBER ? "#242838" : "transparent",
            }}
          />
          <IconButton
            onPress={() => onChangeRatingType(RatingType.EMOJI)}
            className="grow"
            icon={
              <Feather
                name="smile"
                size={16}
                color={theme.colors.textSecondary}
              />
            }
            title="Emoji"
            style={{
              backgroundColor:
                ratingType === RatingType.EMOJI ? "#242838" : "transparent",
            }}
          />
        </View>
      </View>
      {ratingType === RatingType.NUMBER && (
        <View>
          <Text className="text-white font-medium mb-2">Scale</Text>
          <Slider
            className="w-full"
            value={ratingScale}
            onValueChange={onChangeRatingScale}
            step={1}
            minimumValue={1}
            maximumValue={10}
            minimumTrackTintColor="#394BE9"
            maximumTrackTintColor="#394BE933"
            thumbTintColor="#857FFF"
          />
        </View>
      )}
      <Input
        label="Low Label"
        value={lowLabel}
        placeholder="Low Label"
        onChangeText={onChangeLowLabel}
      />
      <Input
        label="High Label"
        value={highLabel}
        placeholder="High Label"
        onChangeText={onChangeHighLabel}
      />
    </>
  );
};

export default RatingSurveyContent;
