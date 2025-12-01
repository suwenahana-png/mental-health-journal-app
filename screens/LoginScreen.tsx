// screens/LoginScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BG = "#f5e3c9";
const TEXT_DARK = "#3b3024";
const TEXT_SOFT = "#7c6750";

export default function LoginScreen({ navigation }) {
  const handleStart = () => {
    // ganti ke stack "MainTabs" dan hapus history login
    navigation.replace("MainTabs");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/icons/image.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Judul */}
      <Text style={styles.title}>Mental Health Journal</Text>
      <Text style={styles.subtitle}>
        Tempat aman untuk menuliskan perasaanmu dan melatih kesehatan mental
        setiap hari.
      </Text>

      {/* Tombol mulai / login */}
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Mulai Sekarang</Text>
      </TouchableOpacity>

      {/* Bisa tambahin teks kecil di bawah */}
      <Text style={styles.smallText}>
        Dengan melanjutkan, kamu setuju untuk menjaga dirimu sendiri dengan
        penuh kasih. 💛
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
title: {
  fontSize: 24,
  fontWeight: "700",
  color: TEXT_DARK,
  textAlign: "center",
  marginBottom: 8,
  fontFamily: "Poppins-Bold",
},
subtitle: {
  fontSize: 14,
  color: TEXT_SOFT,
  textAlign: "center",
  marginBottom: 32,
  fontFamily: "Poppins-Regular",
},
buttonText: {
  color: "white",
  fontWeight: "700",
  fontSize: 16,
  fontFamily: "Poppins-Medium",
},
smallText: {
  fontSize: 12,
  color: TEXT_SOFT,
  textAlign: "center",
  marginTop: 8,
  fontFamily: "Poppins-Regular",
},

});
