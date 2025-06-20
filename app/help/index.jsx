import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
} from '@expo/vector-icons';
import Colors from '../../constant/Colors';

export default function HelpCenter() {
  const supportPhone = '+94783022215'; // Replace with your support number
  const whatsappNumber = '+94786146865'; // Replace with your WhatsApp number
  const supportEmail = 'erpdevteam2@gmail.com'; // Replace with your support email

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
  ];

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

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Help Center</Text> */}
      {helpTopics.map(renderItem)}
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
});
