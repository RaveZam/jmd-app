import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.replace("/auth/sign-in");
    } catch (err) {
      Alert.alert("Sign out failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ThemedView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={20}
              color={Colors.light.text}
            />
          </TouchableOpacity>
          <ThemedText
            type="defaultSemiBold"
            style={styles.title}
            lightColor={Colors.light.text}
            darkColor={Colors.light.text}
          >
            Settings
          </ThemedText>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <ThemedText style={styles.sectionNote}>
            Manage your account and sign out when you're finished using the app.
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.signOut}
          activeOpacity={0.8}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signOutText}>Sign out</Text>
          )}
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    backgroundColor: Colors.light.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 6,
  },
  sectionNote: {
    color: "#64748B",
  },
  signOut: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  signOutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
