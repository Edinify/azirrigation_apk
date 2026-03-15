// app/(auth)/onboarding.tsx
import Logo from "@/assets/icons/AppIcon.svg";
import CountryIcon from "@/assets/icons/country.svg";
import DownArrow from "@/assets/icons/downArrow.svg";
import Icon1 from "@/assets/icons/support/icon1.svg";
import Icon2 from "@/assets/icons/support/icon2.svg";
import Icon3 from "@/assets/icons/support/icon3.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthBottomSheet from "../../components/Onboarding/AuthBottom";
import LanguageModal from "../../components/Onboarding/Language";
import SupportModal from "../../components/Onboarding/Support";

export default function OnboardingScreen() {
  const router = useRouter();
  const [country, setCountry] = useState("AZE");
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [openSupportModal, setOpenSupportModal] = useState(false);
  const [openAuthBottomModal, setOpenAuthBottomModal] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    setCountry(languageCode);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.country}
          onPress={() => setOpenLanguageModal(true)}
        >
          <CountryIcon width={18} height={18} fill="none" />
          <Text style={styles.countryText}>{country}</Text>
          <DownArrow width={16} height={8} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setOpenSupportModal(true)}>
          <Text style={styles.supportText}>Dəstək</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo və Başlıq */}
        <View style={styles.logoSection}>
          <Logo width={160} height={160} />
          <Text style={styles.title}>
            Hər damlanı istənilən yerdən idarə et
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.features}>
          {/* Feature 1 */}
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Icon1 width={44} height={44} />
            </View>
            <Text style={styles.featureText}>
              Vaxt, hava və rütubətə görə qaydalar qurun, suvarma özü başlasın
            </Text>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Icon2 width={44} height={44} />
            </View>
            <Text style={styles.featureText}>
              Sahələrdəki klapan və sensorları real vaxtda görün
            </Text>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Icon3 width={44} height={44} />
            </View>
            <Text style={styles.featureText}>
              Su bitəndə, təzyiq normadan kənara çıxanda dərhal bildiriş alın
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomAddButton
          text="Başla"
          onClick={() => setOpenAuthBottomModal(true)}
          size="l"
        />
        {/* <TouchableOpacity
          style={styles.startButton}
          onPress={() => setOpenAuthBottomModal(true)}
        >
          <Text style={styles.startButtonText}>Başla</Text>
        </TouchableOpacity> */}
      </View>

      {/* Modals */}
      {openLanguageModal && (
        <LanguageModal
          visible={openLanguageModal}
          onClose={() => setOpenLanguageModal(false)}
          onSelect={handleLanguageSelect}
          selectedLanguage={country}
        />
      )}
      {openSupportModal && (
        <SupportModal
          visible={openSupportModal}
          onClose={() => setOpenSupportModal(false)}
        />
      )}
      {openAuthBottomModal && (
        <AuthBottomSheet
          visible={openAuthBottomModal}
          onClose={() => setOpenAuthBottomModal(false)}
          onRegister={() =>
            router.push({
              pathname: "/auth/phoneInput",
              params: { type: "register" },
            })
          }
          onLogin={() =>
            router.push({
              pathname: "/auth/login",
              params: { type: "register" },
            })
          }
          onGoogle={() => console.log("google")}
          onApple={() => console.log("apple")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  countryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0E121B",
  },
  supportText: {
    fontSize: 16,
    color: "#0069FE",
    fontWeight: "500",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 60,
  },
  title: {
    marginTop: 24,
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
    lineHeight: 32,
    paddingHorizontal: 20,
  },
  features: {
    gap: 20,
    paddingBottom: 100, // Space for button
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#0E121B",
    fontWeight: "400",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F5F7FA",
  },
  startButton: {
    backgroundColor: "#0069FE",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0069FE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
