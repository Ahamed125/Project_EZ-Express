// import { Pressable, StyleSheet, Text } from 'react-native';

// export default function CustomButton({ text, ...props }) {
//   return (
//     <Pressable {...props} style={[styles.button]}>
//       <Text style={styles.buttonText}>{text}</Text>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#4353FD',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

















import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function CustomButton({ title, onPress, loading = false, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'outfit-bold',
  },
});