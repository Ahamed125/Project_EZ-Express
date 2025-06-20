



// import { useAuth } from '@clerk/clerk-expo';
// import { Redirect } from 'expo-router';
// import { ActivityIndicator, View } from 'react-native';

// export default function ProtectedLayout() {
//   console.log('Protected layout');

//   const { isSignedIn, isLoaded } = useAuth();

//   if (!isLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   if (!isSignedIn) {
//     return <Redirect href='/signIn' />;
//   }

//   return <Redirect href='/home' />;
// }


















import { Slot, Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';

export default function ProtectedLayout() {

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href='/landing' />;
  }

  return <Redirect href='/home' />;
}
