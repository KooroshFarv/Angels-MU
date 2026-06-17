import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './components/Onboarding';
import CameraScreen from './components/CameraScreen';
import { UserProfile } from './types/UserProfile';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('userProfile').then(data => {
      if (data) setProfile(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const handleOnboardingComplete = async (p: UserProfile) => {
    await AsyncStorage.setItem('userProfile', JSON.stringify(p));
    setProfile(p);
  };

  if (loading) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {profile?.onboardingComplete
        ? <CameraScreen profile={profile} />
        : <Onboarding onComplete={handleOnboardingComplete} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});