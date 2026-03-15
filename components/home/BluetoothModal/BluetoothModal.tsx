// components/home/BluetoothModal/BluetoothModal.tsx
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const BluetoothModal = ({ visible, onClose }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <CloseIcon width={20} height={20} />
          </TouchableOpacity>

          <Text style={styles.title}>Bluetooth-u açın</Text>
          <Text style={styles.subtitle}>
            QR kod oxundu. Cihaza qoşulmaq üçün telefon ekranını yuxarıdan aşağı
            çəkin və açılan paneldən Bluetooth-u açın.
          </Text>

          {/* <Image source={BluetoothImage} style={styles.image} resizeMode="contain" /> */}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default BluetoothModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 24,
    top: 24,
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0E121B",
    marginTop: 16,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#717784",
    textAlign: "center",
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 24,
  },
});
