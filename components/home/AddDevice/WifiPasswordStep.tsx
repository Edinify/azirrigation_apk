import EyeIcon from "@/assets/icons/login_register/eye-line.svg";
import EyeSlashIcon from "@/assets/icons/login_register/eye-slash-line.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";

interface WifiPasswordStepProps {
  networkName: string;
  onNext: () => void;
  onBack: () => void;
  connectedDevice?: Device | null;
  mockMode?: boolean;
}

const WifiPasswordStep = ({
  networkName,
  onNext,
  onBack,
  connectedDevice,
  mockMode = false,
}: WifiPasswordStepProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sendWifiCredentials = async () => {
    if (!password.trim()) {
      setErrorMsg("Wi-Fi şifrəsini daxil edin");
      return;
    }

    if (mockMode) {
      console.log("📡 Mock: Sending Wi-Fi credentials");
      setIsSending(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccess = Math.random() > 0.2;
      setIsSending(false);

      if (isSuccess) {
        setPassword("");
        onNext();
      } else {
        setErrorMsg("Bağlantı uğursuz oldu. Şifrəni yoxlayın.");
      }
      return;
    }

    if (!connectedDevice) {
      setErrorMsg("Cihaz qoşulu deyil");
      return;
    }

    try {
      setIsSending(true);

      const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
      const UART_RX_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

      // ✅ JSON format (SSID + Password birlikdə)
      const wifiData = JSON.stringify({
        ssid: networkName,
        password: password,
        security: "WPA2/WPA3", // Default security
      });

      const dataBase64 = btoa(wifiData);
      await connectedDevice.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_RX_UUID,
        dataBase64,
      );

      console.log("✅ Wi-Fi credentials sent successfully");

      setIsSending(false);
      setPassword("");
      onNext();
    } catch (err) {
      console.error("❌ Wi-Fi send error:", err);
      setIsSending(false);
      setErrorMsg("Wi-Fi məlumatları göndərilmədi. Yenidən cəhd edin.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity onPress={onBack} style={styles.closeIconContainer}>
        <CloseIcon />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Wi-Fi şifrəsini daxil edin</Text>
        <Text style={styles.subtitle}>{networkName}</Text>
      </View>

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Şifrə"
          placeholderTextColor="#A0A8B0"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errorMsg) setErrorMsg("");
          }}
          autoFocus
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.primaryBtn,
          (!password || isSending) && styles.primaryBtnDisabled,
        ]}
        disabled={!password || isSending}
        onPress={sendWifiCredentials}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.primaryBtnText}>Bağlan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default WifiPasswordStep;

const styles = StyleSheet.create({
  container: {
    paddingTop: 36,
    paddingBottom: 24,
  },
  closeIconContainer: {
    position: "absolute",
    right: 5,
    top: -10,
    padding: 5,
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    marginTop: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#0E121B",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    height: 54,
    fontSize: 16,
    color: "#0E121B",
  },
  eyeBtn: {
    padding: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  primaryBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
