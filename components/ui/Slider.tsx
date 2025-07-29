import React, { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  View,
  ViewStyle,
} from 'react-native';

interface CustomSliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  width?: number;
  height?: number;
  thumbSize?: number;
  trackHeight?: number;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  width = 300,
  height = 40,
  thumbSize = 20,
  trackHeight = 4,
  minimumTrackTintColor = '#007AFF',
  maximumTrackTintColor = '#E5E5E5',
  thumbTintColor = '#FFFFFF',
  disabled = false,
  style,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(value);
  const [containerWidth, setContainerWidth] = useState<number>(width);

  const totalSteps = Math.floor((maximumValue - minimumValue) / step);
  const stepWidth = (containerWidth - thumbSize) / totalSteps;

  const clamp = (val: number) => Math.min(Math.max(val, minimumValue), maximumValue);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderMove: (_, gestureState) => {
        const touchX = gestureState.dx + getThumbPosition(sliderValue);
        const clampedX = Math.max(0, Math.min(containerWidth - thumbSize, touchX));
        const newStep = Math.round(clampedX / stepWidth);
        const newValue = clamp(minimumValue + newStep * step);
        setSliderValue(newValue);
        onValueChange?.(newValue);
      },
    })
  ).current;

  const getThumbPosition = (val: number) => {
    const percentage = (val - minimumValue) / (maximumValue - minimumValue);
    return percentage * (containerWidth - thumbSize);
  };

  useEffect(() => {
    setSliderValue(clamp(value));
  }, [value]);

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const thumbLeft = getThumbPosition(sliderValue);
  const trackFillWidth = thumbLeft + thumbSize / 2;

  return (
    <View
      style={[
        {
          width: "100%",
          height,
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onLayout={handleLayout}
    >
      {/* Track Background */}
      <View
        style={{
          position: 'absolute',
          height: trackHeight,
          width: '100%',
          backgroundColor: maximumTrackTintColor,
          borderRadius: trackHeight / 2,
        }}
      />

      {/* Track Fill */}
      <View
        style={{
          position: 'absolute',
          height: trackHeight,
          width: trackFillWidth,
          backgroundColor: minimumTrackTintColor,
          borderRadius: trackHeight / 2,
        }}
      />

      {/* Thumb */}
      <View
        {...panResponder.panHandlers}
        style={{
          position: 'absolute',
          left: thumbLeft,
          width: thumbSize,
          height: thumbSize,
          backgroundColor: thumbTintColor,
          borderRadius: thumbSize / 2,
          borderWidth: 1,
          borderColor: '#ccc',
        }}
      />
    </View>
  );
};

export default CustomSlider;
