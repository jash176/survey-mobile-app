import CreateSurveyPreview from "@/components/survey/CreateSurveyPreview";
import SurveyTypeCard from "@/components/SurveyTypeCard";
import TopProgressLoader from "@/components/ui/TopProgressLoader";
import { SURVEY_TEMPLATES } from "@/constants/surveyData";
import { useAuth } from "@/lib/authContext";
import { SurveyService } from "@/lib/surveyService";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewSurvey = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const handleSurveyCreation = async (item: any) => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { survey, error } = await SurveyService.createSurvey(item, user.id);
      if (survey && !error) {
        router.replace({
          pathname: "/surveys/[id]",
          params: { id: survey.id, template: JSON.stringify(item) },
        });
      }
    } catch (error) {
      console.error("Error creating the survey : ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <TopProgressLoader isLoading={isLoading} />
        <View className="flex-row items-center justify-between px-4">
          <Text className="text-white font-bold text-2xl">New Survey</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <FlatList
            data={SURVEY_TEMPLATES}
            contentContainerClassName="p-5 gap-5"
            style={{ pointerEvents: isLoading ? "none" : "auto" }}
            renderItem={({ item }) => {
              return (
                <SurveyTypeCard
                  title={item.title}
                  subtitle={item.description}
                  borderColor={item.color}
                  onPress={() => handleSurveyCreation(item)}
                  surveyType={<CreateSurveyPreview survey={item.pages[0]} />}
                />
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewSurvey;
