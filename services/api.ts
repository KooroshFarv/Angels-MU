const API_BASE = 'http://172.20.10.2:3000';

export interface ApiBrand {
  id: string;
  name: string;
  logoUrl: string | null;
  affiliateBaseUrl: string;
  accentColor: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  colorHex: string;
  colorName: string;
  price: number;
  purchaseUrl: string;
  imageUrl: string | null;
  compatibleSkinTones: string[];
  inInventory: boolean | null;
  brand: ApiBrand;
}

export async function fetchBrands(): Promise<ApiBrand[]> {
  const res = await fetch(`${API_BASE}/api/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
}

export async function fetchProducts(params?: {
  category?: string;
  brandId?: string;
  skinTone?: string;
}): Promise<ApiProduct[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') query.set('category', params.category);
  if (params?.brandId && params.brandId !== 'all') query.set('brandId', params.brandId);
  if (params?.skinTone) query.set('skinTone', params.skinTone);

  const res = await fetch(`${API_BASE}/api/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchReviews(productId: string, skinTone?: string) {
  const query = new URLSearchParams({ productId });
  if (skinTone) query.set('skinTone', skinTone);
  const res = await fetch(`${API_BASE}/api/reviews?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function postReview(review: {
  productId: string;
  userId: string;
  skinTone: string;
  rating: number;
  text: string;
}) {
  const res = await fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error('Failed to post review');
  return res.json();
}