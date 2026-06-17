import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserProfile } from '../types/UserProfile';
import ProductShelf from './ProductShelf';
import { Product } from '../types/Product';
import ProductCard from './ProductCards';

interface Props {
  profile: UserProfile;
  tryOnProduct: Product;
  onExit: () => void;
}

export default function CameraScreen({ profile, tryOnProduct, onExit }: Props) {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [cardProduct, setCardProduct] = useState<Product | null>(null);
  const [activeTryOn, setActiveTryOn] = useState<Product>(tryOnProduct);

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
        <TouchableOpacity style={styles.exitButton} onPress={onExit}>
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>

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
          selectedProduct={activeTryOn}
          onSelectProduct={(p) => {
            if (p) {
              setActiveTryOn(p);
            } else {
              setCardProduct(null);
            }
          }}
        />
      </CameraView>

      {cardProduct && (
        <ProductCard
          product={cardProduct}
          profile={profile}
          onClose={() => setCardProduct(null)}
          onTryOn={(p) => {
            setActiveTryOn(p);
            setCardProduct(null);
          }}
        />
      )}
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
  exitButton: {
    position: 'absolute',
    top: 56,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    color: '#fff',
    fontSize: 18,
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