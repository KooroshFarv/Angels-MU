import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { SkinTone, Undertone, ShopCategory, UserProfile } from '../types/UserProfile';

const SKIN_TONES: { value: SkinTone; hex: string; label: string }[] = [
  { value: 'fair', hex: '#F8E8D8', label: 'Fair' },
  { value: 'light', hex: '#F0C9A0', label: 'Light' },
  { value: 'medium', hex: '#D4956A', label: 'Medium' },
  { value: 'tan', hex: '#B5713A', label: 'Tan' },
  { value: 'deep', hex: '#7D4E2D', label: 'Deep' },
  { value: 'rich', hex: '#3D1F10', label: 'Rich' },
];

const UNDERTONES: { value: Undertone; label: string; description: string }[] = [
  { value: 'warm', label: 'Warm', description: 'Golden, peachy, yellow hints' },
  { value: 'cool', label: 'Cool', description: 'Pink, red, bluish hints' },
  { value: 'neutral', label: 'Neutral', description: 'Mix of warm and cool' },
];

const CATEGORIES: { value: ShopCategory; label: string; emoji: string }[] = [
  { value: 'lips', label: 'Lips', emoji: '💄' },
  { value: 'eyes', label: 'Eyes', emoji: '👁️' },
  { value: 'face', label: 'Face', emoji: '✨' },
  { value: 'all', label: 'Everything', emoji: '🛍️' },
];

const BRAND_OPTIONS = ['MAC', 'Fenty Beauty', 'NARS', 'Charlotte Tilbury', 'Maybelline', 'Dior', 'YSL', 'Rare Beauty', 'e.l.f.', 'NYX'];

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [skinTone, setSkinTone] = useState<SkinTone | null>(null);
  const [undertone, setUndertone] = useState<Undertone | null>(null);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const toggleCategory = (cat: ShopCategory) => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const canProceed = () => {
    if (step === 0) return skinTone !== null;
    if (step === 1) return undertone !== null;
    if (step === 2) return categories.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      onComplete({
        skinTone: skinTone!,
        undertone: undertone!,
        favoriteCategories: categories,
        favoriteBrands: brands,
        onboardingComplete: true,
      });
    }
  };

  const steps = [
    // Step 0 - Skin tone
    <View key="step0" style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Step 1 of 4</Text>
      <Text style={styles.title}>What's your skin tone?</Text>
      <Text style={styles.subtitle}>This helps us show the most accurate colors on you</Text>
      <View style={styles.toneGrid}>
        {SKIN_TONES.map(tone => (
          <TouchableOpacity
            key={tone.value}
            style={styles.toneOption}
            onPress={() => setSkinTone(tone.value)}
          >
            <View style={[
              styles.toneCircle,
              { backgroundColor: tone.hex },
              skinTone === tone.value && styles.toneSelected,
            ]} />
            <Text style={[styles.toneLabel, skinTone === tone.value && styles.toneLabelSelected]}>
              {tone.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>,

    // Step 1 - Undertone
    <View key="step1" style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Step 2 of 4</Text>
      <Text style={styles.title}>What's your undertone?</Text>
      <Text style={styles.subtitle}>Look at your wrist veins — green means warm, blue means cool</Text>
      <View style={styles.undertoneList}>
        {UNDERTONES.map(u => (
          <TouchableOpacity
            key={u.value}
            style={[styles.undertoneCard, undertone === u.value && styles.undertoneSelected]}
            onPress={() => setUndertone(u.value)}
          >
            <Text style={[styles.undertoneLabel, undertone === u.value && styles.undertoneLabelSelected]}>
              {u.label}
            </Text>
            <Text style={[styles.undertoneDesc, undertone === u.value && styles.undertoneLabelSelected]}>
              {u.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>,

    // Step 2 - Categories
    <View key="step2" style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Step 3 of 4</Text>
      <Text style={styles.title}>What do you shop for?</Text>
      <Text style={styles.subtitle}>Select all that apply</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.categoryCard, categories.includes(cat.value) && styles.categorySelected]}
            onPress={() => toggleCategory(cat.value)}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={[styles.categoryLabel, categories.includes(cat.value) && styles.categoryLabelSelected]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>,

    // Step 3 - Brands
    <View key="step3" style={styles.stepContainer}>
      <Text style={styles.stepLabel}>Step 4 of 4</Text>
      <Text style={styles.title}>Any favorite brands?</Text>
      <Text style={styles.subtitle}>We'll show these first. Skip if you're open to everything.</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.brandGrid}>
          {BRAND_OPTIONS.map(brand => (
            <TouchableOpacity
              key={brand}
              style={[styles.brandPill, brands.includes(brand) && styles.brandPillSelected]}
              onPress={() => toggleBrand(brand)}
            >
              <Text style={[styles.brandLabel, brands.includes(brand) && styles.brandLabelSelected]}>
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>,
  ];

  return (
    <View  style={styles.container}>
      <View style={styles.progressBar}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
        ))}
      </View>

      {steps[step]}

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(s => s - 1)}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextText}>{step === 3 ? 'Start exploring' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#333',
  },
  progressDotActive: {
    backgroundColor: '#E8453C',
  },
  stepContainer: {
    flex: 1,
  },
  stepLabel: {
    color: '#666',
    fontSize: 13,
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 32,
    lineHeight: 22,
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  toneOption: {
    alignItems: 'center',
    gap: 8,
  },
  toneCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  toneSelected: {
    borderColor: '#E8453C',
    transform: [{ scale: 1.1 }],
  },
  toneLabel: {
    color: '#666',
    fontSize: 13,
  },
  toneLabelSelected: {
    color: '#fff',
  },
  undertoneList: {
    gap: 12,
  },
  undertoneCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  undertoneSelected: {
    borderColor: '#E8453C',
    backgroundColor: '#1F0F0F',
  },
  undertoneLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  undertoneLabelSelected: {
    color: '#E8453C',
  },
  undertoneDesc: {
    color: '#666',
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categorySelected: {
    borderColor: '#E8453C',
    backgroundColor: '#1F0F0F',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: '#fff',
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 20,
  },
  brandPill: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#333',
  },
  brandPillSelected: {
    borderColor: '#E8453C',
    backgroundColor: '#1F0F0F',
  },
  brandLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  brandLabelSelected: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 32,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#E8453C',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});