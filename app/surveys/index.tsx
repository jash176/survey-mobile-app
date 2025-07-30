import { Button } from "@/components/ui/Button";
import EmptyListComponent from "@/components/ui/EmptyListComponent";
import IconButton from "@/components/ui/IconButton";
import { theme } from "@/constants/theme";
import { useAuth } from "@/lib/authContext";
import { ISurvey, SurveyService } from "@/lib/surveyService";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SurveysIndex = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Array<ISurvey>>([]);
  const handleNewSurveyPress = () => {
    router.push("/surveys/new");
  };
  const fetchSurveys = async () => {
    if (!user) return;
    try {
      const response = await SurveyService.getSurveysByUser(user.id);
      if (response.surveys) {
        setSurveys(response.surveys);
      }
    } catch (error) {
      console.error("Error fetching surveys : ", error);
    }
  };
  useEffect(() => {
    fetchSurveys();
  }, []);
  const renderSurveyItem: ListRenderItem<ISurvey> = ({ item, index }) => {
    return (
      <View className="p-6">
        <Text className="text-textPrimary font-bold text-xl">{item.title}</Text>
        <Text
          className="text-textPrimary font-medium text-lg"
          numberOfLines={1}
        >
          {item.description}
        </Text>
        <View className="pt-4 flex-row items-center justify-between gap-4">
          {item.pages && item.pages.length > 0 && (
            <Text className="capitalize text-textPrimary text-lg">
              {item.pages[0].type}
            </Text>
          )}
          <IconButton
            className="pointer-events-none grow"
            icon={<Text className="text-textSecondary font-bold">0</Text>}
            title="Responses"
          />
          <IconButton
            className="grow"
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
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background px-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-bold text-2xl">{`Surveys (${surveys.length})`}</Text>
          <Button title="New Survey" onPress={handleNewSurveyPress} />
        </View>
        <FlatList
          data={surveys}
          renderItem={renderSurveyItem}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={() => {
            return (
              <View className="flex-1 justify-center items-center">
                <View className="mb-10 justify-center items-center">
                  <Text className="text-white font-bold text-3xl">
                    No surveys created
                  </Text>
                  <Text className="text-white text-base text-center mt-2">
                    No surveys have been created yet, create your first one to
                    start collecting feedback.
                  </Text>
                </View>
                <EmptyListComponent />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SurveysIndex;
