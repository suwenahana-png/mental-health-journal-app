import React, { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const JOURNAL_KEY = "@journals";

export default function WriteJournal() {
  const [text, setText] = useState("");
  const navigation = useNavigation();

  const handleSave = async () => {
    console.log("SAVE PRESSED");

    if (!text.trim()) {
      Alert.alert("Journal is empty", "Please write something before saving.");
      return;
    }

    const firstLine = text.split("\n")[0];

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: firstLine || "Untitled Journal",
      body: text,
    };

    try {
      const json = await AsyncStorage.getItem(JOURNAL_KEY);
      const existing = json ? JSON.parse(json) : [];
      const updated = [newEntry, ...existing];

      await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));

      Alert.alert("Saved", "Your journal has been saved.");

      // pindah ke tab Home
      (navigation as any).navigate("Home");
      setText("");
    } catch (e) {
      console.log("Error saving journal", e);
      Alert.alert("Error", "Failed to save your journal.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Write Your Journal</Text>

      <TextInput
        style={styles.input}
        placeholder="How do you feel today?"
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Journal</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F1E4D3",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    height: 200,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
