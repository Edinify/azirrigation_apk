import InfoIcon from "@/assets/icons/menu/profile/circle-info-solid.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import { useSendPhoneChangeOtpMutation } from "@/services/profile/profileApi";
import React, { useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import VerifyOtpModal from "./VerifyOtpModal";

interface Props {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
  onClose: () => void;
}

const EditPhone = ({ visible, value, onChange, onClose }: Props) => {
  const phoneInput = useRef<PhoneInput>(null);

  const [formattedValue, setFormattedValue] = useState("");
  const [valid, setValid] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);

  const [sendPhoneChangeOtp] = useSendPhoneChangeOtpMutation();

  console.log(formattedValue, "format");

  const isButtonDisabled = !value || value.length < 9;

  const cleanNumber = value?.startsWith("+994")
    ? value.replace("+994", "").replace(/\s/g, "")
    : value?.replace(/\s/g, "") || "";

  const handleContinue = async () => {
    const checkValid = phoneInput.current?.isValidNumber(value);

    try {
      sendPhoneChangeOtp({
        newPhone: formattedValue,
      }).unwrap();
      setOpenOtpModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.content}>
            <TouchableOpacity style={styles.close} onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.title}>Telefon nömrəsi</Text>

            <View style={{ marginTop: 24 }}>
              <PhoneInput
                ref={phoneInput}
                defaultCode="AZ"
                key={cleanNumber}
                defaultValue={cleanNumber}
                layout="first"
                onChangeText={onChange}
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
            <View style={styles.infoContainer}>
              <InfoIcon />
              <Text style={styles.infoText}>
                Daxil etdiyiniz nömrəyə təsdiq kodu göndəriləcək.
              </Text>
            </View>
          </View>

          <View style={styles.saveBtn}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                isButtonDisabled && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={isButtonDisabled}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  isButtonDisabled && styles.continueButtonTextDisabled,
                ]}
              >
                Davam et
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {openOtpModal && (
        <VerifyOtpModal
          visible={openOtpModal}
          value={formattedValue}
          onClose={() => setOpenOtpModal(false)}
          newPhone={formattedValue}
        />
      )}
    </Modal>
  );
};

export default EditPhone;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // yarı şəffaf qaranlıq fon
    justifyContent: "flex-end", // modal ekranın altından gəlir
  },
  modal: {
    backgroundColor: "white",

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
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  infoContainer: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 4,
  },
});
