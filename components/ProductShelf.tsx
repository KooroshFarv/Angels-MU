import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Product } from '../types/Product';
import { UserProfile } from '../types/UserProfile';
import { PRODUCTS } from '../constants/mockData';

interface Props {
  profile: UserProfile;
  onSelectProduct: (product: Product | null) => void;
  selectedProduct: Product | null;
}

export default function ProductShelf({ profile, onSelectProduct, selectedProduct }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'lips', 'eyes', 'face'];

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const isCompatible = (product: Product) =>
    product.compatibleSkinTones.includes(profile.skinTone);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      >
        {filteredProducts.map(product => {
          const selected = selectedProduct?.id === product.id;
          const compatible = isCompatible(product);

          return (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => onSelectProduct(selected ? null : product)}
            >
              <View style={[
                styles.colorCircle,
                { backgroundColor: product.colorHex },
                selected && styles.colorCircleSelected,
              ]}>
                {compatible && (
                  <View style={styles.compatibleDot} />
                )}
              </View>
              <Text style={[styles.productName, selected && styles.productNameSelected]} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.brandName} numberOfLines={1}>
                {product.brand.name}
              </Text>
              <Text style={styles.price}>${product.price}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendDot} />
        <Text style={styles.legendText}>Matches your skin tone</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingTop: 12,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryPillActive: {
    backgroundColor: '#E8453C',
    borderColor: '#E8453C',
  },
  categoryText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  productList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productCard: {
    alignItems: 'center',
    width: 72,
  },
  colorCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 6,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  colorCircleSelected: {
    borderColor: '#E8453C',
    transform: [{ scale: 1.15 }],
  },
  compatibleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 1.5,
    borderColor: '#000',
    margin: 2,
  },
  productName: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  productNameSelected: {
    color: '#fff',
  },
  brandName: {
    color: '#555',
    fontSize: 10,
    textAlign: 'center',
  },
  price: {
    color: '#E8453C',
    fontSize: 11,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  legendText: {
    color: '#555',
    fontSize: 11,
  },
});