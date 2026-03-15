import ValveImg from "@/assets/icons/home/add-device/Plata - Valve.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ValveProps {
  visible: boolean;
  onClose: () => void;
}

const AboutValvePort = ({ visible, onClose }: ValveProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconContainer}
            >
              <CloseIcon width={20} height={20} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Valve portu nədir?</Text>
          </View>
          <View style={styles.imgContainer}>
            <ValveImg />
          </View>
          <View style={styles.descContainer}>
            <Text style={styles.descText}>
              Valve portları platada terminal blok üzərində “Valve 1, Valve 2…”
              kimi işarələnir. Hər port bir klapanı idarə edir. Klapanın kabeli
              platada hansı porta bağlanıbsa, sistemin düzgün işləməsi üçün
              burada da həmin port seçilməlidir.
            </Text>
          </View>
          <View style={styles.checkContainer}>
            <Text style={styles.howText}>Necə yoxlayım?</Text>
            <View style={styles.list}>
              <Text>
                1. Platada Valve 1/2/3... yazılan portlar olan hissəni tapın
              </Text>
              <Text>2. Kabelin qoşulduğu “Valve” nömrəsini oxuyun</Text>
              <Text>3. Tətbiqdə eyni Valve X portunu seçin</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AboutValvePort;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 6,
    borderRadius: 100,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    position: "relative",
  },
  closeIconContainer: {
    position: "absolute",
    right: 5,
    top: -20,
    padding: 5,
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 24,
    fontWeight: 600,
    color: "#0E121B",
    textAlign: "center",
    marginTop: 10,
  },

  descContainer: {
    marginVertical: 24,
  },
  descText: {
    color: "#0E121B",
    fontSize: 14,
    fontWeight: 400,
  },

  imgContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  howText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 600,
  },

  list: {
    marginTop: 8,
  },
});
