// components/CustomDrawerContent.tsx
import { theme } from "@/constants/theme";
import { useFilters } from "@/contexts/FilterContext";
import { useAuth } from "@/lib/authContext";
import { SurveyTypes } from "@/types/survey.interface";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const OPTIONS = [
  {
    id: "text",
    label: "Text",
    type: SurveyTypes.text,
    icon: (
      <AntDesign name="message1" size={16} color={theme.colors.textSecondary} />
    ),
  },
  {
    id: "link",
    label: "Link",
    type: SurveyTypes.link,
    icon: (
      <AntDesign name="link" size={16} color={theme.colors.textSecondary} />
    ),
  },
  {
    id: "rating",
    label: "Rating",
    type: SurveyTypes.rating,
    icon: (
      <AntDesign name="star" size={16} color={theme.colors.textSecondary} />
    ),
  },
  {
    id: "mcq",
    label: "Multiple Choice",
    type: SurveyTypes.mcq,
    icon: <Feather name="menu" size={16} color={theme.colors.textSecondary} />,
  },
];

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  const { signOut } = useAuth();
  const { filters, toggleFilterType, clearFilters } = useFilters();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFilterPress = (type: SurveyTypes) => {
    toggleFilterType(type);
  };

  const handleResetFilters = () => {
    clearFilters();
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 0,
      }}
      bounces={false}
    >
      <View className="p-5 border-b border-borderPrimary">
        <Text className="text-white font-bold text-xl">Surveys</Text>
      </View>
      <View className="p-3 flex-1">
        <Text className="text-textSecondary font-medium text-lg p-2">Type</Text>
        <View>
          {OPTIONS.map((item) => {
            const isSelected = filters.selectedType === item.type;
            return (
              <TouchableOpacity
                key={item.id}
                className={`p-2 flex-row items-center gap-2 ${isSelected ? "bg-[#242838] rounded-lg" : ""}`}
                onPress={() => handleFilterPress(item.type)}
              >
                {item.icon}
                <Text
                  className={`font-bold text-lg ${isSelected ? "text-white" : "text-textSecondary"}`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {filters.selectedType && (
          <View className="mt-4">
            <TouchableOpacity
              className="p-2 flex-row items-center gap-2"
              onPress={handleResetFilters}
            >
              <AntDesign
                name="reload1"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text className="text-textSecondary font-bold text-lg">
                Reset all filters
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View className="p-3 border-t border-borderPrimary">
        <TouchableOpacity
          className="p-2 flex-row items-center gap-2"
          onPress={handleSignOut}
        >
          <AntDesign
            name="logout"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text className="text-textSecondary font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}
