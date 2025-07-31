import { theme } from "@/constants/theme";
import { ISurvey } from "@/types/survey.interface";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import IconButton from "../ui/IconButton";

interface SurveyItemProps {
  item: ISurvey;
}

export const SurveyItem: React.FC<SurveyItemProps> = ({ item }) => {
  return (
    <Pressable
      onPress={() => {
        if (item.id) {
          router.push({ pathname: "/surveys/[id]", params: { id: item.id } });
        }
      }}
      className="p-6"
    >
      <Text className="text-textPrimary font-bold text-xl">{item.title}</Text>
      <Text className="text-textPrimary font-medium text-lg" numberOfLines={1}>
        {item.description}
      </Text>
      <View className="pt-4 flex-row items-center justify-between">
        {item.pages && item.pages.length > 0 && (
          <Text className="capitalize text-textPrimary text-lg">
            {item.pages[0].type}
          </Text>
        )}
        <View className="flex-row items-center gap-4">
          <IconButton
            className="pointer-events-none"
            icon={<Text className="text-textSecondary font-bold">0</Text>}
            title="Responses"
          />
          <IconButton
            className=""
            icon={
              <AntDesign
                name="pausecircle"
                size={16}
                color={theme.colors.textSecondary}
              />
            }
            title="Not Running"
          />
        </View>
      </View>
    </Pressable>
  );
};
