// app/(menu)/faq.tsx
import DownArrow from "@/assets/icons/downArrow.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import UpArrow from "@/assets/icons/upArrow.svg";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Android üçün LayoutAnimation enable
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// constants/FaqData.ts
export interface FaqItem {
  id: number;
  label: string;
  desc: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 1,
    label: "Azirrigation nədir və mənə nə üçün lazımdır?",
    desc: "Azirrigation sahədəki klapanları, sensorları və suvarma vaxtlarını telefonunuzdan idarə etməyə kömək edən ağıllı suvarma sistemidir. Suya qənaət edir, bitkilərin qurumasının qarşısını alır və hava şəraitinə uyğun avtomatik suvarma imkanı verir.",
  },
  {
    id: 2,
    label: "Sub cihaz nədir və nə vaxt əlavə etməliyəm?",
    desc: "Sub cihaz əsas kontrollerdən asılı olaraq işləyən əlavə idarəetmə vahididir. Geniş ərazilərdə və ya fərqli sahələrdə müstəqil suvarma planı tətbiq etmək istədikdə əlavə edilməlidir.",
  },
  {
    id: 3,
    label: "Rütubət sensoru nəyi ölçür və necə kömək edir?",
    desc: "Rütubət sensoru torpağın nəmlik səviyyəsini ölçür və lazım olduqda suvarmanı avtomatik aktivləşdirir. Bu, həddindən artıq suvarmanın qarşısını alır və su istehlakını optimallaşdırır.",
  },
  {
    id: 4,
    label: "Hovuzda su bitəndə sistem necə davranır?",
    desc: "Su səviyyəsi sensorları hovuzda su bitdiyini aşkar etdikdə sistem avtomatik olaraq dayanır və sizə bildiriş göndərir. Bu, sistemin quru vəziyyətdə işləməsinin qarşısını alır.",
  },
  {
    id: 5,
    label: "Su axını və təzyiq sensoru hansı halda bildiriş göndərir?",
    desc: "Boru partladıqda, sızıntı olduqda və ya normal təzyiq səviyyəsindən kənara çıxdıqda sensor dərhal bildiriş göndərir və zəruri hallarda suvarmanı dayandırır.",
  },
  {
    id: 6,
    label: "Ağıllı suvarma nədir və nəyə görə aktiv etməliyəm?",
    desc: "Ağıllı suvarma hava məlumatlarına, torpaq rütubətinə və bitki növünə əsasən optimal suvarma planı tərtib edir. Bu xüsusiyyət 30%-ə qədər su qənaəti təmin edir.",
  },
  {
    id: 7,
    label: "AI köməkçi mənə nədə kömək edə bilər?",
    desc: "AI köməkçi suvarma planınızı optimallaşdırmaq, problemləri aradan qaldırmaq və bitki sağlamlığı barədə məsləhətlər vermək üçün süni intellektdən istifadə edir.",
  },
];

export default function FaqScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelected = (id: number) => {
    // Smooth animasiya
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelected(selected === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tez-tez verilən suallar</Text>
          <View style={styles.placeholder} />
        </View>

        {/* FAQ List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent} // ⬅️ Bu əlavə olundu
          showsVerticalScrollIndicator={false}
        >
          {FAQ_DATA.map((faq) => {
            const isOpen = selected === faq.id;

            return (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.labelContainer}
                  onPress={() => handleSelected(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.labelText}>{faq.label}</Text>
                  <View style={styles.arrowBtn}>
                    {isOpen ? (
                      <UpArrow width={16} height={16} />
                    ) : (
                      <DownArrow width={16} height={16} />
                    )}
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.descContainer}>
                    <Text style={styles.descText}>{faq.desc}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  innerContainer: {
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
    paddingRight: 12,
    lineHeight: 22,
  },
  arrowBtn: {
    padding: 4,
  },
  descContainer: {
    marginTop: 12,
    paddingTop: 12,
  },
  descText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 22,
  },
});
