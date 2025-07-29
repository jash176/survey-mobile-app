import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MultiChoiceProps {
  options: Array<string>;
  onSelect: (value: string) => void;
  title: string;
  description?: string;
}

const MultiChoice: React.FC<MultiChoiceProps> = (props) => {
  const { onSelect, options, title, description } = props;
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
      <View className='gap-3'>
        {options.map((item, i) => {
          return (
            <TouchableOpacity onPress={() => onSelect(item)} className='w-full border border-borderPrimary rounded-lg p-2 shadow' key={`${item}-${i}`}>
              <Text className='text-lg text-center font-bold text-textPrimary'>{item}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default MultiChoice