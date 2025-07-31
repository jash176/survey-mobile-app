import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

const TopProgressLoader = ({ isLoading = false, height = 3 }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      progressAnim.setValue(0);

      // Slow progress to ~80% over 10 seconds
      Animated.timing(progressAnim, {
        toValue: 80,
        duration: 10000,
        useNativeDriver: false,
      }).start();
    } else if (visible) {
      // Complete quickly
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          setVisible(false);
          progressAnim.setValue(0);
        }, 200);
      });
    }
  }, [isLoading, visible]);

  if (!visible) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="absolute inset-0 z-[1000]" style={{ height }}>
      <Animated.View
        className={"h-full bg-primary"}
        style={[{ width: progressWidth, height }]}
      />
    </View>
  );
};

export default TopProgressLoader;
