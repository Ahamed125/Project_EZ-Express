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












import React, { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Image, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import appleButton from './../assets/images/social-providers/apple.png';
import facebookButton from './../assets/images/social-providers/facebook.png';
import googleButton from './../assets/images/social-providers/google.png';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { router } from 'expo-router';

// Strategy icons mapping
const strategyIcons = {
  oauth_google: googleButton,
  oauth_apple: appleButton,
  oauth_facebook: facebookButton,
};

// Platform-aware browser warmup
export const useWarmUpBrowser = () => {
  useEffect(() => {
    const warmUp = async () => {
      try {
        if (Platform.OS !== 'web' && WebBrowser.warmUpAsync) {
          await WebBrowser.warmUpAsync();
        }
      } catch (error) {
        console.log('Browser warmup error:', error);
      }
    };

    warmUp();

    return () => {
      if (Platform.OS !== 'web' && WebBrowser.coolDownAsync) {
        WebBrowser.coolDownAsync().catch(() => {});
      }
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInWith({ strategy }) {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);

  const onPress = useCallback(async () => {
    setIsLoading(true);
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.error('SSO Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [startSSOFlow, strategy]);

  return (
    <Pressable 
      onPress={onPress} 
      style={styles.button}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <Image
          source={strategyIcons[strategy]}
          style={styles.icon}
          resizeMode="contain"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 30,
    height: 30,
  },
});