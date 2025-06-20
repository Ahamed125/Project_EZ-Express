








// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
// import { useUser } from '@clerk/clerk-expo';
// import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../../Config/Firebaseonfig';
// import CustomButton from '../../components/CustomButton';
// import CustomInput from '../../components/CustomInput';

// const editProfileSchema = z.object({
//   username: z.string().min(3, 'Username should be at least 3 characters'),
//   phoneNumber: z
//     .string()
//     .min(10, 'Phone number must be 10 digits')
//     .max(10, 'Phone number must be 10 digits')
//     .regex(/^\d+$/, 'Phone number must contain only digits')
//     .optional(),
//   avatar: z.any().optional(),
// });

// export default function EditProfileScreen() {
//   const { user, isLoaded } = useUser();
//   const [isUploading, setIsUploading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(editProfileSchema),
//     defaultValues: {
//       username: user?.username || '',
//       phoneNumber: user?.unsafeMetadata?.phoneNumber || '',
//       avatar: null,
//     },
//   });

//   const avatar = watch('avatar');
//   const currentAvatarUrl = user?.imageUrl;

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Camera roll permissions are required to select an image');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         setValue('avatar', result.assets[0]);
//       }
//     } catch (error) {
//       console.error('Image picker error:', error);
//       setError('root', { message: 'Failed to select image. Please try again.' });
//     }
//   };

//   const uploadImage = async (uri) => {
//     if (!uri) return null;
    
//     setIsUploading(true);
//     try {
//       // Convert image to base64
//       const base64 = await FileSystem.readAsStringAsync(uri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });
//       const base64Image = `data:image/jpeg;base64,${base64}`;
      
//       // Update profile image in Clerk
//       await user.setProfileImage({
//         file: base64Image
//       });
      
//       // Return the new image URL (Clerk provides this after upload)
//       return user.imageUrl;
//     } catch (err) {
//       console.error('Upload error:', err);
//       throw new Error('Failed to upload image');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const updateChatRecords = async (userId, newName, newImageUrl) => {
//     try {
//       // Find all chat documents where this user is a participant
//       const chatsQuery = query(
//         collection(db, 'Chat'),
//         where('userIds', 'array-contains', userId)
//       );
      
//       const querySnapshot = await getDocs(chatsQuery);
      
//       // Update each chat document
//       const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
//         const chatData = docSnapshot.data();
//         const updatedUsers = chatData.users.map(userData => {
//           if (userData.email === userId) {
//             return {
//               ...userData,
//               name: newName || userData.name,
//               imageUrl: newImageUrl || userData.imageUrl
//             };
//           }
//           return userData;
//         });
        
//         await updateDoc(doc(db, 'Chat', docSnapshot.id), {
//           users: updatedUsers
//         });
//       });
      
//       await Promise.all(updatePromises);
//     } catch (error) {
//       console.error('Error updating chat records:', error);
//       throw new Error('Failed to update chat records');
//     }
//   };

//   const onSubmit = async (data) => {
//     if (!isLoaded) return;

//     try {
//       let avatarUrl = currentAvatarUrl;
      
//       // If a new avatar was selected, upload it
//       if (data.avatar) {
//         avatarUrl = await uploadImage(data.avatar.uri);
//       }

//       // Update user profile in Clerk
//       await user.update({
//         username: data.username,
//         unsafeMetadata: {
//           ...user.unsafeMetadata,
//           phoneNumber: data.phoneNumber || null,
//         },
//       });

//       // Update all chat records where this user appears
//       await updateChatRecords(
//         user.primaryEmailAddress?.emailAddress,
//         data.username,
//         avatarUrl
//       );

//       Alert.alert('Success', 'Profile updated successfully!');
//     } catch (err) {
//       console.error('Update error:', err);
//       setError('root', { 
//         message: err.errors?.[0]?.message || err.message || 'Failed to update profile. Please try again.' 
//       });
//     }
//   };

//   if (!isLoaded) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#4353FD" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <Text style={styles.title}>Edit Profile</Text>

//       <View style={styles.avatarContainer}>
//         <TouchableOpacity onPress={pickImage} disabled={isUploading}>
//           {avatar ? (
//             <Image source={{ uri: avatar.uri }} style={styles.avatar} />
//           ) : currentAvatarUrl ? (
//             <Image source={{ uri: currentAvatarUrl }} style={styles.avatar} />
//           ) : (
//             <View style={styles.avatarPlaceholder}>
//               <Text style={styles.avatarPlaceholderText}>
//                 {isUploading ? 'Uploading...' : 'Add Photo'}
//               </Text>
//             </View>
//           )}
//           {isUploading && (
//             <View style={styles.uploadOverlay}>
//               <ActivityIndicator size="small" color="#fff" />
//             </View>
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.form}>
//         <CustomInput 
//           control={control} 
//           name="username" 
//           placeholder="Username" 
//           autoCapitalize="none"
//         />
//         <CustomInput
//           control={control}
//           name="phoneNumber"
//           placeholder="Phone Number"
//           keyboardType="phone-pad"
//           maxLength={10}
//         />
//         {errors.root && (
//           <Text style={styles.errorText}>{errors.root.message}</Text>
//         )}
//       </View>

//       <CustomButton 
//         title={isSubmitting || isUploading ? "Saving..." : "Save Changes"} 
//         onPress={handleSubmit(onSubmit)} 
//         disabled={isSubmitting || isUploading}
//       />
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   form: {
//     gap: 15,
//     marginBottom: 20,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   avatarPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   avatarPlaceholderText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   uploadOverlay: {
//     position: 'absolute',
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });



















import { useUser } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { collection, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { db } from '../../Config/Firebaseonfig';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const editProfileSchema = z.object({
  username: z.string().min(3, 'Username should be at least 3 characters'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits')
    .optional(),
  avatar: z.any().optional(),
});

export default function EditProfileScreen() {
  const { user, isLoaded } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || '',
      phoneNumber: user?.unsafeMetadata?.phoneNumber || '',
      avatar: null,
    },
  });

  const avatar = watch('avatar');
  const currentAvatarUrl = user?.imageUrl;

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll permissions are required to select an image');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setValue('avatar', result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setError('root', { message: 'Failed to select image. Please try again.' });
    }
  };

  const executeUpdates = async (userId, newUsername, newImageUrl) => {
    try {
      // Start with Clerk updates
      await user.update({
        username: newUsername,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phoneNumber: watch('phoneNumber') || null,
        },
      });

      // Process Firestore updates in parallel
      const [chatsSnapshot, itemsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'Chat'), where('userIds', 'array-contains', userId))),
        getDocs(query(collection(db, 'Items'), where('email', '==', userId)))
      ]);

      // Prepare all updates in a single batch
      const batch = writeBatch(db);

      // Update Chat records
      chatsSnapshot.forEach((doc) => {
        const chatData = doc.data();
        const updatedUsers = chatData.users.map(userData => ({
          ...userData,
          ...(userData.email === userId && {
            name: newUsername,
            imageUrl: newImageUrl || userData.imageUrl
          })
        }));
        batch.update(doc.ref, { users: updatedUsers });
      });

      // Update Items records
      itemsSnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          username: newUsername,
          userImage: newImageUrl || doc.data().userImage
        });
      });

      // Execute all updates at once
      await batch.commit();

      return true;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    if (!isLoaded) return;
    setIsProcessing(true);

    try {
      // Upload new profile image if changed
      const newImageUrl = data.avatar 
        ? await uploadImage(data.avatar.uri) 
        : currentAvatarUrl;

      // Execute all updates in sequence
      await executeUpdates(
        user.primaryEmailAddress?.emailAddress,
        data.username,
        newImageUrl
      );

      Alert.alert('Success', 'All profile information updated successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      setError('root', { 
        message: err.errors?.[0]?.message || err.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const base64Image = `data:image/jpeg;base64,${base64}`;
      
      await user.setProfileImage({ file: base64Image });
      return user.imageUrl;
    } catch (err) {
      console.error('Image upload error:', err);
      throw new Error('Failed to upload profile image');
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4353FD" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* <Text style={styles.title}>Edit Profile</Text> */}

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage} disabled={isProcessing}>
          {avatar ? (
            <Image source={{ uri: avatar.uri }} style={styles.avatar} />
          ) : currentAvatarUrl ? (
            <Image source={{ uri: currentAvatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>
                {isProcessing ? 'Processing...' : 'Add Photo'}
              </Text>
            </View>
          )}
          {isProcessing && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <CustomInput 
          control={control} 
          name="username" 
          placeholder="Username" 
          autoCapitalize="none"
        />
        <CustomInput
          control={control}
          name="phoneNumber"
          placeholder="Phone Number"
          keyboardType="phone-pad"
          maxLength={10}
        />
        {errors.root && (
          <Text style={styles.errorText}>{errors.root.message}</Text>
        )}
      </View>

      <CustomButton 
        title={isProcessing ? "Updating..." : "Update Profile"} 
        onPress={handleSubmit(onSubmit)} 
        disabled={isProcessing}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 15,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  avatarPlaceholderText: {
    color: '#666',
    fontSize: 14,
  },
  uploadOverlay: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});