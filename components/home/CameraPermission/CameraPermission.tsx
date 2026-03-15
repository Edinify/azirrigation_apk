import CameraIcon from "@/assets/icons/home/permission/camera-line.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";

import React from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CameraProps {
  visible: boolean;
  onClose: () => void;
}

const CameraPermission = ({ visible, onClose }: CameraProps) => {
  const openSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconContainer}
            >
              <CloseIcon />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <CameraIcon width={40} height={40} />
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.titleText}>Kamera icazəsi lazımdır</Text>
              <Text style={styles.subTitleText}>
                Cihazı əlavə etmək üçün Kameranı aktiv edin. QR kodu skan etmək
                üçün istifadə olunur.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.parameterBtn}
              onPress={() => {
                openSettings();
                onClose();
              }}
            >
              <Text style={styles.btnText}>Parametrlərə keç</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CameraPermission;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 20,
  },

  header: {
    position: "relative",
  },
  closeIconContainer: {
    position: "absolute",
    right: 5,
    top: -20,
    padding: 5,
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  titleText: {
    color: "#0E121B",
    fontSize: 24,
    fontWeight: "600",
  },
  subTitleText: {
    marginTop: 16,
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    maxWidth: "70%",
  },

  parameterBtn: {
    height: 55,
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionBtnDisabled: {
    backgroundColor: "#A0A0A0",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
