// screens/JournalScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const JOURNAL_KEY = "@journals";

// ❓ Pertanyaan mood (skala 1–5)
const MOOD_QUESTIONS = [
  { id: "energy", text: "Seberapa berenergi kamu hari ini?" },
  { id: "anxiety", text: "Seberapa tidak cemas kamu hari ini?" },
  { id: "happiness", text: "Seberapa bahagia kamu hari ini?" },
];

export default function WriteJournal() {
  const [title, setTitle] = useState("");  // ⬅ input judul
  const [body, setBody] = useState("");   // ⬅ input isi cerita
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const navigation = useNavigation();

  const calculateMood = () => {
    const vals = Object.values(answers);
    if (vals.length !== MOOD_QUESTIONS.length) {
      return { mood: null as string | null, score: null as number | null };
    }

    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / vals.length;

    let moodLabel = "Netral";
    if (avg >= 4) moodLabel = "Baik";
    else if (avg < 3) moodLabel = "Kurang Baik";

    return { mood: moodLabel, score: avg };
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Judul kosong", "Masukkan judul jurnal.");
      return;
    }

    if (!body.trim()) {
      Alert.alert("Isi jurnal kosong", "Tulis sedikit cerita hari ini.");
      return;
    }

    const answeredAll =
      Object.keys(answers).length === MOOD_QUESTIONS.length;
    if (!answeredAll) {
      Alert.alert("Lengkapi mood tracker", "Jawab semua pertanyaan mood dulu ya 🙂");
      return;
    }

    const { mood, score } = calculateMood();

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title,
      body,
      mood,
      moodScore: score,
    };

    try {
      const json = await AsyncStorage.getItem(JOURNAL_KEY);
      const existing = json ? JSON.parse(json) : [];
      const updated = [newEntry, ...existing];

      await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));

      Alert.alert("Saved", "Your journal has been saved.");

      // kembali ke Home
      (navigation as any).navigate("Home");

      setTitle("");
      setBody("");
      setAnswers({});
    } catch (e) {
      console.log("Error saving journal", e);
      Alert.alert("Error", "Failed to save your journal.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Write Your Journal</Text>

        {/* INPUT JUDUL */}
        <Text style={styles.label}>Judul</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan judul jurnal..."
          value={title}
          onChangeText={setTitle}
        />

        {/* PERTANYAAN MOOD */}
        <Text style={styles.moodSectionTitle}>Mood Tracker</Text>
        {MOOD_QUESTIONS.map((q) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>{q.text}</Text>
            <View style={styles.scaleRow}>
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = answers[q.id] === value;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.scaleItem,
                      isActive && styles.scaleItemActive,
                    ]}
                    onPress={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: value }))
                    }
                  >
                    <Text
                      style={[
                        styles.scaleItemText,
                        isActive && styles.scaleItemTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* INPUT CERITA */}
        <Text style={styles.label}>Ceritakan harimu</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tulis cerita hari ini..."
          value={body}
          onChangeText={setBody}
          multiline
        />

        {/* SIMPAN */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Journal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const BG = "#F1E4D3";
const CARD = "#fff";
const TEXT_DARK = "#3b3024";
const TEXT_SOFT = "#7c6750";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BG,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "Poppins-Bold",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: TEXT_SOFT,
    fontFamily: "Poppins-Medium",
  },
  input: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  textArea: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 15,
    height: 160,
    textAlignVertical: "top",
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
  },

  // mood tracker
  moodSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: TEXT_DARK,
    fontFamily: "Poppins-Bold",
  },
  questionBlock: {
    marginBottom: 12,
  },
  questionText: {
    fontSize: 14,
    marginBottom: 6,
    color: TEXT_SOFT,
    fontFamily: "Poppins-Medium",
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleItem: {
    width: 40,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccb8a0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fdf7ef",
  },
  scaleItemActive: {
    backgroundColor: "#d8b58b",
    borderColor: "#3b3024",
  },
  scaleItemText: {
    fontSize: 14,
    color: TEXT_SOFT,
  },
  scaleItemTextActive: {
    color: TEXT_DARK,
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#d8b58b",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 50,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Poppins-Medium",
  },
});
