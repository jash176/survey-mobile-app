import Link from "@/components/survey/Link";
import MultiChoice from "@/components/survey/MultiChoice";
import Question from "@/components/survey/Question";
import Rating, { RatingType } from "@/components/survey/Rating";
import { Button } from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import CustomSlider from "@/components/ui/Slider";
import { theme } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export interface SurveyLocal {
  title: string;
  description: string;
  pages: Page[];
}

export interface Page {
  id: string;
  type: "text" | "link" | "rating" | "mcq";
  title: string;
  description: string;
  placeholder: string;
  rating_type: RatingType;
  rating_scale: number;
  low_label: string;
  high_label: string;
  link_text: string;
  link_url: string;
  answer: string;
  options: string[];
}

const Survey = () => {
  const [newOption, setNewOption] = useState("");
  const [survey, setSurvey] = useState<SurveyLocal>({
    title: "Open question",
    description: "Gather open-ended thoughts your users have about a topic.",
    pages: [
      {
        id: "1",
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
        link_url: "https://tempo.new",
        answer: "",
        options: ["Excellent"],
      },
    ],
  });
  const SURVEY_TYPES = [
    {
      type: "text",
      label: "Text",
      icon: (
        <Feather name="edit" size={16} color={theme.colors.textSecondary} />
      ),
    },
    {
      type: "link",
      label: "Link",
      icon: (
        <Feather name="edit" size={16} color={theme.colors.textSecondary} />
      ),
    },
    {
      type: "rating",
      label: "Rating",
      icon: (
        <Feather name="edit" size={16} color={theme.colors.textSecondary} />
      ),
    },
    {
      type: "mcq",
      label: "Multi-Choice",
      icon: (
        <Feather name="edit" size={16} color={theme.colors.textSecondary} />
      ),
    },
  ];

  const handleFieldChange = (field: keyof Page, value: any, pageId: string) => {
    setSurvey((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === pageId ? { ...page, [field]: value } : page
      ),
    }));
  };

  const renderTextContent = (item: Page) => {
    const text = item.answer;
    return (
      <Input
        value={text}
        onChangeText={(value) => handleFieldChange("answer", value, item.id)}
        label="Placeholder"
        placeholder="Placeholder"
      />
    );
  };
  const renderLinkContent = (item: Page) => {
    const linkText = item.link_text;
    const linkUrl = item.link_url;
    return (
      <>
        <Input
          label="Link Button Text"
          value={linkText}
          placeholder="Link Text"
        />
        <Input
          label="Link Redirect Url"
          value={linkUrl}
          placeholder="Link Redirect Url"
          onChangeText={(value) =>
            handleFieldChange("link_url", value, item.id)
          }
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
  const renderRatingContent = (item: Page) => {
    const lowLabel = item.low_label;
    const highLabel = item.high_label;
    const scale = item.rating_scale;
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
            <CustomSlider
              value={scale}
              onValueChange={(value) =>
                handleFieldChange("rating_scale", value, item.id)
              }
              minimumValue={0}
              maximumValue={10}
              step={1}
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
  const renderMultiChoiceContent = (item: Page) => {
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
  const renderSurveyCard = () => {
    const item = survey.pages[0];
    const title = item.title;
    const description = item.description;
    const linkText = item.link_text;
    const ratingType = item.rating_type;
    const lowLabel = item.low_label;
    const highLabel = item.high_label;
    const options = item.options;
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
            <Button title="Save Survey" />
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
                    <Feather
                      className="mx-4"
                      name="trash-2"
                      size={20}
                      color={theme.colors.textSecondary}
                    />
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
              {renderSurveyCard()}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Survey;
