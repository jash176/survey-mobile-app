import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { HeaderBar } from '../../components/ui/HeaderBar';
import { Input } from '../../components/ui/Input';
import { AuthService } from '../../lib/authService';
import {
  RegisterFormErrors,
  validateCompanyName,
  validateEmail,
  validatePassword,
  validateRegisterStep1,
  validateRegisterStep2,
  validateUsername
} from '../../lib/validation';

type RegisterStep = 1 | 2;

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState<RegisterStep>(1);
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const handleCompanyNameChange = (text: string) => {
    setCompanyName(text);
    if (errors.companyName) {
      setErrors(prev => ({ ...prev, companyName: validateCompanyName(text) }));
    }
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: validateUsername(text) }));
    }
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
      setErrors(prev => ({ ...prev, password: validatePassword(text, false) }));
    }
  };

  const handleNext = () => {
    const step1Errors = validateRegisterStep1(companyName);
    setErrors(step1Errors);
    if (!step1Errors.companyName) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setErrors({}); // Clear errors when going back
    } else {
      router.back();
    }
  };

  const handleRegister = async () => {
    const step2Errors = validateRegisterStep2(username, email, password);
    setErrors(step2Errors);
    
    if (!step2Errors.username && !step2Errors.email && !step2Errors.password) {
      setLoading(true);
      
      try {
        const { user, error } = await AuthService.registerWithEmail(
          email, 
          password, 
          username, 
          companyName
        );
        
        if (error) {
          Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
          setLoading(false);
          return;
        }

        if (user) {
          router.replace("/(tabs)");
        }
      } catch (error) {
        Alert.alert('Registration Failed', 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStep1 = () => (
    <>
      <View className="mb-8">
        <Text className="text-white text-center text-3xl font-bold mb-2">
          What's your product's name?
        </Text>
      </View>

      <Input
        placeholder="Your company name"
        value={companyName}
        onChangeText={handleCompanyNameChange}
        autoCapitalize='none'
        error={errors.companyName}
      />

      <Button
        title="Go to last step"
        onPress={handleNext}
        disabled={!companyName.trim()}
        style={{ marginBottom: 24 }}
      />

      <View className="items-center gap-2">
        <Text className="text-textSecondary text-base">
          Your workspace will be available at
        </Text>
        <View className="font-medium bg-[#24283880] max-w-[400px] w-auto inline-block truncate px-2 py-1 rounded-md">
          <Text className="text-textSecondary text-base">
            {`${companyName.length > 0 ? companyName : "subdomain"}.featurebase.com`}
          </Text>
        </View>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <View className="mb-8">
          <Text className="text-white text-center text-3xl font-bold mb-2">
            Sign up to Featurebase
          </Text>
          <Text className="text-center text-textSecondary text-base">
            All done. Now just sign up to get continue.
          </Text>
        </View>

        <Input
          placeholder="Username"
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
          autoComplete="username"
          error={errors.username}
        />

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
          autoComplete="password-new"
          error={errors.password}
        />

        <Button
          title="Sign up"
          onPress={handleRegister}
          loading={loading}
          disabled={!username.trim() || !email.trim() || password.length < 8}
          style={{ marginBottom: 24 }}
        />

        <View className="items-center">
          <Text 
            className="text-[#b2b8cd99] text-base"
            onPress={handleBack}
          >
            Back
          </Text>
        </View>
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <HeaderBar />
      <View className="flex-1 px-6 justify-center">
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </View>
    </SafeAreaView>
  );
} 