import { SurveyItem } from "@/components/survey/SurveyItem";
import { Button } from "@/components/ui/Button";
import EmptyListComponent from "@/components/ui/EmptyListComponent";
import { theme } from "@/constants/theme";
import { useAuth } from "@/lib/authContext";
import { SurveyService } from "@/lib/surveyService";
import { ISurvey } from "@/types/survey.interface";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SurveysIndex = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [surveys, setSurveys] = useState<Array<ISurvey>>([]);
  const handleNewSurveyPress = () => {
    router.push("/surveys/new");
  };
  const fetchSurveys = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await SurveyService.getSurveysByUser(user.id);
      if (response.surveys) {
        setSurveys(response.surveys);
      }
    } catch (error) {
      console.error("Error fetching surveys : ", error);
    } finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchSurveys();
    }, [])
  );
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background px-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white font-bold text-2xl">{`Surveys (${surveys.length})`}</Text>
          <Button title="New Survey" onPress={handleNewSurveyPress} />
        </View>
        <FlatList
          data={surveys}
          renderItem={({ item, index }) => <SurveyItem item={item} />}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item) => item.id.toString()}
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
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchSurveys}
              tintColor={theme.colors.textSecondary}
              colors={[theme.colors.textSecondary]}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SurveysIndex;
