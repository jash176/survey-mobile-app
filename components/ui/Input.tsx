import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  placeholderTextColor = theme.colors.textSecondary,
  ...props
}) => {
  return (
    <View className="">
      {label && (
        <Text className="text-white font-medium mb-2">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-gray-800 border rounded-lg px-4 py-3 text-white ${error ? 'border-red-500' : 'border-gray-700'
          }`}
        placeholderTextColor={placeholderTextColor}
        style={[
          {
            borderColor: error ? '#ef4444' : '#374151',
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}; 