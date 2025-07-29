import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface QuestionProps {
  onSubmit: (value: string) => void;
  title: string;
  description?: string;
  placeholder?: string;
}

const Question: React.FC<QuestionProps> = (props) => {
  const { onSubmit, title, description, placeholder } = props;
  const [answer, setAnswer] = useState("");
  const onChangeAnswer = (value: string) => {
    setAnswer(value)
  }
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

      <Input onChangeText={onChangeAnswer} placeholder={placeholder} multiline className='min-h-48 border rounded-lg shadow p-4' />
      <Button title='Submit answer' onPress={() => onSubmit(answer)} />

    </View>
  )
}

export default Question