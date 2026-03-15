import BluetoothIcon from "@/assets/icons/home/permission/bluetooth-line.svg";
import CameraIcon from "@/assets/icons/home/permission/camera-line.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import { Camera } from "expo-camera";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BluetoothPermission from "../BluetoothPermission/BluetoothPermission";
import CameraPermission from "../CameraPermission/CameraPermission";

interface PermissionProps {
  visible: boolean;
  onClose: () => void;
  onPermissionsGranted?: () => void;
}

const Permission = ({
  visible,
  onClose,
  onPermissionsGranted,
}: PermissionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activePermissionModal, setActivePermissionModal] = useState<
    "camera" | "bluetooth" | null
  >(null);

  const permissionData = [
    {
      id: 1,
      label: "Kamera",
      desc: "QR kodu skan etmək üçün istifadə olunur.",
      Icon: CameraIcon,
    },
    {
      id: 2,
      label: "Bluetooth",
      desc: "Cihazı tapmaq və qoşulmanı avtomatik etmək üçün istifadə olunur.",
      Icon: BluetoothIcon,
    },
  ];

  const requestCameraPermission = async () => {
    try {
      const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();

      if (status === "granted") {
        return true;
      }

      if (canAskAgain) {
        const { status: newStatus } =
          await Camera.requestCameraPermissionsAsync();
        return newStatus === "granted";
      }

      return false;
    } catch (error) {
      console.error("Camera permission error:", error);
      return false;
    }
  };

  const handleRequestPermissions = async () => {
    setIsLoading(true);

    try {
      const cameraGranted = await requestCameraPermission();

      if (!cameraGranted) {
        const { canAskAgain } = await Camera.getCameraPermissionsAsync();

        if (!canAskAgain) {
          setActivePermissionModal("camera");
        } else {
          setActivePermissionModal("camera");
        }

        return;
      }

      // const bluetoothGranted = await requestBluetoothPermission();

      // if (!bluetoothGranted) {
      //   setActivePermissionModal("bluetooth");
      //   return;
      // }

      onClose();

      setTimeout(() => {
        onPermissionsGranted?.();
      }, 300);
    } catch (error) {
      console.error(error);
      Alert.alert("Xəta", "İcazə verərkən xəta baş verdi.");
    } finally {
      setIsLoading(false);
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
            <View style={styles.headerContent}>
              <Text style={styles.titleText}>İcazələri aktiv edin</Text>
              <Text style={styles.subTitleText}>
                Cihazı əlavə etmək üçün Kamera və Bluetooth-u aktiv edin.
              </Text>
            </View>
          </View>
          <View style={styles.permissionContainer}>
            {permissionData?.map((data) => {
              const Icon = data.Icon;
              return (
                <View
                  key={data.id}
                  style={[
                    styles.permissionCard,
                    data.id === 1 && { marginTop: 0 },
                  ]}
                >
                  <Icon />
                  <View style={styles.permissionContent}>
                    <Text style={styles.labelText}>{data.label}</Text>
                    <Text style={styles.descText}>{data.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={[
              styles.permissionBtn,
              isLoading && styles.permissionBtnDisabled,
            ]}
            onPress={handleRequestPermissions}
            disabled={isLoading}
          >
            <Text style={styles.permissionText}>
              {isLoading ? "Yoxlanılır..." : "İcazə ver"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>İndi yox</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
      <CameraPermission
        visible={activePermissionModal === "camera"}
        onClose={() => setActivePermissionModal(null)}
      />

      <BluetoothPermission
        visible={activePermissionModal === "bluetooth"}
        onClose={() => setActivePermissionModal(null)}
      />
    </Modal>
  );
};

export default Permission;

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
    marginTop: 8,
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    maxWidth: "70%",
  },
  permissionContainer: {
    marginTop: 36,
  },
  permissionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  permissionContent: {
    marginLeft: 12,
  },
  labelText: {
    color: "#0E121B",
    fontSize: 18,
    fontWeight: "600",
  },
  descText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: "400",
    maxWidth: "95%",
  },
  permissionBtn: {
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
  permissionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  cancelBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
});
