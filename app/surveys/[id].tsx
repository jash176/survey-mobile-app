import CreateSurveyPreview from "@/components/survey/CreateSurveyPreview";
import LinkSurveyContent from "@/components/survey/LinkSurveyContent";
import MultiChoiceSurveyContent from "@/components/survey/MultiChoiceSurveyContent";
import { RatingType } from "@/components/survey/Rating";
import RatingSurveyContent from "@/components/survey/RatingSurveyContent";
import TextSurveyContent from "@/components/survey/TextSurveyContent";
import { Button } from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { SURVEY_TYPES } from "@/constants/surveyData";
import { theme } from "@/constants/theme";
import { useAuth } from "@/lib/authContext";
import { SurveyService } from "@/lib/surveyService";
import {
  PageLocal,
  SurveyInput,
  SurveyLocal,
  SurveyTypes,
} from "@/types/survey.interface";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";

const Survey = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [newOption, setNewOption] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Default survey state
  const defaultSurvey: SurveyLocal = {
    title: "Open question",
    description: "Gather open-ended thoughts your users have about a topic.",
    pages: [
      {
        id: "1", // Local ID for state management
        type: "text",
        title: "What could we do better",
        description:
          "Is there anything we could do to make tempo better for you?",
        placeholder: "",
        rating_type: RatingType.NPS,
        rating_scale: 10,
        low_label: "Poor",
        high_label: "Excellent",
        link_text: "Link Text",
        redirect_url: "https://tempo.new",
        options: ["Excellent"],
        allow_multiple: false,
      },
    ],
  };

  const [survey, setSurvey] = useState<SurveyLocal>(defaultSurvey);

  // Initialize survey with template data if provided
  useEffect(() => {
    if (params.template) {
      try {
        const templateData = JSON.parse(params.template as string);
        const templatePages = templateData.pages.map(
          (page: PageLocal, index: number) => ({
            id: `template-${index}`, // Generate local ID
            type: page.type,
            title: page.title,
            description: page.description,
            placeholder: page.placeholder,
            rating_type: page.rating_type,
            rating_scale: page.rating_scale,
            low_label: page.low_label,
            high_label: page.high_label,
            link_text: page.link_text,
            redirect_url: page.redirect_url,
            options: page.options,
            allow_multiple: page.allow_multiple,
          })
        );

        const newSurvey: SurveyLocal = {
          title: templateData.title || "New Survey",
          description: templateData.description || "Survey description",
          pages: templatePages,
        };
        setSurvey(newSurvey);
      } catch (error) {
        console.error("Error parsing template data:", error);
      }
    } else {
      console.log("No template data provided, using default survey");
    }
  }, [params]);

  useEffect(() => {
    const fetchSurvey = async () => {
      if (params.id) {
        try {
          const { survey: fetchedSurvey, error } =
            await SurveyService.getSurveyById(params.id as string);
          if (fetchedSurvey) {
            const localPages: PageLocal[] = fetchedSurvey.pages.map((page) => ({
              ...page,
              id: page.id,
            }));

            setSurvey({
              title: fetchedSurvey.title || "",
              description: fetchedSurvey.description || "",
              pages: localPages,
            });
          }
          if (error) {
            console.error("Error fetching survey by id:", error);
          }
        } catch (err) {
          console.error("Unexpected error fetching survey by id:", err);
        }
      }
    };
    fetchSurvey();
  }, [params.id]);

  const handleFieldChange = (
    field: keyof PageLocal,
    value: any,
    pageId: string
  ) => {
    setSurvey((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === pageId ? { ...page, [field]: value } : page
      ),
    }));
  };

  const handleSaveSurvey = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a survey");
      return;
    }

    setIsSaving(true);
    try {
      // Transform the survey data to match the database schema
      const surveyData: SurveyInput = {
        title: survey.title,
        description: survey.description,
        pages: survey.pages.map((page) => ({
          title: page.title,
          description: page.description,
          type: page.type,
          placeholder: page.placeholder,
          redirect_url: page.redirect_url,
          link_text: page.link_text,
          low_label: page.low_label,
          high_label: page.high_label,
          rating_type: page.rating_type,
          rating_scale: page.rating_scale,
          options: page.options,
          allow_multiple: page.allow_multiple,
        })),
      };

      let result;
      if (params.id) {
        // Update existing survey
        result = await SurveyService.updateSurvey(
          params.id as string,
          surveyData
        );
      } else {
        // Create new survey
        result = await SurveyService.createSurvey(surveyData, user.id);
      }

      const { survey: savedSurvey, error } = result;

      if (error) {
        Alert.alert("Error", `Failed to save survey: ${error.message}`);
        return;
      }

      Alert.alert("Success", "Survey saved successfully!");
    } catch (error) {
      console.error("Error saving survey:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while saving the survey"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <View className="p-5 flex-row items-center justify-between border-t border-b border-borderPrimary">
          <IconButton
            icon={
              <AntDesign
                name="delete"
                size={16}
                color={theme.colors.textSecondary}
              />
            }
          />
          <View className="flex-row items-center justify-center gap-3">
            <IconButton
              icon={
                <AntDesign
                  name="pausecircle"
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              title="Not Running"
            />
            <Button
              title={isSaving ? "Saving..." : "Save Survey"}
              onPress={handleSaveSurvey}
              disabled={isSaving}
            />
          </View>
        </View>
        <ScrollView>
          <View className="p-6 gap-4 border-b border-borderPrimary">
            <Text className="text-textPrimary text-lg font-bold">
              Internal survey information
            </Text>
            <Input
              label="Title"
              placeholder="Title"
              value={survey.title}
              onChangeText={(value) =>
                setSurvey((prev) => ({ ...prev, title: value }))
              }
            />
            <Input
              label="Description"
              placeholder="Description"
              value={survey.description}
              onChangeText={(value) =>
                setSurvey((prev) => ({ ...prev, description: value }))
              }
            />
          </View>
          <View className="p-6 gap-4 border-b border-borderPrimary">
            <Text className="text-textPrimary text-lg font-bold">
              Survey pages
            </Text>
            {survey.pages.map((surv) => {
              const title = surv.title;
              const description = surv.description;
              return (
                <View
                  key={surv.id}
                  className="border border-borderPrimary rounded-lg bg-[#24283833]"
                >
                  <View className="p-5 flex-row items-center justify-between border-b border-borderPrimary">
                    <Text className="text-textSecondary text-lg font-bold">
                      {title}
                    </Text>
                  </View>
                  <View className="p-5">
                    <Text className="text-textPrimary text-lg font-bold">
                      Type
                    </Text>
                    <View className="mt-3 flex-row flex-wrap gap-3">
                      {SURVEY_TYPES.map((item) => (
                        <View
                          key={item.type}
                          style={{ flex: 1, minWidth: "48%" }}
                        >
                          <IconButton
                            onPress={() =>
                              handleFieldChange("type", item.type, surv.id)
                            }
                            icon={
                              <Feather
                                name={item.icon as any}
                                size={16}
                                color={theme.colors.textSecondary}
                              />
                            }
                            title={item.label}
                            style={{
                              backgroundColor:
                                surv.type === item.type
                                  ? "#242838"
                                  : "transparent",
                            }}
                          />
                        </View>
                      ))}
                    </View>
                    <View className="gap-4 mt-4">
                      <Input
                        label="Title"
                        value={title}
                        placeholder="Title"
                        onChangeText={(value) =>
                          handleFieldChange("title", value, surv.id)
                        }
                      />
                      <Input
                        label="Description"
                        value={description}
                        placeholder="Description"
                        onChangeText={(value) =>
                          handleFieldChange("description", value, surv.id)
                        }
                      />
                      {surv.type === SurveyTypes.text && (
                        <TextSurveyContent
                          label={"Placeholder"}
                          placeholder="Placholder"
                          onChangeText={(value) =>
                            handleFieldChange("placeholder", value, surv.id)
                          }
                          value={surv.placeholder}
                        />
                      )}
                      {surv.type === SurveyTypes.link && (
                        <LinkSurveyContent
                          linkText={surv.link_text}
                          onLinkTextChange={(value) =>
                            handleFieldChange("link_text", value, surv.id)
                          }
                          redirectUrl={surv.redirect_url}
                          onRedirectUrlChange={(value) =>
                            handleFieldChange("redirect_url", value, surv.id)
                          }
                        />
                      )}
                      {surv.type === SurveyTypes.rating && (
                        <RatingSurveyContent
                          highLabel={surv.high_label}
                          lowLabel={surv.low_label}
                          onChangeHighLabel={(value) =>
                            handleFieldChange("high_label", value, surv.id)
                          }
                          onChangeLowLabel={(value) =>
                            handleFieldChange("low_label", value, surv.id)
                          }
                          ratingType={surv.rating_type}
                          onChangeRatingScale={(value) =>
                            handleFieldChange("rating_scale", value, surv.id)
                          }
                          ratingScale={surv.rating_scale}
                          onChangeRatingType={(value) =>
                            handleFieldChange("rating_type", value, surv.id)
                          }
                        />
                      )}
                      {surv.type === SurveyTypes.mcq && (
                        <MultiChoiceSurveyContent
                          onUpdateOptions={(options) =>
                            handleFieldChange("options", options, surv.id)
                          }
                          options={surv.options}
                        />
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View className="px-4 py-7">
            <View className="p-6 shadow border border-borderPrimary rounded-lg bg-[#1d212d]">
              <CreateSurveyPreview survey={survey.pages[0]} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Survey;
