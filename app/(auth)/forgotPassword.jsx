
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';

import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export default function ForgotPasswordScreen({title}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { signIn } = useSignIn();

  const onSendReset = async ({ email }) => {
    setIsLoading(true);
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      
      // Navigate directly to reset screen with email parameter
      router.push({
        pathname: '/resetPassword',
        params: { email },
      });
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError('email', {
          message: err.errors[0]?.longMessage || 'Failed to send reset email',
        });
      } else {
        setError('email', { message: 'An unexpected error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email to receive a verification code
      </Text>

      <CustomInput
        control={control}
        name="email"
        icon="email"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {errors.email && (
        <Text style={styles.error}>{errors.email.message}</Text>
      )}

      <CustomButton
        title="Send Verification Code"
        onPress={handleSubmit(onSendReset)}
        isLoading={isLoading}
      />

      <Link href="/signIn" style={styles.link}>
        Back to Sign In
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'outfit',
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  error: {
    color: '#ef4444',
    fontFamily: 'outfit',
    textAlign: 'center',
    marginTop: 8,
  },

    link: {
    color: '#3b82f6',
    fontFamily: 'outfit-medium',
    textAlign: 'center',
    marginTop: 16,
  },
});