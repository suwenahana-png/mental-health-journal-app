// screens/QuotesScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 💡 Data: kategori keadaan + quotes + emoji
const QUOTE_CATEGORIES = [
  {
    id: "anxious",
    label: "Lagi Cemas",
    emoji: "😰",
    color: "#FEE2E2",
    description: "Saat pikiran penuh kekhawatiran dan hati terasa gelisah.",
    quotes: [
      {
        text: "Kamu tidak harus percaya setiap pikiran yang muncul di kepalamu.",
        author: "Tidak diketahui",
      },
      {
        text: "Rasa cemas itu sementara. Kamu lebih kuat dari yang kamu bayangkan.",
        author: "Tidak diketahui",
      },
      {
        text: "Tarik napas pelan, hembuskan perlahan. Kamu sedang berusaha, dan itu sudah cukup.",
        author: "Tidak diketahui",
      },
    ],
  },
  {
    id: "motivation",
    label: "Butuh Motivasi",
    emoji: "⭐",
    color: "#FEF9C3",
    description: "Untuk hari-hari ketika rasanya mau menyerah.",
    quotes: [
      {
        text: "Langkah kecil setiap hari tetap membawamu maju.",
        author: "Tidak diketahui",
      },
      {
        text: "Kamu sudah berhasil melewati semua hari sulitmu sampai hari ini.",
        author: "Tidak diketahui",
      },
      {
        text: "Tidak apa-apa lelah. Yang penting kamu tidak berhenti.",
        author: "Tidak diketahui",
      },
    ],
  },
  {
    id: "selflove",
    label: "Self-Love",
    emoji: "💗",
    color: "#FCE7F3",
    description: "Saat kamu perlu mengingat bahwa kamu juga berharga.",
    quotes: [
      {
        text: "Bersikap lembutlah pada dirimu sendiri. Kamu juga manusia.",
        author: "Tidak diketahui",
      },
      {
        text: "Kamu pantas menerima cinta yang selama ini kamu berikan kepada orang lain.",
        author: "Tidak diketahui",
      },
      {
        text: "Tidak apa-apa belum sempurna. Yang penting kamu terus belajar mencintai dirimu sendiri.",
        author: "Tidak diketahui",
      },
    ],
  },
  {
    id: "burnout",
    label: "Capek / Burnout",
    emoji: "😴",
    color: "#EDE9FE",
    description: "Ketika badan dan pikiran sama-sama lelah.",
    quotes: [
      {
        text: "Istirahat bukan berarti kamu lemah. Istirahat itu bagian dari bertahan.",
        author: "Tidak diketahui",
      },
      {
        text: "Kamu tidak harus produktif setiap hari. Kadang, bertahan saja sudah cukup.",
        author: "Tidak diketahui",
      },
      {
        text: "Pelan tidak apa-apa. Kamu tetap bergerak maju.",
        author: "Tidak diketahui",
      },
    ],
  },
  {
    id: "gratitude",
    label: "Bersyukur",
    emoji: "🌼",
    color: "#DCFCE7",
    description: "Untuk mengingat hal-hal kecil yang patut disyukuri.",
    quotes: [
      {
        text: "Hari ini mungkin berat, tapi selalu ada hal kecil yang bisa kamu syukuri.",
        author: "Tidak diketahui",
      },
      {
        text: "Rasa syukur tidak menghapus masalah, tapi membuat hati lebih kuat menghadapinya.",
        author: "Tidak diketahui",
      },
      {
        text: "Hal-hal yang kamu punya sekarang mungkin adalah hal yang dulu pernah kamu doakan.",
        author: "Tidak diketahui",
      },
    ],
  },
];

export default function QuotesScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    QUOTE_CATEGORIES[0].id
  );

  const selectedCategory =
    QUOTE_CATEGORIES.find((cat) => cat.id === selectedCategoryId) ??
    QUOTE_CATEGORIES[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Quotes</Text>
      <Text style={styles.subtitle}>
        Pilih keadaanmu, lalu baca quotes yang sesuai dengan perasaanmu hari ini.
      </Text>

      {/* PILIH KEADAAN: GRID CARD */}
      <View style={styles.categoryGrid}>
        {QUOTE_CATEGORIES.map((cat) => {
          const isActive = cat.id === selectedCategoryId;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                { backgroundColor: cat.color },
                isActive && styles.categoryCardActive,
              ]}
              onPress={() => setSelectedCategoryId(cat.id)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* DESKRIPSI */}
      <Text style={styles.categoryDescription}>
        {selectedCategory.description}
      </Text>

      {/* LIST QUOTES */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedCategory.quotes.map((quote, index) => (
          <View key={index} style={styles.quoteCard}>
            <Text style={styles.quoteText}>“{quote.text}”</Text>
            <Text style={styles.quoteAuthor}>– {quote.author}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const BG = "#F1E4D3";
const CARD = "#f9e8d4";
const TEXT_DARK = "#3b3024";
const TEXT_SOFT = "#7c6750";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 6,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SOFT,
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },

  /* === CATEGORY GRID (kotak-kotak) === */
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  categoryCard: {
    width: "48%",
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  categoryCardActive: {
    borderWidth: 2,
    borderColor: TEXT_DARK,
  },

  categoryEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },

  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_DARK,
    fontFamily: "Poppins-Medium",
  },

  categoryDescription: {
    fontSize: 14,
    color: TEXT_SOFT,
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },

  /* === QUOTES CARD === */
  quoteCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  quoteText: {
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 6,
    fontFamily: "Poppins-Regular",
  },
  quoteAuthor: {
    fontSize: 14,
    color: TEXT_SOFT,
    fontFamily: "Poppins-Medium",
  },
});
