import { theme } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, View } from "react-native";
import IconButton from "../ui/IconButton";
import { Input } from "../ui/Input";

interface LinkSurveyContentProps {
  linkText: string;
  onLinkTextChange: (value: string) => void;
  redirectUrl: string;
  onRedirectUrlChange: (value: string) => void;
}

const LinkSurveyContent: React.FC<LinkSurveyContentProps> = (props) => {
  const { linkText, onLinkTextChange, onRedirectUrlChange, redirectUrl } =
    props;
  return (
    <>
      <Input
        label="Link Button Text"
        value={linkText}
        placeholder="Link Text"
        onChangeText={onLinkTextChange}
      />
      <Input
        label="Link Redirect Url"
        value={redirectUrl}
        placeholder="Link Redirect Url"
        onChangeText={onRedirectUrlChange}
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

export default LinkSurveyContent;
