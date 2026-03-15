import BluetoothIcon from "@/assets/icons/home/permission/bluetooth-line.svg";
import QrCodeIcon from "@/assets/icons/home/permission/qrcode-line.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import { getBleManager } from "@/utils/bleManeger";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BluetoothModal from "../BluetoothModal/BluetoothModal";

interface QrScannerProps {
  visible: boolean;
  onScanned: (data: string) => void;
  onCancel: () => void;
  openManualCode: () => void;
}

const { width } = Dimensions.get("window");
const SCAN_AREA_SIZE = width * 0.5;

const QrScannerComponent = ({
  visible,
  onScanned,
  onCancel,
  openManualCode,
}: QrScannerProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleQrScanned = async (data: string) => {
    if (scanned) return;
    setScanned(true);

    const bleManager = getBleManager();
    const state = await bleManager.state();

    if (state !== "PoweredOn") {
      setShowBluetoothModal(true); // ✅ Bluetooth bağlıdır
      return;
    }

    onScanned(data); // ✅ Bluetooth açıqdır - davam et
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent // ✅ Tam ekran
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <CloseIcon width={20} height={20} />
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.title}>Cihaz əlavə et</Text>
          <Text style={styles.subtitle}>QR kodu scan sahəsinə tutun</Text>

          {/* ✅ Kiçildilmiş Camera */}
          <View style={styles.cameraWrapper}>
            <View style={styles.cameraContainer}>
              {!permission?.granted ? (
                <View style={styles.permissionContainer}>
                  <Text style={styles.permissionText}>
                    Kamera icazəsi verilməyib.
                  </Text>
                  <TouchableOpacity
                    style={styles.permissionBtn}
                    onPress={requestPermission}
                  >
                    <Text style={styles.permissionBtnText}>İcazə ver</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    onBarcodeScanned={({ data }) => handleQrScanned(data)}
                  />

                  {/* ✅ Scan Area Frame */}
                  <View style={styles.scanArea}>
                    <View style={styles.cornerTopLeft} />
                    <View style={styles.cornerTopRight} />
                    <View style={styles.cornerBottomLeft} />
                    <View style={styles.cornerBottomRight} />
                  </View>
                </>
              )}
            </View>

            {/* ✅ Scan area text */}
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <QrCodeIcon />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>QR kodu oxuyun</Text>
                <Text style={styles.infoDesc}>
                  Cihazın üzərindəki QR kodu scan edin. Oxunmasa, əl ilə daxil
                  edə bilərsiniz.
                </Text>
              </View>
            </View>

            <View style={[styles.infoRow, { marginTop: 16 }]}>
              <View style={styles.infoIcon}>
                <BluetoothIcon />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Bluetooth açıq olsun</Text>
                <Text style={styles.infoDesc}>
                  Cihaza qoşulmaq üçün Bluetooth-u açıq saxlayın.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.manualBtn} onPress={openManualCode}>
            <Text style={styles.manualBtnText}>Kodu əl ilə daxil et</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>

      <BluetoothModal
        visible={showBluetoothModal}
        onClose={() => {
          setShowBluetoothModal(false);
          setScanned(false); // ✅ yenidən scan etmək üçün
        }}
      />
    </Modal>
  );
};

export default QrScannerComponent;

const CORNER_SIZE = 40; // ✅ Böyüdüldü
const CORNER_THICKNESS = 4; // ✅ Qalınlaşdırıldı
const CORNER_COLOR = "#0069FE"; // ✅ Rəng dəyişdirildi

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "90%", // ✅ Max height
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    textAlign: "center",
    marginBottom: 24,
  },

  // ✅ Camera wrapper
  cameraWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  cameraContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    position: "relative",
  },
  scanArea: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: SCAN_AREA_SIZE * 0.7, // ✅ Camera-nın 70%-i
    height: SCAN_AREA_SIZE * 0.7,
    marginLeft: -(SCAN_AREA_SIZE * 0.7) / 2,
    marginTop: -(SCAN_AREA_SIZE * 0.7) / 2,
  },
  scanText: {
    marginTop: 12,
    fontSize: 12,
    color: "#717784",
    textAlign: "center",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  permissionText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  permissionBtn: {
    backgroundColor: "#0069FE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  permissionBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // ✅ QR Corner indicators - scan area-da
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: CORNER_COLOR,
    borderBottomRightRadius: 8,
  },

  // Info
  infoContainer: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E121B",
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    fontWeight: "400",
    color: "#717784",
    lineHeight: 16,
  },

  // Manual Button
  manualBtn: {
    backgroundColor: "#E4E7EC",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 24,
  },
  manualBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
});
