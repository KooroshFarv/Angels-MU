import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { Product } from '../types/Product';
import { UserProfile } from '../types/UserProfile';
import { theme } from '../constants/theme';
import ReviewSheet from './ReviewSheet';

interface Props {
  product: Product;
  profile: UserProfile;
  onClose: () => void;
  onTryOn: (product: Product) => void;
}

export default function ProductCard({ product, profile, onClose, onTryOn }: Props) {
  const [showReviews, setShowReviews] = useState(false);
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
            <View style={[styles.colorPreview, { backgroundColor: product.colorHex }]}>
              <View style={styles.colorPreviewInner} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.brandLabel}>{product.brand.name}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.shadeName}>{product.colorName}</Text>
              <Text style={styles.price}>${product.price}</Text>
            </View>
          </View>

          {compatible && (
            <View style={styles.compatRow}>
              <View style={styles.compatBadge}>
                <View style={styles.compatDot} />
                <Text style={styles.compatText}>Matches your skin tone</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this shade</Text>
            <Text style={styles.sectionBody}>
              {product.name} by {product.brand.name} is a {product.category} shade in {product.colorName.toLowerCase()}.
              Best suited for {product.compatibleSkinTones.join(', ')} skin tones.
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={() => setShowReviews(true)}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.writeReviewBtn}
              onPress={() => setShowReviews(true)}
            >
              <Text style={styles.writeReviewText}>Write a review</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.tryOnBtn} onPress={handleTryOn}>
            <Text style={styles.tryOnText}>Try On</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyBtn} onPress={handleBuy}>
            <View style={styles.buyDot} />
            <Text style={styles.buyText}>Buy — ${product.price}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showReviews && (
        <ReviewSheet
          productId={product.id}
          profile={profile}
          onClose={() => setShowReviews(false)}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    backgroundColor: 'rgba(18,18,18,0.97)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '78%',
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    width: 88,
    height: 88,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 6,
  },
  colorPreviewInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  brandLabel: {
    color: theme.gray1,
    fontSize: 12,
    fontFamily: theme.fonts.body,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  productName: {
    color: theme.white,
    fontSize: 22,
    fontFamily: theme.fonts.heading,
  },
  shadeName: {
    color: theme.gray2,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  price: {
    color: theme.gold,
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    marginTop: 4,
  },
  compatRow: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  compatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(61,181,106,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(61,181,106,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  compatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.green,
  },
  compatText: {
    color: theme.green,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: 24,
    marginVertical: 16,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    color: theme.white,
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    marginBottom: 10,
  },
  sectionBody: {
    color: theme.gray1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    lineHeight: 22,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    color: theme.gold,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  writeReviewBtn: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  writeReviewText: {
    color: theme.gray1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  tryOnBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.6)',
    backgroundColor: 'rgba(201,168,76,0.07)',
  },
  tryOnText: {
    color: theme.gold,
    fontSize: 15,
    fontFamily: theme.fonts.bodySemiBold,
  },
  buyBtn: {
    flex: 2,
    backgroundColor: 'rgba(61,181,106,0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(61,181,106,0.4)',
  },
  buyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.green,
  },
  buyText: {
    color: theme.green,
    fontSize: 15,
    fontFamily: theme.fonts.bodySemiBold,
  },
});