import { GuideItem, GuideSection } from "@/app/menu/guide";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface GuideModalProps {
  visible: boolean;
  onClose: () => void;
  guideData: GuideItem | null; // null əlavə et
}

export const GuideModal = ({
  visible,
  onClose,
  guideData,
}: GuideModalProps) => {
  if (!guideData || !guideData.modalContent) return null; // Əlavə yoxlama

  const renderContent = (section: GuideSection) => {
    switch (section.type) {
      case "bullet-list":
        return (
          <View style={styles.listContainer}>
            {section?.contentHeader && (
              <Text style={{ color: "#0E121B", fontSize: 14, fontWeight: 400 }}>
                {section.contentHeader}
              </Text>
            )}

            {section.content.map((item, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
            {section?.aboutContent && (
              <Text style={{ marginTop: 10 }}>{section.aboutContent}</Text>
            )}
            {section.footer && (
              <View style={{ marginTop: 12 }}>{section.footer}</View>
            )}
          </View>
        );

      case "numbered-list":
        return (
          <View style={styles.listContainer}>
            {section.content.map((item, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.number}>{index + 1}.</Text>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        );

      case "paragraph":
      default:
        return (
          <View style={styles.listContainer}>
            {section.content.map((text, index) => (
              <Text key={index} style={styles.text}>
                {text}
              </Text>
            ))}
            {section?.aboutContent && (
              <Text style={{ marginTop: 10 }}>{section.aboutContent}</Text>
            )}
            {section.footer && (
              <View style={{ marginTop: 12 }}>{section.footer}</View>
            )}
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {guideData.modalContent.title}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Əgər description varsa göstər */}
          {guideData.modalContent.desc && (
            <Text style={styles.description}>
              {guideData.modalContent.desc}
            </Text>
          )}
          {guideData.subDesc && (
            <View style={styles.subDescContainer}>
              <Text style={styles.subDescHeader}>
                {guideData.subDesc.header}
              </Text>
              <View style={{ marginTop: 8 }}>
                {guideData.subDesc.content.map((item, index) => (
                  <View key={index} style={styles.bulletItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {guideData.modalContent.sections.map((section, index) => (
            <View
              key={index}
              style={[styles.section, index === 1 && { marginTop: 28 }]}
            >
              {section.subtitle && (
                <Text style={styles.subtitle}>{section.subtitle}</Text>
              )}

              <Image style={styles.image} source={section.image} />

              {renderContent(section)}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: "#0E121B",
    lineHeight: 18,
  },
  section: {
    marginTop: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    color: "#0E121B",
    lineHeight: 22,
  },
  listContainer: {
    marginTop: 20,
  },
  bulletItem: {
    flexDirection: "row",
    // marginBottom: 8,
    // paddingRight: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#0E121B",
    marginRight: 8,
    marginTop: 2,
  },
  number: {
    fontSize: 14,
    fontWeight: 400,
    color: "#0E121B",
    marginRight: 8,
    minWidth: 20,
  },
  listText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#0E121B",
    lineHeight: 22,
    flex: 1,
  },
  imagesWrapper: {
    marginTop: 12,
    // gap: 12,
    flexDirection: "row",
    // backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 24,
    // paddingHorizontal: 36,
  },
  image: {
    height: 300,
    width: "100%",
  },

  subDescContainer: {
    marginTop: 28,
  },
  subDescHeader: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
});
