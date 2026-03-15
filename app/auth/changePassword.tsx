// app/(auth)/register.tsx
import BackIcon from "@/assets/icons/back.svg";
import EyeIcon from "@/assets/icons/login_register/eye-line.svg";
import EyeSlashIcon from "@/assets/icons/login_register/eye-slash-line.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { usePasswordResetCompleteMutation } from "@/services/auth/authApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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

export default function ChangePassword() {
  const router = useRouter();

  const { resetToken } = useLocalSearchParams<{
    resetToken: string;
  }>();

  const [passwordResetComplete, { isLoading }] =
    usePasswordResetCompleteMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!password) {
      setError("Şifrə daxil edin");
      return;
    }

    if (password.length < 6) {
      setError("Şifrə minimum 6 simvol olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifrələr uyğun gəlmir");
      return;
    }

    setLoading(true);

    try {
      await passwordResetComplete({
        newPassword: password,
        confirmPassword,
        resetToken,
      }).unwrap();
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    !password || !confirmPassword || password.length < 6 || loading;

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
              onPress={() => router.back()}
            >
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Şifrənizi dəyişin</Text>

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

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Təkrar şifrə"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {!showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.errorText}>Şifrələr uyğun gəlmir</Text>
              )}
            </View>
          </View>
        </ScrollView>
        {/* Register Button */}
        <View style={styles.footer}>
          <CustomAddButton
            text="Şifrəni yenilə"
            size="l"
            addDisabled={isButtonDisabled}
            onClick={handleRegister}
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
    fontSize: 28,
    color: "#0E121B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 24,
  },
  verifiedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  verifiedText: {
    fontSize: 14,
    color: "#10B981",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#0E121B",
    marginBottom: 8,
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

  footer: {
    padding: 20,
    position: "fixed",
    bottom: 20,
  },
  registerButton: {
    backgroundColor: "#0069FE",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: "#0069FE",
    opacity: 0.5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
