import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import * as FileSystem from 'expo-file-system';

const ProfileForm = () => {
    const { user } = useUser();
    const [inputValues, setInputValues] = useState({
        image: user?.imageUrl || "",
        username: user?.username || "",
        // email: user?.primaryEmailAddress?.emailAddress || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const pickImage = async () => {
        setImageLoading(true);
        try {
            // Request permissions first
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need camera roll permissions to select an image');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setInputValues({...inputValues, image: result.assets[0].uri});
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
            console.error('Image picker error:', error);
        } finally {
            setImageLoading(false);
        }
    };

    const handleChange = (name, value) => {
        setInputValues({
            ...inputValues,
            [name]: value
        });
    };

    const submitForm = async () => {
        if (inputValues.newPassword !== inputValues.confirmNewPassword) {
            Alert.alert("Error", "New passwords don't match!");
            return;
        }

        setIsLoading(true);

        try {
            // Update profile image if changed
            if (inputValues.image && inputValues.image !== user.imageUrl) {
                const base64 = await FileSystem.readAsStringAsync(inputValues.image, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                const base64Image = `data:image/jpeg;base64,${base64}`;
                
                await user.setProfileImage({
                    file: base64Image
                });
            }

            // Update username if changed
            if (inputValues.username && inputValues.username !== user.username) {
                await user.update({
                    username: inputValues.username
                });
            }

            // Update email if changed
            // if (inputValues.email && inputValues.email !== user.primaryEmailAddress?.emailAddress) {
            //     await user.update({
            //         emailAddress: inputValues.email
            //     });
            // }

            // Update password if all password fields are filled
            if (inputValues.currentPassword && inputValues.newPassword) {
                await user.updatePassword({
                    currentPassword: inputValues.currentPassword,
                    newPassword: inputValues.newPassword
                });
            }

            Alert.alert("Success", "Profile updated successfully!");
        } catch (err) {
            Alert.alert("Error", err.errors?.[0]?.message || "Failed to update profile");
            console.error('Update error:', JSON.stringify(err, null, 2));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={pickImage} disabled={imageLoading}>
                {imageLoading ? (
                    <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="small" />
                    </View>
                ) : inputValues.image ? (
                    <Image 
                        source={{ uri: inputValues.image }} 
                        style={{ width: 100, height: 100, borderRadius: 50 }} 
                    />
                ) : (
                    <View style={{ width: 100, height: 100, backgroundColor: '#ddd', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Select Image</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TextInput
                placeholder="Username"
                value={inputValues.username}
                onChangeText={(text) => handleChange('username', text)}
                style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />

            {/* <TextInput
                placeholder="Email"
                value={inputValues.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            /> */}

            <TextInput
                placeholder="Current Password"
                value={inputValues.currentPassword}
                onChangeText={(text) => handleChange('currentPassword', text)}
                secureTextEntry
                style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />

            <TextInput
                placeholder="New Password"
                value={inputValues.newPassword}
                onChangeText={(text) => handleChange('newPassword', text)}
                secureTextEntry
                style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />

            <TextInput
                placeholder="Confirm New Password"
                value={inputValues.confirmNewPassword}
                onChangeText={(text) => handleChange('confirmNewPassword', text)}
                secureTextEntry
                style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />

            <Button 
                title={isLoading ? "Updating..." : "Update Profile"} 
                onPress={submitForm} 
                disabled={isLoading}
            />
        </View>
    );
};

export default ProfileForm;