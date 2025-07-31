import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, Platform, Text, View } from "react-native";
import { Button } from "../ui/Button";

interface DeleteSurveyModalProps {
  visible: boolean;
  onClose: () => void;
  onDeletePress: () => void;
}

const DeleteSurveyModal: React.FC<DeleteSurveyModalProps> = (props) => {
  const { onClose, visible, onDeletePress } = props;
  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent
    >
      <BlurView
        className="w-full h-full absolute inset-0"
        intensity={Platform.OS === "android" ? 30 : 40}
        experimentalBlurMethod="dimezisBlurView"
        tint="dark"
      />
      <View className="flex-1 justify-center items-center p-4">
        <View className="p-5 border rounded-lg border-[#ffffff0d] shadow w-full items-center bg-card">
          <View className="h-14 w-14 rounded-full justify-center items-center bg-[#F43F5E1A]">
            <Feather name="alert-triangle" size={24} color="#E11D48" />
          </View>
          <View className="mt-3">
            <Text className="text-white font-bold text-xl text-center">
              Are you sure you want to delete survey?
            </Text>
            <Text className="text-textPrimary font-medium text-xl mt-2 text-center">
              This action cannot be undone
            </Text>
          </View>
          <View className="w-full mt-5 gap-3">
            <Button
              title="Delete survey"
              style={{ backgroundColor: "#E11D48" }}
              onPress={onDeletePress}
            />
            <Button
              title="Cancel"
              style={{
                backgroundColor: "#2B304080",
                borderWidth: 1,
                borderColor: "#2b3040",
              }}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteSurveyModal;
