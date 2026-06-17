import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Product } from '../types/Product';
import { UserProfile } from '../types/UserProfile';

interface Props {
  product: Product;
  profile: UserProfile;
  onClose: () => void;
  onTryOn: (product: Product) => void;
}

export default function ProductCard({ product, profile, onClose, onTryOn }: Props) {
  const compatible = product.compatibleSkinTones.includes(profile.skinTone);

  const handleBuy = () => {
    Linking.openURL(product.purchaseUrl);
  };

  const handleTryOn = () => {
    onClose();
    onTryOn(product);
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      <View style={styles.card}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={[styles.colorPreview, { backgroundColor: product.colorHex }]} />
            <View style={styles.headerInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.brandName}>{product.brand.name}</Text>
              <Text style={styles.colorName}>{product.colorName}</Text>
              <Text style={styles.price}>${product.price}</Text>
            </View>
          </View>

          <View style={styles.compatibilityRow}>
            <View style={[styles.compatBadge, compatible ? styles.compatGood : styles.compatNeutral]}>
              <Text style={styles.compatText}>
                {compatible ? '✓ Matches your skin tone' : 'May vary on your skin tone'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>About this shade</Text>
            <Text style={styles.detailText}>
              {product.colorName} is a {product.category} product by {product.brand.name}.
              Priced at ${product.price}, it works best on {product.compatibleSkinTones.join(', ')} skin tones.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.emptyReviews}>No reviews yet. Be the first to try it on and share your thoughts.</Text>
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.tryOnButton} onPress={handleTryOn}>
            <Text style={styles.tryOnText}>Try On</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
            <Text style={styles.buyText}>Buy — ${product.price}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: '#111',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '75%',
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 16,
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  productName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  brandName: {
    color: '#888',
    fontSize: 14,
  },
  colorName: {
    color: '#666',
    fontSize: 13,
  },
  price: {
    color: '#E8453C',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  compatibilityRow: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  compatBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  compatGood: {
    backgroundColor: '#0F2E1A',
  },
  compatNeutral: {
    backgroundColor: '#1A1A1A',
  },
  compatText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1E1E',
    marginHorizontal: 24,
    marginVertical: 16,
  },
  detailsSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailText: {
    color: '#888',
    fontSize: 14,
    lineHeight: 22,
  },
  reviewsSection: {
    paddingHorizontal: 24,
  },
  emptyReviews: {
    color: '#555',
    fontSize: 14,
    lineHeight: 22,
  },
  spacer: {
    height: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
  },
  tryOnButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8453C',
  },
  tryOnText: {
    color: '#E8453C',
    fontSize: 16,
    fontWeight: '700',
  },
  buyButton: {
    flex: 2,
    backgroundColor: '#E8453C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});