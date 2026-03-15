import CheckIcon from "@/assets/icons/home/add-device/check-line.svg";
import EyeIcon from "@/assets/icons/login_register/eye-line.svg";
import EyeSlashIcon from "@/assets/icons/login_register/eye-slash-line.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SecurityType = "WEP" | "WPA" | "WPA2/WPA3" | "WPA3" | "Heç biri";

interface HideWifiProps {
  visible: boolean;
  onClose: () => void;
  onConnect: (ssid: string, security: SecurityType, password: string) => void;
}

const SECURITY_OPTIONS: SecurityType[] = [
  "WEP",
  "WPA",
  "WPA2/WPA3",
  "WPA3",
  "Heç biri",
];

const HideWifi = ({ visible, onClose, onConnect }: HideWifiProps) => {
  const [ssid, setSsid] = useState("");
  const [security, setSecurity] = useState<SecurityType>("WPA2/WPA3");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const handleConnect = () => {
    if (ssid && (security === "Heç biri" || password)) {
      onConnect(ssid, security, password);
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setSsid("");
    setSecurity("WPA2/WPA3");
    setPassword("");
    setShowPassword(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const needsPassword = security !== "Heç biri";

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <Pressable style={styles.overlay} onPress={handleClose}>
            <Pressable
              style={styles.container}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.handle} />
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeIconContainer}
                >
                  <CloseIcon width={20} height={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.headerContent}>
                <Text style={styles.titleText}>Şəbəkəni əl ilə əlavə et</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={ssid}
                    onChangeText={setSsid}
                    placeholder="Şəbəkənin adı"
                    placeholderTextColor="#717784"
                  />
                </View>

                {/* Security Type */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Təhlükəsizlik növü</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setShowSecurityModal(true)}
                  >
                    <Text style={styles.selectText}>{security}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                </View>

                {needsPassword && (
                  <View style={styles.inputWrapper}>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Şifrə"
                        placeholderTextColor="#717784"
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={styles.eyeIcon}>
                          {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Connect Button */}
              <TouchableOpacity
                style={[
                  styles.connectBtn,
                  (!ssid || (needsPassword && !password)) &&
                    styles.connectBtnDisabled,
                ]}
                disabled={!ssid || (needsPassword && !password)}
                onPress={handleConnect}
              >
                <Text style={styles.connectBtnText}>Bağlan</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showSecurityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSecurityModal(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowSecurityModal(false)}
        >
          <Pressable
            style={styles.securityContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.securityHeader}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setShowSecurityModal(false)}
              >
                <BackIcon width={20} height={20} />
              </TouchableOpacity>
              <Text style={styles.securityTitle}>Təhlükəsizlik növü</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowSecurityModal(false)}
              >
                <CloseIcon width={20} height={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {SECURITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.securityOption}
                  onPress={() => {
                    setSecurity(option);
                    setShowSecurityModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.securityOptionText,
                      security === option && styles.securityOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {security === option && <CheckIcon />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default HideWifi;

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
    width: 40,
    height: 4,
    borderRadius: 2,
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
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 32,
  },
  titleText: {
    color: "#0E121B",
    fontSize: 24,
    fontWeight: "600",
  },

  // Form
  formContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  inputWrapper: {
    gap: 8,
    marginTop: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#717784",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0E121B",
  },
  selectInput: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: "#0E121B",
  },
  chevron: {
    fontSize: 24,
    color: "#A0A8B0",
  },
  passwordContainer: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: "#0E121B",
    paddingVertical: 10,
  },
  eyeBtn: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },

  // Connect Button
  connectBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  connectBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  connectBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Security Modal
  securityContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  securityOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  securityOptionText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#0E121B",
  },
  securityOptionTextSelected: {
    color: "#0069FE",
    fontWeight: "500",
  },
  checkmark: {
    fontSize: 18,
    color: "#0069FE",
    fontWeight: "700",
  },
});
