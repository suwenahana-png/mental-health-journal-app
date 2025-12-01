// screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const JOURNAL_KEY = "@journals";
const QUOTE_KEY = "@quote_of_the_day";

// ✅ Kumpulan Quotes
const QUOTES = [
  { text: "The greatest wealth is mental health.", author: "Virgil" },
  { text: "You are not your thoughts.", author: "Unknown" },
  { text: "Rest is not a waste of time; it’s how you survive.", author: "Unknown" },
  { text: "It’s okay to not be okay, as long as you are not giving up.", author: "Karen Salmansohn" },
  { text: "Small steps every day still move you forward.", author: "Unknown" },
  { text: "Be kind to your mind.", author: "Unknown" },
  { text: "You have survived 100% of your bad days.", author: "Unknown" },
];

export default function HomeScreen({ navigation }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [todayQuote, setTodayQuote] = useState<{ text: string; author: string } | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadEntries();
      loadQuoteOfTheDay();
    }
  }, [isFocused]);

  const loadEntries = async () => {
    try {
      const json = await AsyncStorage.getItem(JOURNAL_KEY);
      if (json) {
        const data = JSON.parse(json);
        data.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEntries(data);
      } else {
        setEntries([]);
      }
    } catch (e) {
      console.log("Error load journals", e);
    }
  };

  // 🔥 Quote of the Day
  const loadQuoteOfTheDay = async () => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
      const stored = await AsyncStorage.getItem(QUOTE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayStr && typeof parsed.index === "number") {
          setTodayQuote(QUOTES[parsed.index % QUOTES.length]);
          return;
        }
      }

      const newIndex = Math.floor(Math.random() * QUOTES.length);
      const newQuote = QUOTES[newIndex];

      setTodayQuote(newQuote);

      await AsyncStorage.setItem(
        QUOTE_KEY,
        JSON.stringify({ date: todayStr, index: newIndex })
      );
    } catch (e) {
      console.log("Error load quote of the day", e);
      setTodayQuote(QUOTES[0]); // fallback
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  // 🗑 Delete journal
  const deleteEntry = async (id: string) => {
    Alert.alert("Delete journal", "Yakin mau menghapus jurnal ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            const updated = entries.filter((e) => e.id !== id);
            setEntries(updated);
            await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
          } catch (e) {
            console.log("Error delete journal", e);
          }
        },
      },
    ]);
  };

  // ✏️ Edit journal → ke EditJournalScreen
  const editEntry = (entry: any) => {
    navigation.navigate("EditJournal", { entry });
  };

  // 🌤 Mood hari ini (diambil dari jurnal-jurnal hari ini yang punya moodScore)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysWithMood = entries.filter(
    (e) =>
      e.date?.slice(0, 10) === todayStr &&
      typeof e.moodScore === "number"
  );

  let todayMood: { label: string; emoji: string; avg: number } | null = null;
  if (todaysWithMood.length > 0) {
    const sum = todaysWithMood.reduce(
      (acc, cur) => acc + (cur.moodScore || 0),
      0
    );
    const avg = sum / todaysWithMood.length;

    let label = "Netral";
    let emoji = "😐";
    if (avg >= 4) {
      label = "Baik";
      emoji = "😊";
    } else if (avg < 3) {
      label = "Kurang Baik";
      emoji = "😔";
    }

    todayMood = { label, emoji, avg };
  }

  const getMoodEmoji = (mood?: string, score?: number) => {
    if (mood === "Baik" || (score ?? 0) >= 4) return "😊";
    if (mood === "Kurang Baik" || (score ?? 0) < 3) return "😔";
    return "😐";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          {/* Logo kiri */}
          <Image
            source={require("../assets/icons/image.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Judul tengah */}
          <Text style={styles.title}>Mental Health</Text>

          {/* Tombol settings kanan (belum ada fungsi) */}
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* QUOTE OF THE DAY */}
          <Text style={styles.sectionTitle}>Quote of the Day</Text>
          <View style={styles.card}>
            {todayQuote ? (
              <>
                <Text style={styles.quoteText}>“{todayQuote.text}”</Text>
                <Text style={styles.quoteAuthor}>– {todayQuote.author}</Text>
              </>
            ) : (
              <Text style={styles.quoteText}>Loading quote...</Text>
            )}
          </View>

          {/* MOOD KAMU HARI INI */}
          {todayMood && (
            <>
              <Text style={styles.sectionTitle}>Mood Kamu Hari Ini</Text>
              <View style={styles.todayMoodCard}>
                <Text style={styles.todayMoodEmoji}>{todayMood.emoji}</Text>
                <View>
                  <Text style={styles.todayMoodText}>{todayMood.label}</Text>
                  <Text style={styles.todayMoodScore}>
                    Rata-rata skor: {todayMood.avg.toFixed(1)} / 5
                  </Text>
                </View>
              </View>
            </>
          )}

          
          {/* DAILY JOURNALING */}
          <Text style={styles.sectionTitle}>Daily Journaling</Text>

          {entries.length === 0 ? (
            <Text style={styles.emptyText}>
              You don’t have any journal yet. Start writing your first one!
            </Text>
          ) : (
            entries.map((entry) => (
              <View style={styles.card} key={entry.id}>
                {/* header card: tanggal + mood + tombol edit/delete */}
                <View style={styles.entryHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dateText}>{formatDate(entry.date)}</Text>

                    {entry.mood && (
                      <Text style={styles.moodBadge}>
                        {getMoodEmoji(entry.mood, entry.moodScore)} {entry.mood}
                      </Text>
                    )}
                  </View>

                  <View style={styles.entryActions}>
                    <TouchableOpacity onPress={() => editEntry(entry)}>
                      <Text style={styles.actionEdit}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
                      <Text style={styles.actionDelete}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryBody}>{entry.body}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ======== STYLE ========
const BG = "#f5e3c9";
const CARD = "#f9e8d4";
const TEXT_DARK = "#3b3024";
const TEXT_SOFT = "#7c6750";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  settingsButton: {
    flex: 1,
    alignItems: "flex-end",
  },

  title: {
    flex: 2,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_DARK,
    fontFamily: "Poppins-Bold",
  },

  // SECTION TITLE
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: "Poppins-Bold",
  },

  // CARD UMUM
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  // QUOTE
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

  // MOOD TODAY CARD
  todayMoodCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  todayMoodEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  todayMoodText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    fontFamily: "Poppins-Bold",
  },
  todayMoodScore: {
    fontSize: 13,
    color: TEXT_SOFT,
    fontFamily: "Poppins-Regular",
  },

  // JOURNAL BUTTON
  journalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  journalButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_DARK,
    fontFamily: "Poppins-Medium",
  },

  // LIST JOURNAL
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  entryActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionEdit: {
    fontSize: 18,
  },
  actionDelete: {
    fontSize: 18,
  },

  dateText: {
    fontSize: 13,
    color: TEXT_SOFT,
    fontFamily: "Poppins-Regular",
  },
  moodBadge: {
    marginTop: 2,
    fontSize: 13,
    color: TEXT_DARK,
    fontFamily: "Poppins-Medium",
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 4,
    fontFamily: "Poppins-Bold",
  },
  entryBody: {
    fontSize: 14,
    color: TEXT_SOFT,
    fontFamily: "Poppins-Regular",
  },

  emptyText: {
    fontSize: 14,
    color: TEXT_SOFT,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
});
