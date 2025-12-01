import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import QuotesScreen from "./screens/QuotesScreen";
import WriteJournal from "./screens/JournalScreen";
import LoginScreen from "./screens/LoginScreen";
import EditJournalScreen from "./screens/EditJournalScreen";   // ← DITAMBAHKAN
import { Text } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F1E4D3",
          height: 70,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 7 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />

      <Tab.Screen
        name="Journal"
        component={WriteJournal}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📓</Text>,
        }}
      />

      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💬</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Halaman depan / login */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Halaman utama berisi Tab */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* 🔥 Halaman edit jurnal */}
        <Stack.Screen
          name="EditJournal"
          component={EditJournalScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
