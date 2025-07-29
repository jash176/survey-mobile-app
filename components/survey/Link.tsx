import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../ui/Button';
interface LinkProps {
  onLinkPress: () => void;
  title: string;
  description?: string;
  linkText: string;
}

const Link: React.FC<LinkProps> = (props) => {
  const { onLinkPress, title, description, linkText } = props;
  return (
    <View>
      <Text className="text-white text-xl font-medium mb-2">
        {title}
      </Text>

      {description && (
        <Text className="text-gray-400 text-base mb-4">
          {description}
        </Text>
      )}
      <Button title={linkText} onPress={onLinkPress} rightIcon={<FontAwesome5 name="external-link-alt" size={12} color="#FFF" />} />
    </View>
  )
}

export default Link