import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SkinTone, Undertone, ShopCategory, UserProfile } from '../types/UserProfile';
import { theme } from '../constants/theme';

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

const BRAND_OPTIONS = [
  'MAC', 'Fenty Beauty', 'NARS', 'Charlotte Tilbury',
  'Maybelline', 'Dior', 'YSL', 'Rare Beauty', 'e.l.f.', 'NYX',
];

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [skinTone, setSkinTone] = useState<SkinTone | null>(null);
  const [undertone, setUndertone] = useState<Undertone | null>(null);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const toggleCategory = (cat: ShopCategory) =>
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleBrand = (brand: string) =>
    setBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );

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

  return (
    <View style={styles.container}>

      <View style={styles.topSection}>
        <Text style={styles.logo}>Try On Angel</Text>
        <Text style={styles.logoSub}>your beauty, your shade</Text>
      </View>

      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              styles.progressBar,
              i <= step && styles.progressBarActive,
              i < step && styles.progressBarDone,
            ]}
          />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.stepLabel}>Step {step + 1} of 4</Text>

        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your{'\n'}skin tone?</Text>
            <Text style={styles.stepSubtitle}>We'll show the most accurate colors on you</Text>
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
                    skinTone === tone.value && styles.toneCircleSelected,
                  ]} />
                  <Text style={[
                    styles.toneLabel,
                    skinTone === tone.value && styles.toneLabelSelected,
                  ]}>
                    {tone.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your{'\n'}undertone?</Text>
            <Text style={styles.stepSubtitle}>Look at your wrist veins — green means warm, blue means cool</Text>
            <View style={styles.undertoneList}>
              {UNDERTONES.map(u => (
                <TouchableOpacity
                  key={u.value}
                  style={[
                    styles.undertoneCard,
                    undertone === u.value && styles.undertoneCardSelected,
                  ]}
                  onPress={() => setUndertone(u.value)}
                >
                  <Text style={[
                    styles.undertoneLabel,
                    undertone === u.value && styles.undertoneLabelSelected,
                  ]}>
                    {u.label}
                  </Text>
                  <Text style={[
                    styles.undertoneDesc,
                    undertone === u.value && styles.undertoneDescSelected,
                  ]}>
                    {u.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What do you{'\n'}shop for?</Text>
            <Text style={styles.stepSubtitle}>Select all that apply</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryCard,
                    categories.includes(cat.value) && styles.categoryCardSelected,
                  ]}
                  onPress={() => toggleCategory(cat.value)}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={[
                    styles.categoryLabel,
                    categories.includes(cat.value) && styles.categoryLabelSelected,
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Favourite{'\n'}brands?</Text>
            <Text style={styles.stepSubtitle}>We'll show these first. Skip if you're open to everything.</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.brandScroll}>
              <View style={styles.brandGrid}>
                {BRAND_OPTIONS.map(brand => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.brandPill,
                      brands.includes(brand) && styles.brandPillSelected,
                    ]}
                    onPress={() => toggleBrand(brand)}
                  >
                    <Text style={[
                      styles.brandLabel,
                      brands.includes(brand) && styles.brandLabelSelected,
                    ]}>
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(s => s - 1)}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextText}>
            {step === 3 ? 'Start exploring' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
    paddingTop: 64,
  },
  topSection: {
    marginBottom: 32,
  },
  logo: {
    color: theme.gold,
    fontSize: 38,
    fontFamily: theme.fonts.heading,
    letterSpacing: -1,
  },
  logoSub: {
    color: theme.gray2,
    fontSize: 13,
    fontFamily: theme.fonts.body,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 28,
  },
  progressBar: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
    progressBarActive: {
    backgroundColor: theme.gold,
    },
    progressBarDone: {
    backgroundColor: theme.gold,
    },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
  },
  stepLabel: {
    color: theme.gray2,
    fontSize: 11,
    fontFamily: theme.fonts.body,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: theme.white,
    fontSize: 32,
    fontFamily: theme.fonts.heading,
    lineHeight: 40,
    marginBottom: 8,
  },
  stepSubtitle: {
    color: theme.gray1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    lineHeight: 21,
    marginBottom: 28,
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  toneOption: {
    alignItems: 'center',
    gap: 8,
  },
  toneCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toneCircleSelected: {
    borderColor: theme.gold,
    transform: [{ scale: 1.08 }],
  },
  toneLabel: {
    color: theme.gray2,
    fontSize: 12,
    fontFamily: theme.fonts.body,
  },
  toneLabelSelected: {
    color: theme.gold,
  },
  undertoneList: {
    gap: 10,
  },
  undertoneCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  undertoneCardSelected: {
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: 'rgba(201,168,76,0.06)',
  },
  undertoneLabel: {
    color: theme.white,
    fontSize: 17,
    fontFamily: theme.fonts.heading,
    marginBottom: 3,
  },
  undertoneLabelSelected: {
    color: theme.gold,
  },
  undertoneDesc: {
    color: theme.gray2,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  undertoneDescSelected: {
    color: theme.gray1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    width: '47%',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  categoryCardSelected: {
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: 'rgba(201,168,76,0.06)',
  },
  categoryEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryLabel: {
    color: theme.gray1,
    fontSize: 14,
    fontFamily: theme.fonts.bodySemiBold,
  },
  categoryLabelSelected: {
    color: theme.gold,
  },
  brandScroll: {
    flex: 1,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 20,
  },
  brandPill: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  brandPillSelected: {
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: 'rgba(201,168,76,0.06)',
  },
  brandLabel: {
    color: theme.gray1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
  },
  brandLabelSelected: {
    color: theme.gold,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 24,
  },
  backBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  backText: {
    color: theme.gray1,
    fontSize: 15,
    fontFamily: theme.fonts.body,
  },
  nextBtn: {
    flex: 2,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  nextBtnDisabled: {
    opacity: 0.35,
  },
  nextText: {
    color: theme.gold,
    fontSize: 15,
    fontFamily: theme.fonts.bodySemiBold,
  },
});