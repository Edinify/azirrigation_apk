import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import {
  useResendPhoneChangeOtpMutation,
  useVerifyPhoneChangeMutation,
} from "@/services/profile/profileApi";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

interface Props {
  visible: boolean;
  value: string;
  onClose: () => void;
  newPhone: string;
}

const VerifyOtpModal = ({ visible, value, onClose, newPhone }: Props) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [resendPhoneChangeOtp] = useResendPhoneChangeOtpMutation();
  const [verifyPhoneChange] = useVerifyPhoneChangeMutation();

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // OTP doldurulduqda avtomatik verify
  const handleOtpFilled = async (code: string) => {
    setLoading(true);

    try {
      await verifyPhoneChange({ newPhone, otp: code }).unwrap();
      onClose();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  // OTP yenidən göndər (statik)
  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await resendPhoneChangeOtp({ newPhone }).unwrap();
      setTimer(60);
      setCanResend(false);
      setOtp("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.content}>
            <TouchableOpacity style={styles.close} onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.title}>Kodu daxil edin</Text>
            <Text style={styles.subText}>
              Kod SMS ilə {value} nömrəsinə göndərildi
            </Text>

            <View style={styles.otpContainer}>
              <OtpInput
                numberOfDigits={6}
                onTextChange={(text) => setOtp(text)}
                onFilled={handleOtpFilled}
                theme={{
                  containerStyle: styles.otpInputContainer,
                  pinCodeContainerStyle: error
                    ? styles.pinCodeContainerError
                    : styles.pinCodeContainer,
                  pinCodeTextStyle: styles.pinCodeText,
                  focusStickStyle: styles.focusStick,
                  focusedPinCodeContainerStyle: styles.pinCodeContainerFocused,
                }}
                disabled={loading}
              />
            </View>
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Kod SMS gəlmədi? </Text>
              {canResend ? (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendLink}>Yenidən göndər</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimer}>
                  Yenidən göndər ({timer}s)
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyOtpModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // yarı şəffaf qaranlıq fon
    justifyContent: "flex-end", // modal ekranın altından gəlir
  },
  modal: {
    backgroundColor: "white",
    height: 300,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5, // Android üçün kölgə
    shadowColor: "#000", // iOS üçün kölgə
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
  },

  close: {
    padding: 5,
    backgroundColor: "#EEF2F6",
    borderRadius: "100%",
    position: "absolute",
    right: 20,
    top: 20,
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
  },

  subText: {
    textAlign: "center",
    marginTop: 8,
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },

  otpContainer: {
    marginBottom: 24,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pinCodeContainer: {
    height: 52,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  pinCodeContainerFocused: {
    borderColor: "#0069FE",
    backgroundColor: "#fff",
  },
  pinCodeContainerError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  pinCodeText: {
    fontSize: 16,
    color: "#0E121B",
    fontWeight: 400,
  },
  focusStick: {
    backgroundColor: "#0069FE",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
  },
  resendText: {
    fontSize: 14,
    color: "#717784",
  },
  resendLink: {
    fontSize: 14,
    color: "#0069FE",
  },
  resendTimer: {
    fontSize: 14,
    color: "#0E121B",
  },
});
