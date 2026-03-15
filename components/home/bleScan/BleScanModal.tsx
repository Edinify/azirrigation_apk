import LoadingIcon from "@/assets/icons/home/permission/Loading-circle.svg";
import ErrorIcon from "@/assets/icons/home/permission/radar-line.svg";
import SuccessIcon from "@/assets/icons/home/permission/Success.svg";
import { scanForDevice } from "@/utils/deviceUtils";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  qrCode: string;
  onCancel: () => void;
  onManualOpen: () => void;
}

export default function BleScanModal({
  visible,
  qrCode,
  onCancel,
  onManualOpen,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const isScanning = useRef(false);

  useEffect(() => {
    if (!visible) {
      isScanning.current = false; // ✅ modal bağlananda reset et
      return;
    }
    setState("pending");
    startScan();
  }, [visible]);

  const startScan = async () => {
    if (isScanning.current) return; // ✅ artıq scan gedirsə çıx
    isScanning.current = true;

    const rawCode = qrCode.replace(/-/g, "");
    const result = await scanForDevice(rawCode);

    if (!isScanning.current) return; // ✅ modal bağlanıbsa nəticəni ignore et

    if (result.found && result.deviceId) {
      setState("success");
      setTimeout(() => {
        router.push({
          pathname: "/home/addDevice",
          params: { deviceId: result.deviceId },
        });
      }, 1500);
    } else {
      setState("error");
    }

    isScanning.current = false;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay}>
        <View style={styles.container}>
          {state === "pending" && (
            <>
              <Text style={styles.title}>Cihaz axtarılır</Text>
              <Text style={styles.subtitle}>
                Telefonu cihazın yaxınlığında saxlayın
              </Text>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <LoadingIcon />
              </View>
            </>
          )}

          {state === "success" && (
            <>
              <Text style={styles.title}>Cihaz tapıldı</Text>
              <Text style={styles.subtitle}>Quraşdırmaya başlayırıq…</Text>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <SuccessIcon />
              </View>
            </>
          )}

          {state === "error" && (
            <>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ErrorIcon />
              </View>
              <Text style={styles.title}>Cihaz tapılmadı</Text>
              <Text style={styles.subtitle}>
                Bluetooth açıqdır və cihaz yaxındadır?
              </Text>
              <TouchableOpacity style={styles.retryBtn} onPress={startScan}>
                <Text style={styles.retryText}>Yenidən cəhd et</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.manualBtn} onPress={onManualOpen}>
                <Text style={styles.manualText}>Kodu əl ilə daxil et</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

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
    paddingTop: 20,
    paddingBottom: 40,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    textAlign: "center",
  },

  inputContainer: {
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    backgroundColor: "#EEF2F6",
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
    height: 54,
    width: 300,
  },

  enterCodeText: {
    textAlign: "center",
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
  },

  btnContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  sendBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  sendBtnDisabled: {
    backgroundColor: "#A0A8B0",
    opacity: 0.6,
  },

  sendBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: 500,
  },

  openQrBtn: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  openQrText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },

  loadingContainer: {
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  retryBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 24,
  },
  retryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  manualBtn: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 12,
  },
  manualText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "500",
  },
});
