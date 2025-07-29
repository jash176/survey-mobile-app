import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { useAuth } from "../../lib/authContext";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert("Error", "Failed to sign out");
            } else {
              router.replace("/(auth)/login");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-white mb-4">
        Welcome to Survey Mobile App!
      </Text>
      
      {user && (
        <View className="mb-6">
          <Text className="text-textSecondary text-base mb-2">
            Logged in as: {user.email}
          </Text>
        </View>
      )}
      
      <Pressable 
        className="bg-red-500 px-4 py-2 rounded-lg"
        onPress={handleSignOut}
      >
        <Text className="text-white font-semibold">Sign Out</Text>
      </Pressable>
    </View>
  );
}
