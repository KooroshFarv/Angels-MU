import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const UNDERTONES: { value: Undertone; label: string }[] = [
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'neutral', label: 'Neutral' },
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
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onClose: () => void;
}

export default function ProfileScreen({ profile, onUpdate, onClose }: Props) {
  const [skinTone, setSkinTone] = useState<SkinTone>(profile.skinTone);
  const [undertone, setUndertone] = useState<Undertone>(profile.undertone);
  const [categories, setCategories] = useState<ShopCategory[]>(profile.favoriteCategories);
  const [brands, setBrands] = useState<string[]>(profile.favoriteBrands);

  const toggleCategory = (cat: ShopCategory) =>
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleBrand = (brand: string) =>
    setBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );

  const handleSave = async () => {
    const updated: UserProfile = {
      ...profile,
      skinTone,
      undertone,
      favoriteCategories: categories,
      favoriteBrands: brands,
    };
    await AsyncStorage.setItem('userProfile', JSON.stringify(updated));
    onUpdate(updated);
    onClose();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset profile',
      'This will clear your preferences and restart the onboarding. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            onUpdate({ ...profile, onboardingComplete: false });
            onClose();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Profile</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skin tone</Text>
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

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Undertone</Text>
          <View style={styles.undertoneRow}>
            {UNDERTONES.map(u => (
              <TouchableOpacity
                key={u.value}
                style={[
                  styles.undertonePill,
                  undertone === u.value && styles.undertonePillSelected,
                ]}
                onPress={() => setUndertone(u.value)}
              >
                <Text style={[
                  styles.undertoneText,
                  undertone === u.value && styles.undertoneTextSelected,
                ]}>
                  {u.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shopping preferences</Text>
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

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favourite brands</Text>
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
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetText}>Reset profile</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: theme.gray1,
    fontSize: 16,
  },
  title: {
    color: theme.white,
    fontSize: 18,
    fontFamily: theme.fonts.heading,
  },
  saveBtn: {
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.4)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: theme.gold,
    fontSize: 14,
    fontFamily: theme.fonts.bodySemiBold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: theme.white,
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    marginBottom: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 24,
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
  undertoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  undertonePill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  undertonePillSelected: {
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderColor: 'rgba(201,168,76,0.4)',
  },
  undertoneText: {
    color: theme.gray1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
  },
  undertoneTextSelected: {
    color: theme.gold,
    fontFamily: theme.fonts.bodySemiBold,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
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
    fontSize: 26,
    marginBottom: 6,
  },
  categoryLabel: {
    color: theme.gray1,
    fontSize: 13,
    fontFamily: theme.fonts.bodySemiBold,
  },
  categoryLabelSelected: {
    color: theme.gold,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandPill: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  brandPillSelected: {
    borderColor: 'rgba(201,168,76,0.5)',
    backgroundColor: 'rgba(201,168,76,0.06)',
  },
  brandLabel: {
    color: theme.gray1,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  brandLabelSelected: {
    color: theme.gold,
  },
  resetBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,80,80,0.3)',
    backgroundColor: 'rgba(255,80,80,0.06)',
  },
  resetText: {
    color: '#FF5050',
    fontSize: 14,
    fontFamily: theme.fonts.bodySemiBold,
  },
});