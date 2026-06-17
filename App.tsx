import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Lora_400Regular, Lora_600SemiBold } from '@expo-google-fonts/lora';
import Onboarding from './components/Onboarding';
import BrowseScreen from './components/BrowsScreen';
import CameraScreen from './components/CameraScreen';
import { UserProfile } from './types/UserProfile';
import { Product } from './types/Product';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Lora_400Regular,
    Lora_600SemiBold,
  });

  useEffect(() => {
    AsyncStorage.getItem('userProfile').then(data => {
      if (data) setProfile(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  if (!fontsLoaded || loading) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {!profile?.onboardingComplete ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : tryOnProduct ? (
        <CameraScreen
          profile={profile}
          tryOnProduct={tryOnProduct}
          onExit={() => setTryOnProduct(null)}
        />
      ) : (
        <BrowseScreen
          profile={profile}
          onTryOn={(p) => setTryOnProduct(p)}
        />
      )}
    </View>
  );

  async function handleOnboardingComplete(p: UserProfile) {
    await AsyncStorage.setItem('userProfile', JSON.stringify(p));
    setProfile(p);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
});