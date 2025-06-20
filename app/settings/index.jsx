import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Settings() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.header}>Account Settings</Text>
                
                <TouchableOpacity 
                    style={styles.optionCard}
                    onPress={() => router.push('./change')}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons name="lock" size={24} color="#6a11cb" />
                        <Text style={styles.optionText}>Change Password</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>

                             <TouchableOpacity 
                    style={styles.optionCard}
                    onPress={() => router.push('./edit')}
                >
                    <View style={styles.optionContent}>
                         <AntDesign name="profile" size={24} color="#6a11cb" />
                        <Text style={styles.optionText}>Change Profile</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    optionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        marginLeft: 15,
        color: '#333',
    },
});