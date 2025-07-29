import { cn } from '@/utils/cn';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type SurveyTypeCardProps = {
  title: string;
  subtitle: string;
  onPress?: () => void;
  borderColor?: string;
  surveyType: React.ReactNode
};

const SurveyTypeCard: React.FC<SurveyTypeCardProps> = ({
  title,
  subtitle,
  onPress,
  borderColor,
  surveyType
}) => {

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'rounded-lg bg-zinc-900 w-full',
      )}
    >
      <View className={cn("pt-4 px-7 pb-2 gap-1 border-t rounded-lg bg-[#1D212D80]", borderColor)}>
        <Text className="text-white font-semibold text-xl">{title}</Text>
        <Text className="text-zinc-400 text-lg">{subtitle}</Text>
      </View>
      <View className='bg-[#10121999] p-4' pointerEvents='none'>
        {surveyType}
      </View>
    </Pressable>
  );
};

export default SurveyTypeCard;
