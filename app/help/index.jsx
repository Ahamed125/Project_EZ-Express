import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
} from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { db } from '../../Config/Firebaseonfig' // Make sure you have your Firebase config setup
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function HelpCenter() {
  const supportPhone = '+94783022215';
  const whatsappNumber = '+94786146865';
  const supportEmail = 'erpdevteam2@gmail.com';
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const helpTopics = [
    {
      id: '1',
      icon: <Ionicons name="call" size={24} color={Colors.PRIMARY} />,
      title: 'Call Support',
      description: 'Speak directly with our support team.',
      action: () => Linking.openURL(`tel:${supportPhone}`),
    },
    {
      id: '2',
      icon: <FontAwesome name="whatsapp" size={24} color="#25D366" />,
      title: 'Chat on WhatsApp',
      description: 'Message us on WhatsApp.',
      action: () =>
        Linking.openURL(
          `https://wa.me/${whatsappNumber.replace('+', '')}?text=Hi%20I%20need%20help`
        ),
    },
    {
      id: '3',
      icon: <MaterialIcons name="email" size={24} color={Colors.PRIMARY} />,
      title: 'Email Support',
      description: 'Send us an email with your issue.',
      action: () =>
        Linking.openURL(`mailto:${supportEmail}?subject=Support%20Request`),
    },
    {
      id: '4',
      icon: <MaterialIcons name="help-outline" size={24} color={Colors.PRIMARY} />,
      title: 'FAQ',
      description: 'Frequently Asked Questions',
      action: () => Linking.openURL('https://example.com/faq'),
    },
    {
      id: '5',
      icon: <Ionicons name="document-text" size={24} color={Colors.PRIMARY} />,
      title: 'Terms & Conditions',
      description: 'Read our terms and conditions.',
      action: () => Linking.openURL('https://example.com/terms'),
    },
    {
      id: '6',
      icon: <Ionicons name="shield-checkmark" size={24} color={Colors.PRIMARY} />,
      title: 'Privacy Policy',
      description: 'How we protect your data.',
      action: () => Linking.openURL('https://example.com/privacy'),
    },
    {
      id: '7',
      icon: <Ionicons name="chatbubble-ellipses" size={24} color={Colors.PRIMARY} />,
      title: 'Send Feedback',
      description: 'Tell us how we can improve',
      action: () => setFeedbackModalVisible(true),
    },
  ];

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        feedback: feedback.trim(),
        rating,
        createdAt: serverTimestamp(),
        // You might want to add user ID if you have authentication
        // userId: auth.currentUser?.uid,
      });
      
      Alert.alert('Success', 'Thank you for your feedback!');
      setFeedback('');
      setRating(0);
      setFeedbackModalVisible(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ id, icon, title, description, action }) => (
    <TouchableOpacity
      key={id}
      style={styles.topicCard}
      onPress={() => {
        try {
          action();
        } catch (err) {
          Alert.alert('Error', 'Unable to complete the action.');
        }
      }}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.topicTitle}>{title}</Text>
        <Text style={styles.topicDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i <= rating ? Colors.PRIMARY : Colors.GRAY}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  return (
    <ScrollView style={styles.container}>
      {helpTopics.map(renderItem)}

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={() => {
          setFeedbackModalVisible(!feedbackModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Your Feedback</Text>
            
            <Text style={styles.ratingText}>How would you rate our app?</Text>
            {renderStarRating()}
            
            <TextInput
              style={styles.feedbackInput}
              multiline
              numberOfLines={4}
              placeholder="Tell us what you think..."
              value={feedback}
              onChangeText={setFeedback}
            />
            
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setFeedbackModalVisible(false);
                  setFeedback('');
                  setRating(0);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitFeedback}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    padding: 15,
  },
  header: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: Colors.DARK,
    marginBottom: 20,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  topicTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.DARK,
  },
  topicDescription: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratingText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.LIGHT_GRAY,
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});