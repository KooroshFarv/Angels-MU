import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserProfile } from '../types/UserProfile';
import ProductShelf from './ProductShelf';
import { Product } from '../types/Product';

interface Props{
    profile: UserProfile
}

export default function CameraScreen({profile}: Props) {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need camera access to show your makeup try-on</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.buttonText}>Flip</Text>
          </TouchableOpacity>
        </View>
        <ProductShelf
        profile={profile}
        selectedProduct={selectedProduct}
        onSelectProduct={setSelectedProduct}
/>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
controls: {
  position: 'absolute',
  bottom: 220,
  width: '100%',
  alignItems: 'center',
},
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
});