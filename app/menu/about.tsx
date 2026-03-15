import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import ProfileArrow from "@/assets/icons/menu/profileArrow.svg";

import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface AboutItem {
  id: number;
  label: string;
  version?: string;
}

const About = () => {
  const router = useRouter();

  const aboutDatas: AboutItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "Məxfilik siyasəti",
      },
      {
        id: 2,
        label: "İstifadə şərtləri",
      },
      {
        id: 3,
        label: "Tətbiqi qiymətləndirin",
      },
      {
        id: 4,
        label: "Veb sayt",
      },
      {
        id: 5,
        label: "Tətbiq versiyası",
        version: "1.0.0",
      },
    ],
    [],
  );
  return (
    <SafeAreaView style={styles.about}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Haqqımızda</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.aboutCards}>
            {aboutDatas?.map((about) => (
              <View
                style={[styles.aboutCard, about.id === 1 && { marginTop: 0 }]}
                key={about.id}
              >
                <Text style={styles.aboutText}>{about.label}</Text>
                {about?.version ? (
                  <Text style={styles.versionText}>{about.version}</Text>
                ) : (
                  <TouchableOpacity>
                    <ProfileArrow />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  about: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },
  placeholder: {
    width: 40,
  },
  contentContainer: {
    padding: 16,
  },
  aboutCards: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 20,
  },
  aboutCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },

  aboutText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
  versionText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },
});
