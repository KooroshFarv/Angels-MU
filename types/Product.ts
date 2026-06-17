export type ProductCategory = 'lips' | 'eyes' | 'face';

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  affiliateBaseUrl: string;
  accentColor: string;
}

export interface Product {
  id: string;
  name: string;
  brand: Brand;
  category: ProductCategory;
  colorHex: string;
  colorName: string;
  price: number;
  purchaseUrl: string;
  imageUrl: string;
  compatibleSkinTones: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  skinTone: string;
  rating: number;
  text: string;
  createdAt: string;
}