
// import { useState, useEffect } from 'react';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import * as SecureStore from 'expo-secure-store';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { isClerkAPIResponseError, useSignUp, useUser } from '@clerk/clerk-expo';

// import { useRouter } from 'expo-router';
// import CustomInput from '../../components/CustomInput';
// import CustomButton from '../../components/CustomButton';

// const verifySchema = z.object({
//   code: z.string({ message: 'Code is required' }).length(6, 'Code must be 6 digits'),
// });

// export default function VerifyScreen() {
//   const [isUploading, setIsUploading] = useState(false);
//   const { user, isLoaded: isUserLoaded } = useUser();
//   const router=useRouter();
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(verifySchema),
//   });

//   const { signUp, isLoaded: isSignUpLoaded, setActive } = useSignUp();

//   const uploadProfileImage = async (imageData) => {
//     if (!user) {
//       throw new Error('User not available for image upload');
//     }

//     try {
//       setIsUploading(true);
//       const response = await user.setProfileImage({
//         file: `data:${imageData.type || 'image/jpeg'};base64,${imageData.base64}`,
//       });
//       return response;
//     } catch (error) {
//       console.error('Profile image upload error:', error);
//       throw error;
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleAvatarUpload = async () => {
//     const storedAvatar = await SecureStore.getItemAsync('tempAvatar');
//     if (!storedAvatar) return;

//     try {
//       const imageData = JSON.parse(storedAvatar);
      
//       // Wait for user object with timeout
//       const startTime = Date.now();
//       const timeout = 10000; // 10 seconds timeout
      
//       while (!user && (Date.now() - startTime) < timeout) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//       }

//       if (!user) {
//         throw new Error('User object not available after waiting');
//       }

//       await uploadProfileImage(imageData);
//       await SecureStore.deleteItemAsync('tempAvatar');
//       return true;
//     } catch (uploadError) {
//       console.error('Avatar upload failed:', uploadError);
//       throw uploadError;
//     }
//   };

//   const onVerify = async ({ code }) => {
//     if (!isSignUpLoaded) return;

//     try {
//       const result = await signUp.attemptEmailAddressVerification({ code });

//       if (result.status === 'complete') {
//         // Set active session first
//         await setActive({ session: result.createdSessionId });
        
//         // Handle avatar upload in background
//         handleAvatarUpload()
//           .then(() => {
//             Alert.alert('Success', 'Your profile has been created with your avatar!');
//           })
//           .catch(() => {
//             Alert.alert('Profile Created', 'Account created successfully! You can update your avatar later in settings.');
//           });

//         router.replace('/');
//       } else {
//         throw new Error('Verification failed');
//       }
//     } catch (err) {
//       console.log('Verification error:', err);
//       setError('code', {
//         message: isClerkAPIResponseError(err) 
//           ? 'Invalid verification code' 
//           : err.message || 'Verification failed. Please try again.'
//       });
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Verify your email</Text>
//       <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>

//       <CustomInput
//         control={control}
//         name='code'
//         placeholder='123456'
//         autoFocus
//         keyboardType='number-pad'
//       />

//       {errors.code && (
//         <Text style={styles.errorText}>{errors.code.message}</Text>
//       )}

//       {(isSubmitting || isUploading) ? (
//         <ActivityIndicator size="large" color="#4353FD" />
//       ) : (
//         <CustomButton title='Verify' onPress={handleSubmit(onVerify)} />
//       )}
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     padding: 20,
//     gap: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   subtitle: {
//     textAlign: 'center',
//     color: '#666',
//     marginBottom: 20,
//   },
//   errorText: {
//     color: 'crimson',
//     textAlign: 'center',
//   },
// });






















import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const verifySchema = z.object({
  code: z.string({ message: 'Code is required' }).length(6, 'Code must be 6 digits'),
});

export default function VerifyScreen() {
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(verifySchema),
  });

  const { signUp, isLoaded: isSignUpLoaded, setActive } = useSignUp();

  const handleResendCode = async () => {
    if (!isSignUpLoaded) return;
    
    try {
      setIsResending(true);
      await signUp.prepareVerification({ strategy: 'email_code' });
      Alert.alert('Success', 'A new verification code has been sent to your email');
    } catch (err) {
      console.log('Resend error:', err);
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const onVerify = async ({ code }) => {
    if (!isSignUpLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      console.log('Verification error:', err);
      setError('code', {
        message: isClerkAPIResponseError(err) 
          ? 'Invalid verification code' 
          : err.message || 'Verification failed. Please try again.'
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>

      <CustomInput
        control={control}
        name='code'
        placeholder='123456'
        autoFocus
        keyboardType='number-pad'
      />

      {errors.code && (
        <Text style={styles.errorText}>{errors.code.message}</Text>
      )}

      {(isSubmitting || isResending) ? (
        <ActivityIndicator size="large" color="#4353FD" />
      ) : (
        <>
          <CustomButton title='Verify' onPress={handleSubmit(onVerify)} />
          <TouchableOpacity onPress={handleResendCode} disabled={isResending}>
            <Text style={styles.resendText}>
              {isResending ? 'Sending...' : 'Resend Verification Code'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  errorText: {
    color: 'crimson',
    textAlign: 'center',
  },
  resendText: {
    color: '#4353FD',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});