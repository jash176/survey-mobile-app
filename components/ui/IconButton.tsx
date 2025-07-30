import React from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { cn } from '../../utils/cn';

interface IconButtonProps {
  icon: React.ReactNode;
  title?: string;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { icon, title, onPress, className, style } = props;
  return (
    <TouchableOpacity className={cn('flex-row items-center h-11 px-3 border border-[#2b3040] rounded-lg bg-[#242838] shadow', className)} style={style} onPress={onPress}>
      <View style={{ marginRight: title ? 8 : 0 }}>
        {icon}
      </View>
      {title && <Text className='text-textSecondary font-bold text-lg'>{title}</Text>}
    </TouchableOpacity>
  );
}

export default IconButton