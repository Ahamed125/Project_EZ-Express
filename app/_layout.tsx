












// import { ClerkProvider } from '@clerk/clerk-expo';
// import { tokenCache } from '@clerk/clerk-expo/token-cache';
// import { useFonts } from 'expo-font';
// import { Slot, Stack } from 'expo-router';

// export default function RootLayout() {
//   console.log('Root layout');

//     useFonts({
//     'outfit':require('./../assets/fonts/Outfit-Regular.ttf'),
//     'outfit-bold':require('./../assets/fonts/Outfit-Bold.ttf')
//   })

  

//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//          <Stack screenOptions={{ headerShown: false }}>
//         <Slot />
//       </Stack>
//     </ClerkProvider>
//   );
// }


















import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
  });
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack >
        {/* <Slot /> */}
    <Stack.Screen name="chat/index" options={{ headerShown: true}} />

     <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
     <Stack.Screen name="landing" options={{ headerShown: false}} />
          <Stack.Screen name="settings/index" options={{ headerShown: true,headerTitle:'Settings'}} />
          <Stack.Screen name="edit/index" options={{ headerShown: true,headerTitle:'Edit Profile'}} />
            <Stack.Screen name="change/index" options={{ headerShown: true,headerTitle:''}} />

     <Stack.Screen name="index" options={{ headerShown: false}} />
         <Stack.Screen name="(cart)/cart" options={{ headerShown: true,headerTitle:'My Cart'}} />
                  <Stack.Screen name="help/index" options={{ headerShown: true,headerTitle:'Help Center'}} />

                  <Stack.Screen name="(order)/TrackOrders" options={{ headerShown: true,headerTitle:'My Orders'}} />
                         <Stack.Screen name="(auth)" options={{ headerShown: false}} />
                          <Stack.Screen name="item-details/index" options={{ headerShown: true, headerTintColor:'black',headerTitle:'Item Details'}} />


     

      </Stack>
    </ClerkProvider>
  );
}