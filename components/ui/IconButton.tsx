import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface IconButtonProps {
  icon: React.ReactNode;
  title?: string;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { icon, title, onPress } = props
  return (
    <TouchableOpacity>
      {icon}
      {title && <Text>{title}</Text>}
    </TouchableOpacity>
  )
}

export default IconButton