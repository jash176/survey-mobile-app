import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500 mb-4">
        Welcome to Survey Mobile App!
      </Text>
      <Pressable 
        className="bg-blue-500 px-4 py-2 rounded-lg"
        onPress={() => router.push('/(auth)/login')}
      >
        <Text className="text-white font-semibold">Go to Auth</Text>
      </Pressable>
    </View>
  );
}
