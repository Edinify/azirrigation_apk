import AppleIcon from "@/assets/icons/login_register/apple.svg";
import GoogleIcon from "@/assets/icons/login_register/google.svg";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAddButton from "../customComponents/CustomButton/CustomAddButton";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRegister: () => void;
  onLogin: () => void;
  onGoogle: () => void;
  onApple: () => void;
};

export default function AuthBottomSheet({
  visible,
  onClose,
  onRegister,
  onLogin,
  onGoogle,
  onApple,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.handle} />

          <Text style={styles.title}>Azirrigation-a qoşulun</Text>
          <Text style={styles.subtitle}>
            Tətbiqdən istifadə etmək üçün qeydiyyatdan keçin və ya mövcud
            hesabınızla daxil olun.
          </Text>

          {/* Register */}

          <CustomAddButton
            text="Qeydiyyatdan keç"
            size="l"
            onClick={onRegister}
          />

          {/* Login */}
          <View style={{ marginVertical: 12 }}>
            <CustomAddButton
              text="Artıq hesabım var"
              size="l"
              onClick={onLogin}
              type="secondary"
            />
          </View>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            {Platform.OS === "ios" ? (
              <View>
                <TouchableOpacity style={styles.socialBtn} onPress={onApple}>
                  <AppleIcon width={24} height={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} onPress={onGoogle}>
                  <GoogleIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.socialBtn, styles.googleContext]}
                onPress={onGoogle}
              >
                <GoogleIcon width={24} height={24} />
                <Text style={styles.googleText}>Google ilə giriş et</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.footer}>
            Qeydiyyatdan keçməklə, <Text style={styles.link}>Şərtlərlə</Text>{" "}
            razılaşmış olursunuz.
          </Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: "#0069FE",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryBtn: {
    backgroundColor: "#eef1f4",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: {
    fontWeight: "500",
    color: "#0E121B",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  socialBtn: {
    borderRadius: 16,
    backgroundColor: "#eef1f4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleContext: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
  },
  googleText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 500,
    color: "#0E121B",
  },
  footer: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 12,
  },
  link: {
    color: "#0B63F6",
  },
});
