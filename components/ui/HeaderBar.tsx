import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './IconSymbol';

interface HeaderBarProps {
  showBack?: boolean;
  onBackPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ 
  showBack = true, 
  onBackPress 
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-background">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity
            onPress={handleBackPress}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="chevron.left" color="white" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}; 