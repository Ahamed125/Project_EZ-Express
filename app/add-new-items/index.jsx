import { View, Text, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator, Image, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import Colors from '../../constant/Colors'
import { Picker } from '@react-native-picker/picker'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { db } from '../../Config/Firebaseonfig'
import * as ImagePicker from 'expo-image-picker'
import { cld, options } from './../../Config/CloudinaryConfig'
import { useUser } from '@clerk/clerk-expo'
import { upload } from 'cloudinary-react-native'

export default function AddNewItem() {
    const navigation = useNavigation();
    const { user } = useUser();
    const [formData, setFormData] = useState({});
    const [categoryList, setCategoryList] = useState([]);
    const [image, setImage] = useState();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'Add New Item' });
        GetCategories();
    }, [])

    const GetCategories = async () => {
        setCategoryList([]);
        const snapshot = await getDocs(collection(db, 'Category'));
        snapshot.forEach((doc) => {
            setCategoryList(prev => [...prev, doc.data()])
        })
    }

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    const onSubmit = () => {
        const requiredFields = ['name', 'category', 'price', 'description'];
        const isValid = requiredFields.every(field => formData[field]);
        if (!isValid || !image) {
            ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
            return;
        }
        UploadImage();
    }

    const UploadImage = async () => {
        setLoader(true);
        try {
            const resultData = await new Promise((resolve, reject) => {
                upload(cld, {
                    file: image,
                    options: options,
                    callback: (error, response) => {
                        if (error) reject(error);
                        else resolve(response);
                    }
                });
            });

            const imageUrl = resultData?.url || '';
            await SaveFormData(imageUrl);
        } catch (error) {
            setLoader(false);
            ToastAndroid.show('Image upload failed', ToastAndroid.SHORT);
        }
    }

    const SaveFormData = async (imageUrl) => {
        const docId = Date.now().toString();
        try {
            await setDoc(doc(db, 'Items', docId), {
                ...formData,
                imageUrl,
                username: user?.fullName,
                username:user?.username,
                email: user?.primaryEmailAddress?.emailAddress,
                userImage: user?.imageUrl,
                id: docId,
                createdAt: new Date().toISOString()
            });
            setLoader(false);
            ToastAndroid.show('Item added successfully!', ToastAndroid.SHORT);
            navigation.goBack();
        } catch (error) {
            setLoader(false);
            ToastAndroid.show('Failed to save item', ToastAndroid.SHORT);
        }
    }

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={styles.title}>Add New Item</Text>

            <Pressable onPress={imagePicker}>
                <Image source={image ? { uri: image } : require('./../../assets/images/placeholder.jpg')}
                    style={styles.image} />
            </Pressable>

            {/* Form Inputs */}
            <FormInput label="Item Name *" onChangeText={value => handleInputChange('name', value)} />
            <FormPicker label="Category *" selectedValue={formData.category} onValueChange={value => handleInputChange('category', value)} options={categoryList.map(c => c.name)} />
            <FormInput label="Price (INR) *" keyboardType='numeric' onChangeText={value => handleInputChange('price', value)} />
            <FormInput label="Description *" multiline numberOfLines={5} onChangeText={value => handleInputChange('description', value)} />

            <TouchableOpacity disabled={loader} style={styles.button} onPress={onSubmit}>
                {loader ? <ActivityIndicator size="large" color={Colors.WHITE} /> :
                    <Text style={styles.buttonText}>Submit</Text>}
            </TouchableOpacity>
        </ScrollView>
    )
}

const FormInput = ({ label, ...props }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} {...props} />
    </View>
)

const FormPicker = ({ label, selectedValue, onValueChange, options }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <Picker style={styles.input} selectedValue={selectedValue} onValueChange={onValueChange}>
            {options.map((opt, idx) => <Picker.Item label={opt} value={opt} key={idx} />)}
        </Picker>
    </View>
)

const styles = StyleSheet.create({
    title: {
        fontFamily: 'outfit-medium',
        fontSize: 20,
        marginBottom: 10
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        marginBottom: 15
    },
    inputContainer: {
        marginVertical: 6
    },
    input: {
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit'
    },
    label: {
        marginBottom: 5,
        fontFamily: 'outfit'
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginVertical: 20
    },
    buttonText: {
        textAlign: 'center',
        color: Colors.WHITE,
        fontFamily: 'outfit-medium'
    }
});