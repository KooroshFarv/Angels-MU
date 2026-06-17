import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review } from '../types/Product';
import { UserProfile } from '../types/UserProfile';
import { theme } from '../constants/theme';

interface Props {
  productId: string;
  profile: UserProfile;
  onClose: () => void;
}

const SKIN_TONE_LABELS: Record<string, string> = {
  fair: 'Fair',
  light: 'Light',
  medium: 'Medium',
  tan: 'Tan',
  deep: 'Deep',
  rich: 'Rich',
};

export default function ReviewSheet({ productId, profile, onClose }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [filterTone, setFilterTone] = useState<string | 'all'>('all');
  const [loaded, setLoaded] = useState(false);

    useEffect(() => {
  AsyncStorage.getItem(`reviews_${productId}`).then(data => {
    if (data) setReviews(JSON.parse(data));
    setLoaded(true);
  });
}, [productId]);

if (!loaded) return null;


  const saveReview = async () => {
    if (!text.trim()) return;
    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      userId: 'local',
      skinTone: profile.skinTone,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    await AsyncStorage.setItem(`reviews_${productId}`, JSON.stringify(updated));
    setReviews(updated);
    setText('');
    setRating(5);
    setWriting(false);
  };

  const filtered = filterTone === 'all'
    ? reviews
    : reviews.filter(r => r.skinTone === filterTone);

  const tones = ['all', ...Array.from(new Set(reviews.map(r => r.skinTone)))];

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Reviews</Text>
          <TouchableOpacity style={styles.writeBtn} onPress={() => setWriting(true)}>
            <Text style={styles.writeBtnText}>Write a review</Text>
          </TouchableOpacity>
        </View>

        {tones.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toneFilter}
          >
            {tones.map(tone => (
              <TouchableOpacity
                key={tone}
                style={[styles.tonePill, filterTone === tone && styles.tonePillActive]}
                onPress={() => setFilterTone(tone)}
              >
                <Text style={[styles.tonePillText, filterTone === tone && styles.tonePillTextActive]}>
                  {tone === 'all' ? 'All tones' : SKIN_TONE_LABELS[tone] ?? tone}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <ScrollView style={styles.reviewList} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No reviews yet.</Text>
              <Text style={styles.emptySubtext}>Be the first to share your thoughts.</Text>
            </View>
          )}

          {filtered.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewMeta}>
                  <View style={styles.skinToneDot} />
                  <Text style={styles.reviewTone}>{SKIN_TONE_LABELS[review.skinTone] ?? review.skinTone} skin</Text>
                </View>
                <View style={styles.stars}>
                  {[1,2,3,4,5].map(s => (
                    <Text key={s} style={[styles.star, s <= review.rating && styles.starActive]}>★</Text>
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          ))}

          <View style={{ height: 32 }} />
        </ScrollView>

        {writing && (
          <View style={styles.writeForm}>
            <Text style={styles.writeTitle}>Your review</Text>
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Text style={[styles.starLarge, s <= rating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="How did this shade look on you?"
              placeholderTextColor={theme.gray2}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={3}
            />
            <View style={styles.writeActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setWriting(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={saveReview}>
                <Text style={styles.submitText}>Post review</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: 'rgba(12,12,12,0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sheetTitle: {
    color: theme.white,
    fontSize: 20,
    fontFamily: theme.fonts.heading,
  },
  writeBtn: {
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.4)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  writeBtnText: {
    color: theme.gold,
    fontSize: 13,
    fontFamily: theme.fonts.bodySemiBold,
  },
  toneFilter: {
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
  },
  tonePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tonePillActive: {
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderColor: 'rgba(201,168,76,0.4)',
  },
  tonePillText: {
    color: theme.gray1,
    fontSize: 12,
    fontFamily: theme.fonts.body,
  },
  tonePillTextActive: {
    color: theme.gold,
  },
  reviewList: {
    paddingHorizontal: 20,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 6,
  },
  emptyText: {
    color: theme.gray1,
    fontSize: 15,
    fontFamily: theme.fonts.bodySemiBold,
  },
  emptySubtext: {
    color: theme.gray2,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skinToneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.green,
  },
  reviewTone: {
    color: theme.gray1,
    fontSize: 12,
    fontFamily: theme.fonts.body,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 14,
    color: theme.gray3,
  },
  starActive: {
    color: theme.gold,
  },
  starLarge: {
    fontSize: 28,
    color: theme.gray3,
  },
  reviewText: {
    color: theme.white,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    lineHeight: 21,
  },
  reviewDate: {
    color: theme.gray2,
    fontSize: 11,
    fontFamily: theme.fonts.body,
  },
  writeForm: {
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.07)',
    gap: 12,
  },
  writeTitle: {
    color: theme.white,
    fontSize: 16,
    fontFamily: theme.fonts.heading,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    color: theme.white,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  writeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelText: {
    color: theme.gray1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  submitText: {
    color: theme.gold,
    fontSize: 14,
    fontFamily: theme.fonts.bodySemiBold,
  },
});