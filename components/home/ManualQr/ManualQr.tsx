import LoadingIcon from "@/assets/icons/home/permission/Loading-circle.svg";
import ErrorIcon from "@/assets/icons/home/permission/radar-line.svg";
import SuccessIcon from "@/assets/icons/home/permission/Success.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import { getBleManager } from "@/utils/bleManeger";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import BluetoothModal from "../BluetoothModal/BluetoothModal";

interface ManualQrProps {
  visible: boolean;
  onCancel: () => void;
  openQrScanner: () => void;
  initialValue?: string;
  onOpenBleScan: (code: string) => void;
}

const ManualQr = ({
  visible,
  onCancel,
  openQrScanner,
  initialValue,
  onOpenBleScan,
}: ManualQrProps) => {
  const [value, setValue] = useState<string>("");
  const [submitState, setSubmitState] = useState("idle");
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  useEffect(() => {
    if (visible) {
      const formattedValue = initialValue ? formatCode(initialValue) : "";
      console.log("📝 Setting initial value:", formattedValue);
      setValue(formattedValue);
      setSubmitState("idle");
    }
  }, [visible, initialValue]);

  useEffect(() => {
    if (!visible) {
      setSubmitState("idle");
      setValue("");
    }
  }, [visible]);

  const formatCode = (text: string) => {
    // tireləri sil, 9 simvola qədər götür
    const clean = text.replace(/-/g, "").slice(0, 9);

    const part1 = clean.slice(0, 4);
    const part2 = clean.slice(4, 7);
    const part3 = clean.slice(7, 9);

    if (clean.length <= 4) return part1;
    if (clean.length <= 7) return `${part1}-${part2}`;
    return `${part1}-${part2}-${part3}`;
  };

  const handleSubmit = async () => {
    const rawValue = value.replace(/-/g, "").trim();
    if (rawValue.length !== 9) return;

    const bleManager = getBleManager();
    const state = await bleManager.state();

    if (state !== "PoweredOn") {
      setShowBluetoothModal(true);
      return;
    }

    onCancel();
    onOpenBleScan(rawValue);
  };

  const handleReset = () => {
    setValue("");
    setSubmitState("idle");
  };

  const handleClose = () => {
    setValue("");
    setSubmitState("idle");
    onCancel();
  };

  const renderContent = () => {
    if (submitState === "pending") {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.title}>Cihaz qoşulur</Text>
          <Text style={styles.subtitle}>
            Telefonu cihazın yaxınlığında saxlayın və cihazın açıq olduğuna əmin
            olun.
          </Text>
          <View style={styles.loadingContainer}>
            <LoadingIcon />
          </View>
        </View>
      );
    }

    if (submitState === "error") {
      return (
        <View style={styles.stateContainer}>
          <View style={styles.loadingContainer}>
            <ErrorIcon />
          </View>
          <Text style={styles.title}>Cihaz qoşulmadı</Text>
          <Text style={styles.subtitle}>
            Zəhmət olmasa bunları yoxlayın: cihaz açıqdır, telefon yaxındadır,
            Bluetooth açıqdır. Sonra yenidən cəhd edin.
          </Text>
          <TouchableOpacity
            style={[styles.sendBtn, { marginTop: 40 }]}
            onPress={handleReset}
          >
            <Text style={styles.sendBtnText}>Yenidən yoxla</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (submitState === "success") {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.title}>Cihaz qoşuldu</Text>
          <Text style={styles.subtitle}>Quraşdırmaya başlayırıq…</Text>
          <View style={styles.loadingContainer}>
            <SuccessIcon />
          </View>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.title}>Cihaz kodunu daxil edin</Text>
        <Text style={styles.subtitle}>
          QR kod oxunmadısa, cihazın üzərində yazılan kodu buraya yazın.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            maxLength={11}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="XXXX-XXX-XX"
            placeholderTextColor="#A0A8B0"
            value={value}
            onChangeText={(text) => setValue(formatCode(text.toUpperCase()))}
            autoFocus
            style={styles.input}
          />
        </View>
        <Text style={styles.enterCodeText}>Cihaz kodunu daxil edin</Text>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[
              styles.sendBtn,
              value.replace(/-/g, "").length !== 9 && styles.sendBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={value.replace(/-/g, "").length !== 9}
          >
            <Text style={styles.sendBtnText}>Davam et</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.openQrBtn} onPress={openQrScanner}>
            <Text style={styles.openQrText}>QR ilə scan et</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={[
            styles.container,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 16 : 40 }, // ✅
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <CloseIcon width={20} height={20} />
          </TouchableOpacity>
          {renderContent()}
        </Pressable>
      </Pressable>

      <BluetoothModal
        visible={showBluetoothModal}
        onClose={() => setShowBluetoothModal(false)}
      />
    </Modal>
  );
};

export default ManualQr;

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
});
