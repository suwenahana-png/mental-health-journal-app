import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JOURNAL_KEY = "@journals";

export default function EditJournalScreen({ route, navigation }) {
  const { entry } = route.params;

  const [title, setTitle] = useState(entry.title);
  const [body, setBody] = useState(entry.body);

  const saveEdit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Peringatan", "Judul dan isi jurnal tidak boleh kosong.");
      return;
    }

    try {
      const json = await AsyncStorage.getItem(JOURNAL_KEY);
      let data = json ? JSON.parse(json) : [];

      // Update entry
      const updated = data.map((item) =>
        item.id === entry.id
          ? {
              ...item,
              title: title,
              body: body,
            }
          : item
      );

      await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));

      Alert.alert("Berhasil", "Jurnal berhasil diperbarui!");
      navigation.goBack();
    } catch (e) {
      console.log("Error saving edit:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Journal</Text>

        <Text style={styles.label}>Judul</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Tulis judul jurnal..."
        />

        <Text style={styles.label}>Isi Jurnal</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={body}
          onChangeText={setBody}
          placeholder="Tulis isi jurnal..."
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const BG = "#f5e3c9";
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
    marginBottom: 16,
    fontFamily: "Poppins-Bold",
  },
  label: {
    fontSize: 14,
    color: TEXT_SOFT,
    marginBottom: 6,
    fontFamily: "Poppins-Medium",
  },
  input: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: TEXT_DARK,
    fontFamily: "Poppins-Regular",
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#d8b58b",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: TEXT_DARK,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },
});
