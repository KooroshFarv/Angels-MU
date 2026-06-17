import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PRODUCTS } from '../constants/mockData';
import { Product } from '../types/Product';
import { theme } from '../constants/theme';

interface Props {
  currentProduct: Product;
  onSelect: (product: Product) => void;
}

export default function SimilarShades({ currentProduct, onSelect }: Props) {
  const similar = PRODUCTS.filter(p =>
    p.id !== currentProduct.id &&
    p.category === currentProduct.category &&
    p.brand.id !== currentProduct.brand.id
  );

  if (similar.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Similar shades</Text>
        <Text style={styles.subtitle}>from other brands</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {similar.map(product => {
          const isActive = product.id === currentProduct.id;
          return (
            <TouchableOpacity
              key={product.id}
              style={styles.item}
              onPress={() => onSelect(product)}
            >
              <View style={[
                styles.circle,
                { backgroundColor: product.colorHex },
                isActive && styles.circleActive,
              ]} />
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.brandName} numberOfLines={1}>{product.brand.name}</Text>
              <Text style={styles.price}>${product.price}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(8,8,8,0.92)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(201,168,76,0.2)',
    paddingTop: 14,
    paddingBottom: 36,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  title: {
    color: theme.white,
    fontSize: 15,
    fontFamily: theme.fonts.heading,
  },
  subtitle: {
    color: theme.gray2,
    fontSize: 12,
    fontFamily: theme.fonts.body,
  },
  list: {
    paddingHorizontal: 20,
    gap: 16,
  },
  item: {
    alignItems: 'center',
    width: 68,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  circleActive: {
    borderWidth: 2,
    borderColor: theme.gold,
    transform: [{ scale: 1.1 }],
  },
  productName: {
    color: theme.white,
    fontSize: 11,
    fontFamily: theme.fonts.bodySemiBold,
    textAlign: 'center',
  },
  brandName: {
    color: theme.gray2,
    fontSize: 10,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
  },
  price: {
    color: theme.gold,
    fontSize: 11,
    fontFamily: theme.fonts.bodySemiBold,
    marginTop: 2,
  },
});