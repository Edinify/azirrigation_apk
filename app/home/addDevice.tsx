import LeftIcon from "@/assets/icons/home/add-device/left.svg";
import CloseIcon from "@/assets/icons/home/add-device/xmark-line.svg";
import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import AddDeviceName from "@/components/home/AddDevice/AddDeviceName";
import AddSensors from "@/components/home/AddDevice/AddSensors/AddSensors";
import AddValve from "@/components/home/AddDevice/AddValve";
import HideWifi from "@/components/home/AddDevice/HideWifi";
import WifiPasswordStep from "@/components/home/AddDevice/WifiPasswordStep";
import WifiStep from "@/components/home/AddDevice/WifiStep";
import { getBleManager } from "@/utils/bleManeger";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  resetDeviceForm,
  setBleData,
  setSsidName,
} from "@/services/devices/deviceFormSlice";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const TOTAL_STEPS = 4;

const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const UART_RX_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; // Telefon → Cihaz
const UART_TX_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"; // Cihaz → Telefon

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressStep,
            index < currentStep
              ? styles.progressStepActive
              : styles.progressStepInactive,
          ]}
        />
      ))}
    </View>
  );
};

const AddDevice = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showHideWifi, setShowHideWifi] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  console.log(connectedDevice, "connected");

  const mockMode = false;
  const bleManager = getBleManager();

  useEffect(() => {
    if (!mockMode) {
      scanAndConnectDevice();
    }

    return () => {
      if (connectedDevice) {
        connectedDevice.cancelConnection().catch(() => {});
      }
    };
  }, []);

  // startListeningToDevice-də BLE data parse et
  const startListeningToDevice = (device: Device) => {
    device.monitorCharacteristicForService(
      UART_SERVICE_UUID,
      UART_TX_UUID,
      (error, characteristic) => {
        if (error) {
          console.error("Monitor error:", error);
          return;
        }

        if (characteristic?.value) {
          const message = atob(characteristic.value)
            .replace(/\0/g, "") // ✅ null byte sil
            .trim();

          console.log("📥 Device response:", message);

          try {
            const bleData = JSON.parse(message);

            if (bleData.Valve !== undefined) {
              console.log("🔧 Valve:", bleData.Valve);
              dispatch(setBleData({ valvePortCount: bleData.Valve }));
            }

            if (bleData.id !== undefined) {
              console.log("🔧 ID:", bleData.id);
              dispatch(setBleData({ deviceId: bleData.id }));
            }

            if (bleData.ssid !== undefined) {
              console.log("🔧 SSID:", bleData.ssid);
              dispatch(setBleData({ ssid: bleData.ssid }));
            }

            if (bleData.sen) {
              const sen = bleData.sen;

              // ✅ string yoxla, object deyil
              dispatch(
                setBleData({
                  ...(sen === "flow" && { flowSensor: { isConnected: true } }),
                  ...(sen === "level" && {
                    levelSensor: { isConnected: true },
                  }),
                  ...(sen === "pressure" && {
                    pressureSensor: { isConnected: true },
                  }),
                  ...(sen === "humidity" && {
                    humiditySensor: { isConnected: true },
                  }),
                }),
              );
            }
          } catch {
            if (message.includes("WIFI_OK")) {
              console.log("✅ Wi-Fi confirmed");
            } else if (message.includes("WIFI_ERROR")) {
              Alert.alert("Xəta", "Cihaz Wi-Fi-a qoşula bilmədi");
            }
          }
        }
      },
    );
  };
  const scanAndConnectDevice = async () => {
    try {
      setIsConnecting(true);

      // Permissions
      if (Platform.OS === "android" && Platform.Version >= 31) {
        const results = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        if (
          results["android.permission.BLUETOOTH_SCAN"] !== "granted" ||
          results["android.permission.BLUETOOTH_CONNECT"] !== "granted"
        ) {
          Alert.alert("Xəta", "Bluetooth icazələri verilmədi");
          setIsConnecting(false);
          return;
        }
      }

      // Bluetooth state check
      const state = await bleManager.state();
      if (state !== "PoweredOn") {
        Alert.alert("Xəta", "Bluetooth açın");
        setIsConnecting(false);
        return;
      }

      // Scan timeout
      const scanTimeout = setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsConnecting(false);
        Alert.alert(
          "Xəta",
          "Cihaz tapılmadı. Cihazın açıq olduğundan əmin olun.",
        );
      }, 30000);

      // Start scan
      bleManager.startDeviceScan(
        [],
        { allowDuplicates: false },
        async (error, device) => {
          if (error) {
            console.error("Scan error:", error);
            clearTimeout(scanTimeout);
            bleManager.stopDeviceScan();
            setIsConnecting(false);
            return;
          }

          // ✅ Cihaz adını yoxla (QR-dan gələn ID ilə match edə bilərsiniz)
          if (device && device.name?.includes("Azirrigation")) {
            console.log("✅ Device found:", device.name);
            clearTimeout(scanTimeout);
            bleManager.stopDeviceScan();

            try {
              // Connect
              const connected = await bleManager.connectToDevice(device.id, {
                timeout: 10000,
              });

              await connected.discoverAllServicesAndCharacteristics();

              console.log("✅ Connected to device:", connected.name);
              setConnectedDevice(connected);
              dispatch(setBleData({ bleDeviceId: device.id }));
              setIsConnecting(false);

              // ✅ Cihazdan mesaj oxu (optional)
              startListeningToDevice(connected);
            } catch (connectError) {
              console.error("Connection error:", connectError);
              setIsConnecting(false);
              Alert.alert("Xəta", "Cihaza qoşulma uğursuz oldu");
            }
          }
        },
      );
    } catch (err) {
      console.error("BLE error:", err);
      setIsConnecting(false);
      Alert.alert("Xəta", "Bluetooth xətası");
    }
  };

  const handleClose = () => {
    setShowModal(true);
  };

  const handleWifiNext = (network: string) => {
    setSelectedNetwork(network);
    dispatch(setSsidName(network));
    setShowPasswordModal(true);
  };

  const handlePasswordNext = () => {
    console.log("✅ Wi-Fi connected, moving to next step");
    setShowPasswordModal(false);
    setCurrentStep(2);
  };

  const handleSkipWifi = () => {
    setCurrentStep(2);
  };

  const handleHideWifiConnect = async (
    ssid: string,
    sec: string,
    psw: string,
  ) => {
    if (mockMode) {
      Alert.alert("Göndərilir", "Wi-Fi məlumatları cihaza göndərilir...");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        Alert.alert("Uğurlu", "Wi-Fi məlumatları cihaza göndərildi", [
          {
            text: "OK",
            onPress: () => {
              setShowHideWifi(false);
              setCurrentStep(2);
            },
          },
        ]);
      } else {
        Alert.alert("Xəta", "Wi-Fi məlumatları göndərilmədi.");
      }
      return;
    }

    // Real BLE
    if (!connectedDevice) {
      Alert.alert("Xəta", "Cihaz qoşulu deyil");
      return;
    }

    try {
      console.log("📡 Sending Wi-Fi credentials via BLE");

      // ✅ JSON format (tövsiyə olunur)
      const wifiData = JSON.stringify({
        ssid: ssid,
        psw: psw,
        sec: sec,
      });

      console.log("Data:", wifiData);

      const dataBase64 = btoa(wifiData);

      await connectedDevice.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_RX_UUID,
        dataBase64,
      );

      console.log("✅ Wi-Fi credentials sent successfully");

      Alert.alert("Uğurlu", "Wi-Fi məlumatları cihaza göndərildi", [
        {
          text: "OK",
          onPress: () => {
            setShowHideWifi(false);
            setCurrentStep(2);
          },
        },
      ]);
    } catch (err) {
      console.error("❌ Wi-Fi send error:", err);
      Alert.alert("Xəta", "Wi-Fi məlumatları göndərilmədi.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WifiStep
            onNext={handleWifiNext}
            onSkip={handleSkipWifi}
            onCantSee={() => setShowHideWifi(true)}
            type="device"
            mockMode={mockMode}
          />
        );
      case 2:
        return <AddValve onNext={() => setCurrentStep(3)} type="device" />;
      case 3:
        return <AddDeviceName onNext={() => setCurrentStep(4)} />;
      case 4:
        return (
          <AddSensors
            type="device"
            onFinish={() => {
              dispatch(resetDeviceForm());
              router.replace("/(tabs)");
            }}
          />
        );
      default:
        return null;
    }
  };

  if (isConnecting && !mockMode) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0069FE" />
          <Text style={styles.loadingText}>Cihaz axtarılır...</Text>
        </View> */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={() => setCurrentStep((step) => step - 1)}
            >
              <LeftIcon />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <CloseIcon />
          </TouchableOpacity>
        </View>

        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>

      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowPasswordModal(false)}
          >
            <Pressable
              style={styles.modalContainer}
              onPress={(e) => e.stopPropagation()}
            >
              <WifiPasswordStep
                networkName={selectedNetwork}
                onNext={handlePasswordNext}
                onBack={() => setShowPasswordModal(false)}
                connectedDevice={connectedDevice}
                mockMode={mockMode}
              />
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <HideWifi
        visible={showHideWifi}
        onClose={() => setShowHideWifi(false)}
        onConnect={handleHideWifiConnect}
      />

      <CommonConfirmModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        text="Quraşdırma dayandırılsın?"
        desc="İndi çıxsanız, bu quraşdırma prosesi ləğv olunacaq və daxil etdiyiniz məlumatlar yadda saxlanılmayacaq. Yenidən başlamaq lazım olacaq."
        type="stop_configuration"
      />
    </SafeAreaView>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#717784",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  progressContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: "#0069FE",
  },
  progressStepInactive: {
    backgroundColor: "#D1D5DB",
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: "95%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
});
