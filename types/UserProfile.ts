export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'deep' | 'rich';
export type Undertone = 'warm' | 'cool' | 'neutral';
export type ShopCategory = 'lips' | 'eyes' | 'face' | 'all';

export interface UserProfile {
  skinTone: SkinTone;
  undertone: Undertone;
  favoriteCategories: ShopCategory[];
  favoriteBrands: string[];
  onboardingComplete: boolean;
}