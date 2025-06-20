// import CustomButton from './CustomButton';
// import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession from 'expo-auth-session';
// import { useEffect, useCallback } from 'react';
// import { useSSO } from '@clerk/clerk-expo';
// //@ts-ignore
// import appleButton from './../assets/images/social-providers/apple.png';
// //@ts-ignore
// import facebookButton from './../assets/images/social-providers/facebook.png';
// //@ts-ignore
// import googleButton from './../assets/images/social-providers/google.png';
// import { Pressable, Image } from 'react-native';

// export const useWarmUpBrowser = () => {
//   useEffect(() => {
//     // Preloads the browser for Android devices to reduce authentication load time
//     // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
//     void WebBrowser.warmUpAsync();
//     return () => {
//       // Cleanup: closes browser when component unmounts
//       void WebBrowser.coolDownAsync();
//     };
//   }, []);
// };

// // Handle any pending authentication sessions
// WebBrowser.maybeCompleteAuthSession();

// type SignInWithProps = {
//   strategy: 'oauth_google' | 'oauth_apple' | 'oauth_facebook';
// };

// const strategyIcons = {
//   oauth_google: googleButton,
//   oauth_apple: appleButton,
//   oauth_facebook: facebookButton,
// };

// export default function SignInWith({ strategy }: SignInWithProps) {
//   useWarmUpBrowser();

//   // Use the `useSSO()` hook to access the `startSSOFlow()` method
//   const { startSSOFlow } = useSSO();

//   const onPress = useCallback(async () => {
//     try {
//       // Start the authentication process by calling `startSSOFlow()`
//       const { createdSessionId, setActive, signIn, signUp } =
//         await startSSOFlow({
//           strategy,
//           // For web, defaults to current path
//           // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
//           // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
//           redirectUrl: AuthSession.makeRedirectUri(),
//         });

//       // If sign in was successful, set the active session
//       if (createdSessionId) {
//         setActive!({ session: createdSessionId });
//       } else {
//         // If there is no `createdSessionId`,
//         // there are missing requirements, such as MFA
//         // Use the `signIn` or `signUp` returned from `startSSOFlow`
//         // to handle next steps
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2));
//     }
//   }, []);

//   return (
//     <Pressable onPress={onPress}>
//       <Image
//         source={strategyIcons[strategy]}
//         style={{ width: 62, height: 62 }}
//         resizeMode='contain'
//       />
//     </Pressable>
//   );
// }






















// import { useSSO } from '@clerk/clerk-expo';
// import * as AuthSession from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';
// import { useCallback, useEffect } from 'react';
// import { Image, Pressable, StyleSheet } from 'react-native';

// import appleButton from './../assets/images/social-providers/apple.png';
// import facebookButton from './../assets/images/social-providers/facebook.png';
// import googleButton from './../assets/images/social-providers/google.png';

// export const useWarmUpBrowser = () => {
//   useEffect(() => {
//     void WebBrowser.warmUpAsync();
//     return () => {
//       void WebBrowser.coolDownAsync();
//     };
//   }, []);
// };

// WebBrowser.maybeCompleteAuthSession();

// const strategyIcons = {
//   oauth_google: googleButton,
//   oauth_apple: appleButton,
//   oauth_facebook: facebookButton,
// };

// export default function SignInWith({ strategy }) {
//   useWarmUpBrowser();
//   const { startSSOFlow } = useSSO();

//   const onPress = useCallback(async () => {
//     try {
//       const { createdSessionId, setActive } = await startSSOFlow({
//         strategy,
//         redirectUrl: AuthSession.makeRedirectUri(),

        
//       });

//       if (createdSessionId) {
//         await setActive({ session: createdSessionId });
//       }
//     } catch (err) {
//       console.error('SSO Error:', err);
//     }
//   }, [strategy, startSSOFlow]);

//   return (
//     <Pressable onPress={onPress} style={styles.button}>
//       <Image
//         source={strategyIcons[strategy]}
//         style={styles.icon}
//         resizeMode="contain"
//       />
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   icon: {
//     width: 30,
//     height: 30,
//   },
// });










// import React, { useCallback, useEffect } from 'react';
// import { View, Text, Image, Pressable, ActivityIndicator,StyleSheet } from 'react-native';
// import appleButton from './../assets/images/social-providers/apple.png';
// import facebookButton from './../assets/images/social-providers/facebook.png';
// import googleButton from './../assets/images/social-providers/google.png';

// import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession from 'expo-auth-session';
// import { useSSO } from '@clerk/clerk-expo';
// import { router } from 'expo-router'; // Import router from expo-router

// // Warm up the browser for better performance on Android
// export const useWarmUpBrowser = () => {
//   useEffect(() => {
//     void WebBrowser.warmUpAsync();
//     return () => {
//       void WebBrowser.coolDownAsync();
//     };
//   }, []);
// };

// WebBrowser.maybeCompleteAuthSession();
// const strategyIcons = {
//   oauth_google: googleButton,
//   oauth_apple: appleButton,
//   oauth_facebook: facebookButton,
// };

// export default function SignInWith({ strategy }) {
//   useWarmUpBrowser();
//   const { startSSOFlow } = useSSO();
//   const [isLoading, setIsLoading] = React.useState(false); // Add loading state

//   const onPress = useCallback(async () => {
//     setIsLoading(true); // Start loading
//     try {
//       const redirectUrl = AuthSession.makeRedirectUri({
//         useProxy: true, // Required for Expo Go
//       });

//       const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
//         strategy: 'oauth_google',
//         redirectUrl,
//       });

//       if (createdSessionId) {
//         // Set the active session
//         await setActive({ session: createdSessionId });

//         // Navigate to the Home screen after successful login
//          // Use `replace` to replace the current screen
//          router.replace('/(tabs)/home')
//       } else {
//         // Handle missing requirements (e.g., MFA)
//         if (signIn) {
//           console.log('Sign-in requires additional steps:', signIn);
//         } else if (signUp) {
//           console.log('Sign-up requires additional steps:', signUp);
//         }
//       }
//     } catch (err) {
//       console.error('SSO Error:', err);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   }, [startSSOFlow]);


//     return (
//     <Pressable onPress={onPress} style={styles.button}>
//       <Image
//         source={strategyIcons[strategy]}
//         style={styles.icon}
//         resizeMode="contain"
//       />
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   icon: {
//     width: 30,
//     height: 30,
//   },
// });















import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect } from 'react';

import { Image, Pressable } from 'react-native';
import appleButton from './../assets/images/social-providers/apple.png';
import facebookButton from './../assets/images/social-providers/facebook.png';
import googleButton from './../assets/images/social-providers/google.png';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const strategyIcons = {
  oauth_google: googleButton,
  oauth_apple: appleButton,
  oauth_facebook: facebookButton,
};

export default function SignInWith({ strategy }) {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        });

        

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <Pressable onPress={onPress}>
      <Image
        source={strategyIcons[strategy]}
        style={{ width: 62, height: 62 }}
        resizeMode='contain'
      />
    </Pressable>
  );
}