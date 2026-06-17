import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { PRODUCTS, BRANDS } from '../constants/mockData';
import { Product } from '../types/Product';
import { UserProfile } from '../types/UserProfile';
import ProductCard from './ProductCards';
import { theme } from '../constants/theme';
import ProfileScreen from './ProfileScreen';

interface Props {
  profile: UserProfile;
  onTryOn: (product: Product) => void;
  onUpdate: (profile: UserProfile) => void;
}

export default function BrowseScreen({ profile, onTryOn, onUpdate }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [showProfile, setShowProfile] = useState(false);

  const categories = ['all', 'lips', 'eyes', 'face'];

  const filtered = PRODUCTS.filter(p => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    const brandMatch = activeBrand === 'all' || p.brand.id === activeBrand;
    return catMatch && brandMatch;
  });

  const isCompatible = (p: Product) =>
    p.compatibleSkinTones.includes(profile.skinTone);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>mirrors</Text>
          <Text style={styles.subtitle}>Find your shade</Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => setShowProfile(true)}
        >
          <Text style={styles.profileBtnText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterPill, activeCategory === cat && styles.filterPillActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.filterDivider} />

        <TouchableOpacity
          style={[styles.filterPill, activeBrand === 'all' && styles.filterPillActive]}
          onPress={() => setActiveBrand('all')}
        >
          <Text style={[styles.filterText, activeBrand === 'all' && styles.filterTextActive]}>
            All Brands
          </Text>
        </TouchableOpacity>

        {BRANDS.map(brand => (
          <TouchableOpacity
            key={brand.id}
            style={[styles.filterPill, activeBrand === brand.id && styles.filterPillActive]}
            onPress={() => setActiveBrand(brand.id)}
          >
            <Text style={[styles.filterText, activeBrand === brand.id && styles.filterTextActive]}>
              {brand.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <Text style={styles.emptyText}>No products found.</Text>
        )}

        {filtered.map(product => {
          const compatible = isCompatible(product);
          return (
            <TouchableOpacity
              key={product.id}
              style={[styles.card, compatible && styles.cardGold]}
              onPress={() => setSelectedProduct(product)}
              activeOpacity={0.85}
            >
              <View style={styles.cardInner}>
                <View style={styles.imageBox}>
                  {product.imageUrl ? (
                    <Image
                      source={{ uri: product.imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.colorFallback, { backgroundColor: product.colorHex }]}>
                      <Text style={styles.fallbackLabel}>{product.colorName}</Text>
                    </View>
                  )}
                  {compatible && (
                    <View style={styles.toneBadge}>
                      <View style={styles.toneDot} />
                      <Text style={styles.toneText}>Your tone</Text>
                    </View>
                  )}
                </View>

                <View style={styles.info}>
                  <View>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.brandName}>{product.brand.name}</Text>
                    <Text style={styles.shadeName}>{product.colorName}</Text>
                  </View>
                  <Text style={styles.price}>${product.price}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.tryOnBtn}
                  onPress={() => onTryOn(product)}
                >
                  <Text style={styles.tryOnText}>Try On</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => setSelectedProduct(product)}
                >
                  <View style={styles.buyDot} />
                  <Text style={styles.buyText}>View & Buy</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {selectedProduct && (
        <ProductCard
          product={selectedProduct}
          profile={profile}
          onClose={() => setSelectedProduct(null)}
          onTryOn={(p) => {
            setSelectedProduct(null);
            onTryOn(p);
          }}
        />
      )}

      {showProfile && (
        <ProfileScreen
          profile={profile}
          onUpdate={(p) => {
            onUpdate(p);
            setShowProfile(false);
          }}
          onClose={() => setShowProfile(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  logo: {
    color: theme.gold,
    fontSize: 34,
    letterSpacing: -1,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    color: theme.gray2,
    fontSize: 13,
    marginTop: 2,
    fontFamily: theme.fonts.body,
  },
  profileBtn: {
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileBtnText: {
    color: theme.gold,
    fontSize: 13,
    fontFamily: theme.fonts.bodySemiBold,
  },
  filterScroll: {
    maxHeight: 44,
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: theme.gray4,
    borderWidth: 1,
    borderColor: theme.gray3,
  },
  filterPillActive: {
    backgroundColor: theme.goldDim,
    borderColor: theme.gold,
  },
  filterText: {
    color: theme.gray1,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  filterTextActive: {
    color: theme.gold,
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.gray3,
    marginHorizontal: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingTop: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  cardGold: {
    borderColor: 'rgba(201,168,76,0.45)',
    borderWidth: 0.5,
  },
  cardInner: {
    flexDirection: 'row',
    padding: 14,
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  imageBox: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
  },
  productImage: {
    width: 90,
    height: 90,
  },
  colorFallback: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    borderRadius: 14,
  },
  fallbackLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  toneBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  toneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.green,
  },
  toneText: {
    color: theme.green,
    fontSize: 10,
    fontFamily: theme.fonts.bodySemiBold,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    color: theme.white,
    fontSize: 17,
    marginBottom: 3,
    fontFamily: theme.fonts.heading,
  },
  brandName: {
    color: theme.gray1,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  shadeName: {
    color: theme.gray2,
    fontSize: 12,
    marginTop: 2,
    fontFamily: theme.fonts.body,
  },
  price: {
    color: theme.gold,
    fontSize: 20,
    fontFamily: theme.fonts.heading,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  tryOnBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.6)',
    backgroundColor: 'rgba(201,168,76,0.07)',
  },
  tryOnText: {
    color: theme.gold,
    fontSize: 14,
    fontFamily: theme.fonts.bodySemiBold,
  },
  buyBtn: {
    flex: 2,
    backgroundColor: 'rgba(61,181,106,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
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
    fontSize: 14,
    fontFamily: theme.fonts.bodySemiBold,
  },
  emptyText: {
    color: theme.gray2,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
    fontFamily: theme.fonts.body,
  },
});