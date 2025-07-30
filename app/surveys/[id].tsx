import Link from "@/components/survey/Link";
import MultiChoice from "@/components/survey/MultiChoice";
import Question from "@/components/survey/Question";
import Rating, { RatingType } from "@/components/survey/Rating";
import { Button } from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { useAuth } from "@/lib/authContext";
import {
  SurveyInput,
  SurveyPageInput,
  SurveyService,
} from "@/lib/surveyService";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";

// Local interface for managing survey state with additional UI properties
export interface SurveyLocal {
  title: string;
  description: string;
  pages: PageLocal[];
}

export interface PageLocal extends SurveyPageInput {
  id: string; // For local state management
}

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
          (page: any, index: number) => ({
            id: `template-${index}`, // Generate local ID
            type: page.type,
            title: page.title || "",
            description: page.description || "",
            placeholder: page.placeholder || "",
            rating_type: page.rating_type || "NPS",
            rating_scale: page.rating_scale || 10,
            low_label: page.low_label || "",
            high_label: page.high_label || "",
            link_text: page.link_text || "",
            redirect_url: page.redirect_url || "",
            options: page.options || [],
            allow_multiple: page.allow_multiple || false,
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
  }, [params.template]);

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
  const SURVEY_TYPES = [
    {
      type: "text",
      label: "Text",
      icon: (
        <Feather name="edit-3" size={16} color={theme.colors.textSecondary} />
      ),
    },
    {
      type: "link",
      label: "Link",
      icon: (
        <Feather
          name="external-link"
          size={16}
          color={theme.colors.textSecondary}
        />
      ),
    },
    {
      type: "rating",
      label: "Rating",
      icon: (
        <Feather name="star" size={16} color={theme.colors.textSecondary} />
      ),
    },
    {
      type: "mcq",
      label: "Multi-Choice",
      icon: (
        <Feather name="list" size={16} color={theme.colors.textSecondary} />
      ),
    },
  ];

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
          type: page.type as "text" | "link" | "rating" | "mcq",
          placeholder: page.placeholder || undefined,
          redirect_url: page.redirect_url || undefined,
          link_text: page.link_text || undefined,
          low_label: page.low_label || undefined,
          high_label: page.high_label || undefined,
          rating_type: page.rating_type || undefined,
          rating_scale: page.rating_scale || undefined,
          options: page.options || undefined,
          allow_multiple: page.allow_multiple || false,
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
      console.log("Saved survey:", savedSurvey);
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

  const handleDeletePage = (pageIndex: number) => {
    setSurvey((prev) => ({
      ...prev,
      pages: prev.pages.filter((_, index) => index !== pageIndex),
    }));
  };

  const renderTextContent = (item: PageLocal) => {
    const text = item.placeholder;
    return (
      <Input
        value={text}
        onChangeText={(value) =>
          handleFieldChange("placeholder", value, item.id)
        }
        label="Placeholder"
        placeholder="Placeholder"
      />
    );
  };

  const renderLinkContent = (item: PageLocal) => {
    const linkText = item.link_text;
    const linkUrl = item.redirect_url;
    return (
      <>
        <Input
          label="Link Button Text"
          value={linkText}
          placeholder="Link Text"
          onChangeText={(value) =>
            handleFieldChange("link_text", value, item.id)
          }
        />
        <Input
          label="Link Redirect Url"
          value={linkUrl}
          placeholder="Link Redirect Url"
          onChangeText={(value) => {
            handleFieldChange("redirect_url", value, item.id);
          }}
        />
        <View>
          <Text className="text-white font-medium mb-2">Open link</Text>
          <View className="flex-row items-center justify-between gap-2">
            <IconButton
              className="grow"
              icon={
                <Feather
                  name="external-link"
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              title="In New Tab"
            />
            <IconButton
              className="grow"
              icon={
                <Feather
                  name="link"
                  size={16}
                  color={theme.colors.textSecondary}
                />
              }
              title="On the Same Page"
            />
          </View>
        </View>
      </>
    );
  };

  const renderRatingContent = (item: PageLocal) => {
    const lowLabel = item.low_label;
    const highLabel = item.high_label;
    const scale = item.rating_scale || 10;
    return (
      <>
        <View>
          <Text className="text-white font-medium mb-2">Survey type</Text>
          <View className="flex-row flex-wrap items-center gap-3">
            <IconButton
              onPress={() => handleFieldChange("rating_type", "NPS", item.id)}
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
                  item.rating_type === RatingType.NPS
                    ? "#242838"
                    : "transparent",
              }}
            />
            <IconButton
              onPress={() =>
                handleFieldChange("rating_type", RatingType.NUMBER, item.id)
              }
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
                  item.rating_type === RatingType.NUMBER
                    ? "#242838"
                    : "transparent",
              }}
            />
            <IconButton
              onPress={() => handleFieldChange("rating_type", "EMOJI", item.id)}
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
                  item.rating_type === RatingType.EMOJI
                    ? "#242838"
                    : "transparent",
              }}
            />
          </View>
        </View>
        {item.rating_type === RatingType.NUMBER && (
          <View>
            <Text className="text-white font-medium mb-2">Scale</Text>
            <Slider
              className="w-full"
              value={scale}
              onValueChange={(value) => {
                handleFieldChange("rating_scale", value, item.id);
              }}
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
          onChangeText={(value) =>
            handleFieldChange("low_label", value, item.id)
          }
        />
        <Input
          label="High Label"
          value={highLabel}
          placeholder="High Label"
          onChangeText={(value) =>
            handleFieldChange("high_label", value, item.id)
          }
        />
      </>
    );
  };

  const renderMultiChoiceContent = (item: PageLocal) => {
    const options = item.options || [];

    const handleAddOption = () => {
      if (newOption.trim()) {
        const updatedOptions = [...options, newOption.trim()];
        handleFieldChange("options", updatedOptions, item.id);
        setNewOption("");
      }
    };

    const handleDeleteOption = (optionIndex: number) => {
      const updatedOptions = options.filter((_, i) => i !== optionIndex);
      handleFieldChange("options", updatedOptions, item.id);
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

  const renderSurveyPreview = () => {
    const item = survey.pages[0];
    const title = item.title;
    const description = item.description;
    const linkText = item.link_text || "";
    const ratingType = item.rating_type;
    const lowLabel = item.low_label;
    const highLabel = item.high_label;
    const options = item.options || [];
    const ratingScale = item.rating_scale || 10;
    switch (item.type) {
      case "text":
        return (
          <Question
            title={title}
            description={description}
            placeholder={item.placeholder}
            onSubmit={() => {}}
          />
        );
      case "link":
        return (
          <Link
            title={title}
            description={description}
            linkText={linkText}
            onLinkPress={() => {}}
          />
        );
      case "rating":
        return (
          <Rating
            title={title}
            description={description}
            type={ratingType as RatingType}
            lowLabel={lowLabel}
            highLabel={highLabel}
            onRatingChange={() => {}}
            ratingScale={ratingScale}
          />
        );
      case "mcq":
        return (
          <MultiChoice
            title={title}
            description={description}
            options={options}
            onSelect={() => {}}
          />
        );
      default:
        return null;
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
                            icon={item.icon}
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
                      {surv.type === "text" && renderTextContent(surv)}
                      {surv.type === "link" && renderLinkContent(surv)}
                      {surv.type === "rating" && renderRatingContent(surv)}
                      {surv.type === "mcq" && renderMultiChoiceContent(surv)}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View className="px-4 py-7">
            <View className="p-6 shadow border border-borderPrimary rounded-lg bg-[#1d212d]">
              {renderSurveyPreview()}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Survey;
