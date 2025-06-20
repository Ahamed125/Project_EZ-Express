// import { Redirect, Stack } from 'expo-router';
// import { useAuth } from '@clerk/clerk-expo';
// import { ActivityIndicator, View } from 'react-native';

// export default function AuthLayout() {
//   console.log('Auth layout');
//   const { isSignedIn, isLoaded } = useAuth();

//   if (!isLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   if (isSignedIn) {
//     return <Redirect href={'/'} />;
//   }

//   return (
//     <Stack>
//       <Stack.Screen
//         name='signIn'
//         options={{ headerShown: false, title: 'Sign in' }}
//       />
//       <Stack.Screen name='signUp' options={{ title: 'Sign up' }} />
//     </Stack>
//   );
// }





















import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#f8f9fa' }
    }}>
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}