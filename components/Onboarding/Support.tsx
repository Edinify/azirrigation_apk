import FacebookIcon from "@/assets/icons/support/facebook.svg";
import InstagramIcon from "@/assets/icons/support/instagram.svg";
import MailIcon from "@/assets/icons/support/mail.svg";
import PhoneIcon from "@/assets/icons/support/phone.svg";
import TiktokIcon from "@/assets/icons/support/tiktok.svg";
import React from "react";
import {
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SupportModal({ visible, onClose }: SupportModalProps) {
  const supports = [
    {
      id: 1,
      label: "+994 55 806 76 69",
      SupportComponent: PhoneIcon,
    },
    {
      id: 2,
      label: "+994 55 808 40 84",
      SupportComponent: PhoneIcon,
    },
    {
      id: 3,
      label: "+994 55 808 40 84",
      SupportComponent: MailIcon,
    },
  ];

  const openSocial = async (appUrl: string, webUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(appUrl);
      await Linking.openURL(supported ? appUrl : webUrl);
    } catch (err) {
      console.log("Link açıla bilmədi", err);
      await Linking.openURL(webUrl);
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;

    const isAtTop = contentOffset.y <= 0;
    const isScrollable = contentSize.height > layoutMeasurement.height;

    if (isAtTop && isScrollable && contentOffset.y < -80) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.dragIndicator} />
          <ScrollView
            bounces
            showsVerticalScrollIndicator={false}
            onScrollEndDrag={handleScrollEnd}
          >
            <View style={styles.supportList}>
              <Text style={styles.headerText}>Dəstək</Text>
              {supports?.map((support) => {
                const SupportComponent = support.SupportComponent;
                return (
                  <View key={support.id} style={styles.supportCard}>
                    <SupportComponent width={28} height={28} />
                    <Text style={styles.supportText}>{support.label}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.socialContainer}>
              <Text style={styles.socialText}>Sosial media hesablarımız</Text>
              <View style={styles.socialCards}>
                <TouchableOpacity
                  style={styles.socialCard}
                  onPress={() =>
                    openSocial(
                      "instagram://user?username=az_irrigation",
                      "https://www.instagram.com/az_irrigation/",
                    )
                  }
                >
                  <InstagramIcon width={24} height={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialCard}
                  onPress={() =>
                    openSocial(
                      "fb://profile/61555250230399",
                      "https://www.facebook.com/profile.php?id=61555250230399",
                    )
                  }
                >
                  <FacebookIcon width={24} height={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialCard}
                  onPress={() =>
                    openSocial(
                      "snssdk1233://user/profile/azirrigation",
                      "https://www.tiktok.com/@azirrigation",
                    )
                  }
                >
                  <TiktokIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D1D6",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  supportList: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 600,
  },
  supportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  supportText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 400,
    marginLeft: 12,
  },
  socialContainer: {},

  socialText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },
  socialCards: {
    marginTop: 8,
    flexDirection: "row",
  },

  socialCard: {
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    padding: 12,
  },

  closeButton: {
    backgroundColor: "#E4E7EC",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
});
