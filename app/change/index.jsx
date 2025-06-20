import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';

export default function PasswordChange({title}) {
    const { user } = useUser();
    const [inputValues, setInputValues] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (name, value) => {
        setInputValues({
            ...inputValues,
            [name]: value
        });
    };

    const submitForm = async () => {
        if (!inputValues.currentPassword || !inputValues.newPassword || !inputValues.confirmNewPassword) {
            Alert.alert("Error", "Please fill in all password fields!");
            return;
        }

        if (inputValues.newPassword !== inputValues.confirmNewPassword) {
            Alert.alert("Error", "New passwords don't match!");
            return;
        }

        if (inputValues.newPassword.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters long!");
            return;
        }

        setIsLoading(true);

        try {
            await user.updatePassword({
                currentPassword: inputValues.currentPassword,
                newPassword: inputValues.newPassword
            });

            Alert.alert("Success", "Password updated successfully!");
            setInputValues({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        } catch (err) {
            Alert.alert("Error", err.errors?.[0]?.message || "Failed to update password");
            console.error('Password update error:', JSON.stringify(err, null, 2));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.formContainer}>
                        <View style={styles.header}>
                            <MaterialIcons name="security" size={40} color="#fff" />
                            <Text style={styles.title}>Change Password</Text>
                            <Text style={styles.subtitle}>Secure your account with a new password</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Current Password</Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    placeholder="Enter current password"
                                    placeholderTextColor="#aaa"
                                    value={inputValues.currentPassword}
                                    onChangeText={(text) => handleChange('currentPassword', text)}
                                    secureTextEntry={!showCurrentPassword}
                                    style={styles.input}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <MaterialIcons 
                                        name={showCurrentPassword ? "visibility-off" : "visibility"} 
                                        size={24} 
                                        color="#666" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    placeholder="Enter new password"
                                    placeholderTextColor="#aaa"
                                    value={inputValues.newPassword}
                                    onChangeText={(text) => handleChange('newPassword', text)}
                                    secureTextEntry={!showNewPassword}
                                    style={styles.input}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <MaterialIcons 
                                        name={showNewPassword ? "visibility-off" : "visibility"} 
                                        size={24} 
                                        color="#666" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#aaa"
                                    value={inputValues.confirmNewPassword}
                                    onChangeText={(text) => handleChange('confirmNewPassword', text)}
                                    secureTextEntry={!showConfirmPassword}
                                    style={styles.input}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <MaterialIcons 
                                        name={showConfirmPassword ? "visibility-off" : "visibility"} 
                                        size={24} 
                                        color="#666" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            onPress={submitForm} 
                            disabled={isLoading}
                            style={styles.button}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Update Password</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.passwordRequirements}>
                            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                            <Text style={styles.requirement}>• At least 8 characters long</Text>
                            <Text style={styles.requirement}>• Include uppercase and lowercase letters</Text>
                            <Text style={styles.requirement}>• Include at least one number</Text>
                            <Text style={styles.requirement}>• Include at least one special character</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    formContainer: {
        padding: 25,
        borderRadius: 15,
        margin: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 5,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: '#ff6b6b',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        height: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    passwordRequirements: {
        marginTop: 25,
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
    },
    requirementsTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    requirement: {
        color: 'rgba(255, 255, 255, 0.8)',
        marginLeft: 5,
        marginBottom: 4,
    },
});
