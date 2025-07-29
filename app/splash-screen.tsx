import { useAuth } from '@/lib/authContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';

const SplashScreen = () => {
  const { user, loading } = useAuth();
  const handleNavigation = () => {
    if (loading) return;
    if(user) {
      router.replace("/(tabs)")
      return;
    }
    router.push("/(auth)/login")
  }
  useEffect(() => {
    handleNavigation();
  }, [user, loading]);
  return (
    <View className='flex flex-1 justify-center items-center bg-white'>
      <Image source={require("../assets/images/featurebaselogo.png")} className='w-36  h-36' />
    </View>
  )
}

export default SplashScreen