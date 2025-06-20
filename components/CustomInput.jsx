// import { Controller } from 'react-hook-form';
// import {
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
  
//   export default function CustomInput({
//     control,
//     name,
//     ...props
//   }) {
//     return (
//       <Controller
//         control={control}
//         name={name}
//         render={({
//           field: { value, onChange, onBlur },
//           fieldState: { error },
//         }) => (
//           <View style={styles.container}>
//             <TextInput
//               {...props}
//               value={value}
//               onChangeText={onChange}
//               onBlur={onBlur}
//               style={[
//                 styles.input,
//                 props.style,
//                 { borderColor: error ? 'crimson' : 'gray' },
//               ]}
//             />
//             {error ? (
//               <Text style={styles.error}>{error.message}</Text>
//             ) : (
//               <View style={{ height: 18 }} />
//             )}
//           </View>
//         )}
//       />
//     );
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       gap: 4,
//     },
//     input: {
//       borderWidth: 1,
//       padding: 10,
//       borderRadius: 5,
//       borderColor: '#ccc',
//     },
//     error: {
//       color: 'crimson',
//       minHeight: 18,
//     },
//   });

















import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CustomInput({
  control,
  name,
  icon,
  placeholder,
  secureTextEntry = false,
  ...props
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <View style={[
            styles.inputContainer,
            error && styles.inputContainerError
          ]}>
            {icon && (
              <MaterialIcons
                name={icon}
                size={20}
                color={error ? '#ef4444' : '#9ca3af'}
                style={styles.icon}
              />
            )}
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              placeholderTextColor="#9ca3af"
              secureTextEntry={secureTextEntry}
              style={styles.input}
              {...props}
            />
          </View>
          {error && (
            <Text style={styles.error}>{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'outfit',
    color: '#1f2937',
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
    fontFamily: 'outfit',
  },
});