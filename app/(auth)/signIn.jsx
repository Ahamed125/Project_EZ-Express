// import { Link } from 'expo-router';
// import {
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';


// import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
// import CustomButton from '../../components/CustomButton';
// import CustomInput from '../../components/CustomInput';
// import SignInWith from '../../components/SignInWith';

// const signInSchema = z.object({
//   email: z.string({ message: 'Email is required' }).email('Invalid email'),
//   password: z
//     .string({ message: 'Password is required' })
//     .min(8, 'Password should be at least 8 characters long'),
// });

// const mapClerkErrorToFormField = (error) => {
//   switch (error.meta?.paramName) {
//     case 'identifier':
//       return 'email';
//     case 'password':
//       return 'password';
//     default:
//       return 'root';
//   }
// };

// export default function SignInScreen() {
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(signInSchema),
//   });

//   console.log('Errors: ', JSON.stringify(errors, null, 2));

//   const { signIn, isLoaded, setActive } = useSignIn();

//   const onSignIn = async (data) => {
//     if (!isLoaded) return;

//     try {
//       const signInAttempt = await signIn.create({
//         identifier: data.email,
//         password: data.password,
//       });

//       if (signInAttempt.status === 'complete') {
//         setActive({ session: signInAttempt.createdSessionId });
//       } else {
//         console.log('Sign in failed');
//         setError('root', { message: 'Sign in could not be completed' });
//       }
//     } catch (err) {
//       console.log('Sign in error: ', JSON.stringify(err, null, 2));

//       if (isClerkAPIResponseError(err)) {
//         err.errors.forEach((error) => {
//           const fieldName = mapClerkErrorToFormField(error);
//           setError(fieldName, {
//             message: error.longMessage,
//           });
//         });
//       } else {
//         setError('root', { message: 'Unknown error' });
//       }
//     }

//     console.log('Sign in: ', data.email, data.password);
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Sign in</Text>

//       <View style={styles.form}>
//         <CustomInput
//           control={control}
//           name='email'
//           placeholder='Email'
//           autoFocus
//           autoCapitalize='none'
//           keyboardType='email-address'
//           autoComplete='email'
//         />

//         <CustomInput
//           control={control}
//           name='password'
//           placeholder='Password'
//           secureTextEntry
//         />

//         {errors.root && (
//           <Text style={{ color: 'crimson' }}>{errors.root.message}</Text>
//         )}
//       </View>

//       <CustomButton text='Sign in' onPress={handleSubmit(onSignIn)} />

//       <Link href='/signUp' style={styles.link}>
//         Don't have an account? Sign up
//       </Link>

//       <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 'auto' }}>
//         <SignInWith strategy='oauth_google' />
//         <SignInWith strategy='oauth_facebook' />
//         <SignInWith strategy='oauth_apple' />
//       </View>
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
//   form: {
//     gap: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   link: {
//     color: '#4353FD',
//     fontWeight: '600',
//   },
// });




import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';

import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import SignInWith from '../../components/SignInWith';

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    control, 
    handleSubmit, 
    setError, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const { signIn, isLoaded, setActive } = useSignIn();

  const onSignIn = async (data) => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        setError('root', { message: 'Sign in could not be completed' });
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setError('root', { message: err.errors[0].longMessage });
      } else {
        setError('root', { message: 'An unexpected error occurred' });
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
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name="email"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail"
        />

        <CustomInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
          icon="lock"
        />

        {errors.root && (
          <Text style={styles.error}>{errors.root.message}</Text>
        )}

        <Link href="/forgotPassword" asChild>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <CustomButton 
        title="Sign In" 
        onPress={handleSubmit(onSignIn)} 
        loading={isLoading}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        <SignInWith strategy="oauth_google" />
        <SignInWith strategy="oauth_apple" />
        <SignInWith strategy="oauth_facebook" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Link href="/signUp" style={styles.footerLink}>Sign Up</Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'outfit-bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'outfit',
  },
  form: {
    marginBottom: 24,
    gap: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#3b82f6',
    fontFamily: 'outfit-medium',
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    fontFamily: 'outfit',
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#6b7280',
    fontFamily: 'outfit-medium',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    color: '#6b7280',
    fontFamily: 'outfit',
  },
  footerLink: {
    color: '#3b82f6',
    fontFamily: 'outfit-bold',
  },
});