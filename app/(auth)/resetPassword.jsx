import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSignIn, useAuth, isClerkAPIResponseError } from '@clerk/clerk-expo';

import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const resetPasswordSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ResetPasswordScreen() {
  const { email } = router.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSignIn();
  const { signOut } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onResetPassword = async ({ code, password }) => {
    setIsLoading(true);
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'complete') {
        // 👇 Immediately sign out to prevent auto-login
        await signOut();

        Alert.alert(
          'Success',
          'Your password has been reset. Please sign in with your new password.'
        );

        router.replace('/signIn');
      } else {
        Alert.alert('Error', 'Password reset failed');
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0]?.longMessage || 'Password reset failed');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
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
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        {email ? `Enter the code sent to ${email}` : 'Enter your verification code'}
      </Text>

      <CustomInput
        control={control}
        name="code"
        icon="code"
        placeholder="Verification Code"
        keyboardType="number-pad"
        autoFocus
      />
      {errors.code && <Text style={styles.error}>{errors.code.message}</Text>}

      <CustomInput
        control={control}
        name="password"
        icon="lock"
        placeholder="New Password"
        secureTextEntry
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <CustomInput
        control={control}
        name="confirmPassword"
        icon="lock-outline"
        placeholder="Confirm New Password"
        secureTextEntry
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      <CustomButton
        title="Reset Password"
        onPress={handleSubmit(onResetPassword)}
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
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 16,
  },
  link: {
    color: '#3b82f6',
    fontFamily: 'outfit-medium',
    textAlign: 'center',
    marginTop: 16,
  },
});
