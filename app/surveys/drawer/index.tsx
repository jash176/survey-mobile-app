import { SurveyItem } from "@/components/survey/SurveyItem";
import { Button } from "@/components/ui/Button";
import EmptyListComponent from "@/components/ui/EmptyListComponent";
import IconButton from "@/components/ui/IconButton";
import { theme } from "@/constants/theme";
import { useFilters } from "@/contexts/FilterContext";
import { useAuth } from "@/lib/authContext";
import { SurveyService } from "@/lib/surveyService";
import { ISurvey } from "@/types/survey.interface";
import { filterSurveys } from "@/utils/filterSurveys";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SurveysIndex = () => {
  const { user } = useAuth();
  const { filters } = useFilters();
  const [isLoading, setIsLoading] = useState(false);
  const [surveys, setSurveys] = useState<Array<ISurvey>>([]);
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
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
  const filteredSurveys = useMemo(() => {
    return filterSurveys(surveys, filters);
  }, [surveys, filters]);

  useFocusEffect(
    useCallback(() => {
      fetchSurveys();
    }, [])
  );
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background ">
        <View className="p-5 flex-row items-center justify-between border-t border-b border-borderPrimary">
          <View className="flex-row items-center gap-2">
            <IconButton
              icon={
                <Feather
                  name="sidebar"
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              onPress={() => openDrawer()}
            />
            <Text className="text-white font-bold text-2xl">{`Surveys (${surveys.length})`}</Text>
          </View>
          <Button title="New Survey" onPress={handleNewSurveyPress} />
        </View>
        <FlatList
          data={filteredSurveys}
          renderItem={({ item }) => <SurveyItem item={item} />}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => {
            const hasFilters = !!filters.selectedType;

            return (
              <View className="flex-1 justify-center items-center">
                <View className="mb-10 justify-center items-center">
                  <Text className="text-white font-bold text-3xl">
                    {hasFilters ? "No surveys found" : "No surveys created"}
                  </Text>
                  <Text className="text-white text-base text-center mt-2">
                    {hasFilters
                      ? "No surveys match your current filters.\nTry adjusting your search or filter criteria."
                      : "No surveys have been created yet, create your first one to start collecting feedback."}
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
