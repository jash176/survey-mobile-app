import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../lib/authContext';
import {
  LoginFormErrors,
  validateEmail,
  validateLoginForm,
  validatePassword
} from '../../lib/validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { signIn } = useAuth();

  const validateForm = (): boolean => {
    const formErrors = validateLoginForm(email, password);
    setErrors(formErrors);
    return !formErrors.email && !formErrors.password;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(text) }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(text, true) }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error.message || 'An error occurred during login');
        setLoading(false);
        return;
      }

      if (user) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert('Login Failed', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <View className="mb-8">
          <Text className="text-white text-center text-3xl font-bold mb-2">
            Login to Featurebase
          </Text>
        </View>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          autoComplete="password"
          error={errors.password}
        />

        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          style={{ marginBottom: 24 }}
        />

        <View className="items-center">
          <Text className="text-textSecondary text-base">
            Don't have an account?{' '}
            <Text 
              className="text-primary font-semibold"
              onPress={handleRegister}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 