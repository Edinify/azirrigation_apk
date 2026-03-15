import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import ProfileArrow from "@/assets/icons/menu/profileArrow.svg";
import BellIcon from "@/assets/icons/menu/settings/bell.svg";
import BluetoothIcon from "@/assets/icons/menu/settings/bluetooth.svg";
import CameraIcon from "@/assets/icons/menu/settings/camera.svg";
import LocationIcon from "@/assets/icons/menu/settings/location.svg";
import PermissionIcon from "@/assets/icons/menu/settings/permission.svg";

import React, { useMemo } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface PermissionProps {
  visible: boolean;
  onClose: () => void;
}

export interface PermissionItem {
  id: number;
  label: string;
  desc: string;
  Icon: React.ComponentType<any>;
}

const Permissions = ({ visible, onClose }: PermissionProps) => {
  const permissionDatas: PermissionItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "Kamera",
        desc: "Cihazları QR kodla skan edib əlavə etmək üçün istifadə olunur.",
        Icon: CameraIcon,
      },
      {
        id: 2,
        label: "Bluetooth",
        desc: "Cihazları yaxınlıqda tapmaq və qoşmaq üçün istifadə olunur.",
        Icon: BluetoothIcon,
      },
      {
        id: 3,
        label: "Məkan",
        desc: "Hava məlumatı və ağıllı suvarma üçün yerinizdən istifadə olunur.",
        Icon: LocationIcon,
      },
      {
        id: 4,
        label: "Bildirişlər",
        desc: "Cihaz bildirişləri və yeniliklər üçün bildirişləri aktiv edin.",
        Icon: BellIcon,
      },
    ],
    [],
  );
  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tətbiq icazələri</Text>
            <View style={styles.placeholder} />
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.permissionCards}>
              {permissionDatas.map((permission) => {
                const Icon = permission.Icon;
                return (
                  <View
                    key={permission.id}
                    style={[
                      styles.permissionCard,
                      permission.id === 1 && { marginTop: 0 },
                    ]}
                  >
                    <View style={styles.leftSide}>
                      <Icon />
                      <View style={styles.content}>
                        <Text style={styles.labelText}>{permission.label}</Text>
                        <Text style={styles.descText}>{permission.desc}</Text>
                      </View>
                    </View>
                    <View style={styles.rightSide}>
                      <PermissionIcon />
                      <ProfileArrow />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Permissions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  permissionCards: {
    marginTop: 8,
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  permissionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
  },

  leftSide: {
    flexDirection: "row",
    flex: 1,
  },
  content: {
    marginLeft: 10,
    flex: 1,
    flexShrink: 1,
    paddingRight: 8,
  },

  labelText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
  descText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
    flexWrap: "wrap",
  },
  rightSide: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    marginLeft: 8,
  },
});
