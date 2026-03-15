// app/(auth)/verify-otp.tsx
import BackIcon from "@/assets/icons/back.svg";
import {
  usePasswordResetResendOtpMutation,
  usePasswordResetVerifyOtpMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/services/auth/authApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOtp() {
  const router = useRouter();
  const { phone, type } = useLocalSearchParams<{ phone: string }>();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const [passwordResetVerifyOtp] = usePasswordResetVerifyOtpMutation();
  const [passwordResetResendOtp] = usePasswordResetResendOtpMutation();

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

  const handleOtpFilled = async (code: string) => {
    setLoading(true);
    console.log("🔐 Daxil edilən OTP:", code);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      if (type === "register") {
        const data = await verifyOtp({ phone, otp: code }).unwrap();

        router.push({
          pathname: "/auth/register",
          params: {
            phone: phone,
            registrationToken: data.registrationToken,
          },
        });
      } else if (type === "forgotPassword") {
        const data = await passwordResetVerifyOtp({
          phone,
          otp: code,
        }).unwrap();

        router.push({
          pathname: "/auth/changePassword",
          params: {
            phone: phone,
            resetToken: data.resetToken,
          },
        });
      }

      setOtp("");
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      if (type === "register") {
        await resendOtp({ phone, otp }).unwrap();
      } else if (type === "forgotPassword") {
        await passwordResetResendOtp({ phone, otp }).unwrap();

        console.log("hello");
      }
    } catch (error) {
      console.log(error);
    }

    setTimer(60);
    setCanResend(false);
    setOtp("");
  };

  // Telefon nömrəsini format et (gizli)
  const formatPhone = (phoneNumber: string) => {
    if (phoneNumber && phoneNumber.length > 10) {
      const start = phoneNumber.slice(0, 7);
      const end = phoneNumber.slice(-2);
      return `${start} *** ** ${end}`;
    }
    return phoneNumber;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Təsdiq kodunu daxil edin</Text>
          <Text style={styles.subtitle}>
            Kod SMS ilə{" "}
            <Text style={styles.phoneNumber}>{formatPhone(phone)}</Text>{" "}
            nömrəsinə göndərildi
          </Text>

          {/* OTP Input */}
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

          {/* Loading */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0069FE" />
              <Text style={styles.loadingText}>Yoxlanılır...</Text>
            </View>
          )}

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Kod SMS gəlmədi? </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendLink}>Yenidən göndər</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendTimer}>Yenidən göndər ({timer}s)</Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    marginTop: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    color: "#0E121B",
    fontWeight: 600,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#717784",
    lineHeight: 24,
    marginBottom: 16,
  },
  phoneNumber: {
    color: "#0E121B",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#10B981",
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
