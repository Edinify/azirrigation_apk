// app/(menu)/change-password.tsx
import EyeIcon from "@/assets/icons/login_register/eye-line.svg";
import EyeSlashIcon from "@/assets/icons/login_register/eye-slash-line.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { useChangePasswordMutation } from "@/services/profile/profileApi";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isButtonDisabled =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword.length < 6 ||
    newPassword !== confirmPassword ||
    loading;

  const handleChangePassword = async () => {
    // Validasiya
    if (newPassword.length < 6) {
      setError("Yeni şifrə minimum 6 simvol olmalıdır");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Yeni şifrələr uyğun gəlmir");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Yeni şifrə cari şifrədən fərqli olmalıdır");
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      setLoading(false);
      router.push("/profile");
    } catch (error) {
      console.error("Password change error:", error);
      setError("Şifrə dəyişdirilərkən xəta baş verdi");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.headerTitle}>Şifrə</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cari şifrə</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeIcon width={20} height={20} />
                  ) : (
                    <EyeSlashIcon width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Yeni şifrə</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholder="••••••••••"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeIcon width={20} height={20} />
                  ) : (
                    <EyeSlashIcon width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
              {newPassword.length > 0 && newPassword.length < 6 && (
                <Text style={styles.errorText}>
                  Şifrə minimum 6 simvol olmalıdır
                </Text>
              )}
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Təkrar yeni şifrə</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="••••••••••"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeIcon width={20} height={20} />
                  ) : (
                    <EyeSlashIcon width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 &&
                newPassword !== confirmPassword && (
                  <Text style={styles.errorText}>Şifrələr uyğun gəlmir</Text>
                )}
            </View>
          </View>

          {/* Footer Button */}
        </ScrollView>
        <View style={styles.footer}>
          <CustomAddButton
            addDisabled={isButtonDisabled}
            onClick={handleChangePassword}
            text="Şifrəni yenilə"
            size="l"
            loading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F7FA",
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0E121B",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#FE171B",
    marginTop: 6,
    marginLeft: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  updateButton: {
    backgroundColor: "#0069FE",
    paddingVertical: 24,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
