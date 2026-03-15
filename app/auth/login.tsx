// app/(auth)/login.tsx
import BackIcon from "@/assets/icons/back.svg";
import EyeIcon from "@/assets/icons/login_register/eye-line.svg";
import EyeSlashIcon from "@/assets/icons/login_register/eye-slash-line.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { useLoginMutation } from "@/services/auth/authApi";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";

export default function LoginScreen() {
  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const phoneInput = useRef<PhoneInput>(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);

  const isButtonDisabled =
    !phoneNumber ||
    phoneNumber.length !== 9 ||
    !password ||
    password.length < 6 ||
    loading;

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login({ phone: formattedValue, password }).unwrap();
      setLoading(false);
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error.data, "0000000000000000000000000");
      if (error.data.message === "Invalid phone or password") {
        setError("Daxil etdiyiniz şifrə və ya nömrə səhvdir.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace("/auth/onboarding")}
            >
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Hesabınıza daxil olun</Text>

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
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Şifrə"
                  placeholderTextColor="#717784"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </TouchableOpacity>
              </View>
              {password.length > 0 && password.length < 6 ? (
                <Text style={styles.errorText}>
                  Şifrə minimum 6 simvol olmalıdır
                </Text>
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/auth/phoneInput",
                  params: { type: "forgotPassword" },
                })
              }
            >
              <Text style={styles.forgetText}>Şifrəni unutmusunuz?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <CustomAddButton
            text="Daxil olun"
            size="l"
            onClick={handleLogin}
            addDisabled={isButtonDisabled}
            loading={isLoading}
          />
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 28,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    color: "#0E121B",
    marginBottom: 8,
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

  footer: {
    position: "fixed",
    bottom: 0,
    padding: 20,
  },
  countryPickerButton: {
    paddingLeft: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0E121B",
    backgroundColor: "#fff",
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#FE171B",
    marginTop: 6,
    marginLeft: 4,
  },
  forgetText: {
    color: "#0069FE",
    fontSize: 14,
    fontWeight: 500,
  },

  loginButton: {
    backgroundColor: "#0069FE",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#0069FE",
    opacity: 0.5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
