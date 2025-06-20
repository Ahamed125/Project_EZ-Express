import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CallScreen = ({ callData, callDirection, onEndCall, onAcceptCall, onRejectCall }) => {
  return (
    <View style={styles.container}>
      <View style={styles.callInfoContainer}>
        <Image
          source={require('../../assets/images/default-avatar.png')} // Replace with actual avatar
          style={styles.avatar}
        />
        <Text style={styles.name}>{callData?.recipientName || 'Caller'}</Text>
        <Text style={styles.status}>
          {callDirection === 'outgoing' ? 'Calling...' : 'Incoming call'}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        {callDirection === 'incoming' && (
          <>
            <TouchableOpacity style={[styles.controlButton, styles.acceptButton]} onPress={onAcceptCall}>
              <Ionicons name="call" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.rejectButton]} onPress={onRejectCall}>
              <Ionicons name="call" size={30} color="white" />
            </TouchableOpacity>
          </>
        )}

        {callDirection === 'outgoing' && (
          <TouchableOpacity style={[styles.controlButton, styles.endButton]} onPress={onEndCall}>
            <Ionicons name="call" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#128C7E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: 'white',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  endButton: {
    backgroundColor: 'red',
  },
});

export default CallScreen;