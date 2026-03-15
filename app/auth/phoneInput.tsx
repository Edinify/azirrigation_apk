// app/(auth)/phone-input.tsx
import BackIcon from "@/assets/icons/back.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import {
  usePasswordResetInitiateMutation,
  useSendOtpMutation,
} from "@/services/auth/authApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
export default function PhoneInputScreen() {
  const router = useRouter();
  const phoneInput = useRef<PhoneInput>(null);

  const { type } = useLocalSearchParams();

  const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation();

  const [passwordResetInitiate, { isLoading: passwordResetLoading }] =
    usePasswordResetInitiateMutation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);

  const openTerms = () => {
    Linking.openURL("https://yourapp.com/terms");
  };

  const handleContinue = async () => {
    try {
      if (type === "register") {
        console.log({ phone: formattedValue });
        await sendOtp({ phone: formattedValue }).unwrap();
      } else if (type === "forgotPassword") {
        await passwordResetInitiate({ phone: formattedValue }).unwrap();
      }

      const fullNumber = formattedValue || `+994${phoneNumber}`;

      router.push({
        pathname: "/auth/verifyOtp",
        params: { phone: fullNumber, type },
      });
    } catch (error) {
      console.log(error);
      console.log("error");
    }
  };

  const isButtonDisabled = !phoneNumber || phoneNumber.length < 9;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header - Geri düyməsi */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Başlıq */}
          <Text style={styles.title}>Telefon nömrənizi daxil edin</Text>

          {/* Phone Input */}
          <View style={styles.phoneInputWrapper}>
            <PhoneInput
              ref={phoneInput}
              defaultCode="AZ"
              layout="first"
              onChangeText={(text) => {
                setPhoneNumber(text);
              }}
              onChangeFormattedText={(text) => {
                setFormattedValue(text);
                setValid(phoneInput.current?.isValidNumber(text) || false);
              }}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.textContainer}
              textInputStyle={styles.textInput}
              codeTextStyle={styles.codeText}
              flagButtonStyle={styles.flagButton}
              countryPickerButtonStyle={styles.countryPickerButton}
              placeholder="Telefon nömrəsi"
              textInputProps={{
                placeholderTextColor: "#9CA3AF",
                maxLength: 15,
              }}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Davam et düyməsi */}

          <CustomAddButton
            size="l"
            text="Davam et"
            onClick={handleContinue}
            addDisabled={isButtonDisabled}
            loading={sendOtpLoading || passwordResetLoading}
          />

          <Text style={styles.termsText}>
            Qeydiyyatdan keçməklə,{" "}
            <Text style={styles.termsLink} onPress={openTerms}>
              Şərtlərlə
            </Text>{" "}
            razılaşmış olursunuz.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    color: "#0E121B",
    marginBottom: 16,
    fontWeight: 600,
  },
  phoneInputWrapper: {
    marginBottom: 24,
  },
  phoneContainer: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  textContainer: {
    paddingVertical: 0,
    backgroundColor: "#fff",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  textInput: {
    fontSize: 16,
    color: "#0E121B",
    height: 56,
  },
  codeText: {
    fontSize: 16,
    color: "#0E121B",
  },
  flagButton: {
    width: 80,
  },
  countryPickerButton: {
    paddingLeft: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: "#0069FE",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  continueButtonDisabled: {
    backgroundColor: "#0069FE",
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  continueButtonTextDisabled: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#0069FE",
  },
});
