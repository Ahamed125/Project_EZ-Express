// import {
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
// } from 'react-native';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { Link, router } from 'expo-router';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import * as ImagePicker from 'expo-image-picker';
// import * as SecureStore from 'expo-secure-store';

// import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
// import CustomButton from '../../components/CustomButton';
// import CustomInput from '../../components/CustomInput';
// import SignInWith from '../../components/SignInWith';

// const signUpSchema = z.object({
//   username: z.string({ message: 'Username is required' }).min(3, 'Username should be at least 3 characters'),
//   email: z.string({ message: 'Email is required' }).email('Invalid email'),
//   password: z
//     .string({ message: 'Password is required' })
//     .min(8, 'Password should be at least 8 characters long'),
//   phoneNumber: z.string().min(6, 'Phone number should be at least 6 characters').optional(),
//   avatar: z.any().optional(),
// });

// export default function SignUpScreen({title}) {
//   const {
//     control,
//     handleSubmit,
//     setError,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(signUpSchema),
//   });

//   const { signUp, isLoaded } = useSignUp();
//   const avatar = watch('avatar');

//   const pickImage = async () => {
//     try {
//       // Request permissions first
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Sorry, we need camera roll permissions to select an image!');
//         return;
//       }

//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8, // Higher quality
//         base64: true, // Important for upload
//       });

//       if (!result.canceled && result.assets[0]) {
//         const selectedImage = result.assets[0];
//         setValue('avatar', selectedImage);
        
//         // Store both URI and base64 for upload
//         await SecureStore.setItemAsync('tempAvatar', JSON.stringify({
//           uri: selectedImage.uri,
//           base64: selectedImage.base64,
//           type: selectedImage.type || 'image/jpeg' ||'image/jpg'||'image/png'// Default type
//         }));
//       }
//     } catch (error) {
//       console.error('Image picker error:', error);
//       setError('root', { message: 'Failed to select image' });
//     }
//   };

//   const onSignUp = async (data) => {
//     if (!isLoaded) return;

//     try {
//       // First create the user
//       await signUp.create({
//         username: data.username,
//         emailAddress: data.email,
//         password: data.password,
//         unsafeMetadata: {
//           phoneNumber: data.phoneNumber || null,
//         },
//       });

//       // Prepare email verification
//       await signUp.prepareVerification({ strategy: 'email_code' });

//       router.push('/verify');
//     } catch (err) {
//       console.log('Sign up error:', JSON.stringify(err, null, 2));
//       if (isClerkAPIResponseError(err)) {
//         err.errors.forEach((error) => {
//           setError('root', {
//             message: error.message || 'An error occurred during sign up',
//           });
//         });
//       } else {
//         setError('root', { message: err.message || 'Unknown error occurred' });
//       }
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Create an account</Text>

//       <View style={styles.avatarContainer}>
//         <TouchableOpacity onPress={pickImage}>
//           {avatar ? (
//             <Image source={{ uri: avatar.uri }} style={styles.avatar} />
//           ) : (
//             <View style={styles.avatarPlaceholder}>
//               <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.form}>
//         <CustomInput
//           control={control}
//           name='username'
//           placeholder='Username'
//           autoCapitalize='none'
//         />
        
//         <CustomInput
//           control={control}
//           name='email'
//           placeholder='Email'
//           autoCapitalize='none'
//           keyboardType='email-address'
//         />

//         <CustomInput
//           control={control}
//           name='password'
//           placeholder='Password'
//           secureTextEntry
//         />

//         <CustomInput
//           control={control}
//           name='phoneNumber'
//           placeholder='Phone Number (optional)'
//           keyboardType='phone-pad'
//         />

//         {errors.root && (
//           <Text style={styles.errorText}>{errors.root.message}</Text>
//         )}
//       </View>

//       {isSubmitting ? (
//         <ActivityIndicator size="large" color="#4353FD" />
//       ) : (
//         <CustomButton title='Sign up' onPress={handleSubmit(onSignUp)} />
//       )}

//       <Link href='/signIn' style={styles.link}>
//         Already have an account? Sign in
//       </Link>

//       <View style={styles.socialButtons}>
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
//     gap: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   link: {
//     color: '#4353FD',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   avatarPlaceholder: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#e1e1e1',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarPlaceholderText: {
//     color: '#666',
//   },
//   errorText: {
//     color: 'crimson',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   socialButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     justifyContent: 'center',
//   },
// });

































import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

import { isClerkAPIResponseError, useSignUp, useClerk } from '@clerk/clerk-expo';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import SignInWith from '../../components/SignInWith';

const signUpSchema = z.object({
  username: z.string({ message: 'Username is required' }).min(3, 'Username should be at least 3 characters'),
  email: z.string({ message: 'Email is required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password should be at least 8 characters long'),
  phoneNumber: z.string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits')
    .optional(),
  avatar: z.any().optional(),
});

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const { signUp, isLoaded } = useSignUp();
  const { client } = useClerk();
  const avatar = watch('avatar');

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to select an image!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        setValue('avatar', selectedImage);
        
        await SecureStore.setItemAsync('tempAvatar', JSON.stringify({
          uri: selectedImage.uri,
          base64: selectedImage.base64,
          type: selectedImage.type || 'image/jpeg'
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setError('root', { message: 'Failed to select image' });
    }
  };

  const onSignUp = async (data) => {
    if (!isLoaded) return;

    try {
      // Prepare metadata with both phone number and avatar URL
      const unsafeMetadata = {
        phoneNumber: data.phoneNumber || null,
        avatarUrl: avatar ? avatar.uri : null
      };

      // Create the user with all metadata
      await signUp.create({
        username: data.username,
        emailAddress: data.email,
        password: data.password,
        unsafeMetadata: unsafeMetadata,
      });

      // Prepare email verification
      await signUp.prepareVerification({ strategy: 'email_code' });

      router.push('/verify');
    } catch (err) {
      console.log('Sign up error:', JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        if (err.errors.some(e => e.code === 'form_identifier_exists')) {
          Alert.alert('Error', 'This phone number is already in use');
        } else {
          err.errors.forEach((error) => {
            setError('root', {
              message: error.message || 'An error occurred during sign up',
            });
          });
        }
      } else {
        setError('root', { message: err.message || 'Unknown error occurred' });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Create an account</Text>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar.uri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name='username'
          placeholder='Username'
          autoCapitalize='none'
        />
        
        <CustomInput
          control={control}
          name='email'
          placeholder='Email'
          autoCapitalize='none'
          keyboardType='email-address'
        />

        <CustomInput
          control={control}
          name='password'
          placeholder='Password'
          secureTextEntry
        />

        <CustomInput
          control={control}
          name='phoneNumber'
          placeholder='Phone Number (optional)'
          keyboardType='phone-pad'
          maxLength={10}
        />

        {errors.root && (
          <Text style={styles.errorText}>{errors.root.message}</Text>
        )}
      </View>

      {isSubmitting ? (
        <ActivityIndicator size="large" color="#4353FD" />
      ) : (
        <CustomButton title='Sign up' onPress={handleSubmit(onSignUp)} />
      )}

      <Link href='/signIn' style={styles.link}>
        Already have an account? Sign in
      </Link>

      <View style={styles.socialButtons}>
        <SignInWith strategy='oauth_google' />
        <SignInWith strategy='oauth_facebook' />
        <SignInWith strategy='oauth_apple' />
      </View>
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
  form: {
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    color: '#4353FD',
    fontWeight: '600',
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#666',
  },
  errorText: {
    color: 'crimson',
    textAlign: 'center',
    marginTop: 5,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
});