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

const Survey = () => {
  const [newOption, setNewOption] = useState("");
  const [survey, setSurvey] = useState({
    title: "Open question",
    description: "Gather open-ended thoughts your users have about a topic.",
    pages: [
      {
        type: "text",
        title: "What could we do better",
        description:
          "Is there anything we could do to make tempo better for you?",
        placeholder: "",
        rating_type: "NPS",
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

  const handleFieldChange = (
    field: keyof (typeof survey.pages)[0],
    value: any,
    index: number
  ) => {
    const pages = [...survey.pages];
    pages[index] = { ...pages[index], [field]: value };

    setSurvey((prev) => ({
      ...prev,
      pages,
    }));
  };

  const renderTextContent = (index: number) => {
    const text = survey.pages[index].answer;
    return (
      <Input
        value={text}
        onChangeText={(value) => handleFieldChange("answer", value, index)}
        label="Placeholder"
        placeholder="Placeholder"
      />
    );
  };
  const renderLinkContent = (index: number) => {
    const linkText = survey.pages[index].link_text;
    const linkUrl = survey.pages[index].link_url;
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
          onChangeText={(value) => handleFieldChange("link_url", value, index)}
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
  const renderRatingContent = (index: number) => {
    const lowLabel = survey.pages[index].low_label;
    const highLabel = survey.pages[index].high_label;
    const scale = survey.pages[index].rating_scale;
    return (
      <>
        <View>
          <Text className="text-white font-medium mb-2">Survey type</Text>
          <View className="flex-row flex-wrap items-center gap-3">
            <IconButton
              onPress={() => handleFieldChange("rating_type", "NPS", index)}
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
                  survey.pages[index].rating_type === "NPS"
                    ? "#242838"
                    : "transparent",
              }}
            />
            <IconButton
              onPress={() => handleFieldChange("rating_type", "NUMBER", index)}
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
                  survey.pages[index].rating_type === "NUMBER"
                    ? "#242838"
                    : "transparent",
              }}
            />
            <IconButton
              onPress={() => handleFieldChange("rating_type", "EMOJI", index)}
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
                  survey.pages[index].rating_type === "EMOJI"
                    ? "#242838"
                    : "transparent",
              }}
            />
          </View>
        </View>
        {survey.pages[index].rating_type === "NUMBER" && (
          <View>
            <Text className="text-white font-medium mb-2">Scale</Text>
            <CustomSlider
              value={scale}
              onValueChange={(value) =>
                handleFieldChange("rating_scale", value, index)
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
          onChangeText={(value) => handleFieldChange("low_label", value, index)}
        />
        <Input
          label="High Label"
          value={highLabel}
          placeholder="High Label"
          onChangeText={(value) =>
            handleFieldChange("high_label", value, index)
          }
        />
      </>
    );
  };
  const renderMultiChoiceContent = (index: number) => {
    const options = survey.pages[index].options || [];

    const handleAddOption = () => {
      if (newOption.trim()) {
        const updatedOptions = [...options, newOption.trim()];
        handleFieldChange("options", updatedOptions, index);
        setNewOption("");
      }
    };

    const handleDeleteOption = (optionIndex: number) => {
      const updatedOptions = options.filter((_, i) => i !== optionIndex);
      handleFieldChange("options", updatedOptions, index);
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
  const renderSurveyCard = (index: number) => {
    const title = survey.pages[index].title;
    const description = survey.pages[index].description;
    const linkText = survey.pages[index].link_text;
    const ratingType = survey.pages[index].rating_type;
    const lowLabel = survey.pages[index].low_label;
    const highLabel = survey.pages[index].high_label;
    const options = survey.pages[index].options;
    switch (survey.pages[index].type) {
      case "text":
        return (
          <Question
            title={title}
            description={description}
            placeholder={survey.pages[index].placeholder}
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
            {survey.pages.map((surv, servIndex) => {
              const title = survey.pages[servIndex].title;
              const description = survey.pages[servIndex].description;
              return (
                <View className="border border-borderPrimary rounded-lg bg-[#24283833]">
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
                              handleFieldChange("type", item.type, servIndex)
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
                          handleFieldChange("title", value, servIndex)
                        }
                      />
                      <Input
                        label="Description"
                        value={description}
                        placeholder="Description"
                        onChangeText={(value) =>
                          handleFieldChange("description", value, servIndex)
                        }
                      />
                      {surv.type === "text" && renderTextContent(servIndex)}
                      {surv.type === "link" && renderLinkContent(servIndex)}
                      {surv.type === "rating" && renderRatingContent(servIndex)}
                      {surv.type === "mcq" &&
                        renderMultiChoiceContent(servIndex)}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View className="px-4 py-7">
            <View className="p-6 shadow border border-borderPrimary rounded-lg bg-[#1d212d]">
              {renderSurveyCard(0)}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Survey;
