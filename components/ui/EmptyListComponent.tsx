// components/GradientList.tsx
import { theme } from '@/constants/theme';
import { LinearGradient } from "expo-linear-gradient";
import React from 'react';
import { ColorValue, StyleSheet, View } from 'react-native';

type ItemProps = {
  gradientColors: ColorValue;
};

const items: ItemProps[] = [
  { gradientColors: '#06B6D4' }, // Blue
  { gradientColors: '#EC4899' }, // Purple-pink
  { gradientColors: '#F97316' }, // Orange
];

const GradientCircleItem = ({ gradientColors }: ItemProps) => (
  <View className="w-full mb-4 p-4 bg-[#1E293B] rounded-lg flex-row justify-between items-center">
    <View className="w-40 h-4 bg-[#334155] rounded-md" />
    <View className="w-5 h-5 rounded-full"
      style={{ backgroundColor: gradientColors }}
    />
  </View>
);

const GradientList = () => {
  return (
    <View className='mt-5 w-[85%] relative'>
      {items.map((item, index) => (
        <GradientCircleItem key={index} gradientColors={item.gradientColors} />
      ))}
      <LinearGradient colors={["transparent", theme.colors.background]} style={styles.gradientContainer} />
    </View>
  );
};

export default GradientList;

const styles = StyleSheet.create({
  gradientContainer: {
    width: "100%",
    height: "100%",
    position: "absolute"
  }
})
