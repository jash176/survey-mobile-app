import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'text';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  style,
  ...props 
}) => {
  const getButtonStyle = () => {
    const baseStyle = "rounded-lg px-6 py-3 items-center justify-center";
    
    switch (variant) {
      case 'primary':
        return `${baseStyle} bg-primary`;
      case 'secondary':
        return `${baseStyle} bg-gray-700 border border-gray-600`;
      case 'text':
        return `${baseStyle} bg-transparent`;
      default:
        return `${baseStyle} bg-primary`;
    }
  };

  const getTextStyle = () => {
    const baseStyle = "text-base font-semibold";
    
    switch (variant) {
      case 'primary':
        return `${baseStyle} text-white`;
      case 'secondary':
        return `${baseStyle} text-white`;
      case 'text':
        return `${baseStyle} text-textSecondary`;
      default:
        return `${baseStyle} text-white`;
    }
  };

  return (
    <Pressable
      className={getButtonStyle()}
      style={[
        {
          opacity: disabled || loading ? 0.6 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'text' ? theme.colors.textSecondary : '#ffffff'} />
      ) : (
        <Text className={getTextStyle()}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}; 