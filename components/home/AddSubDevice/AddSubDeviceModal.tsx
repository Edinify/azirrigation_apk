import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { getBleManager } from "@/utils/bleManeger";
import React, { useEffect, useRef, useState } from "react";

import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import CommonValveCard from "@/components/commonComponents/CommonValveCard/CommonValveCard";
import {
  Alert,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Device } from "react-native-ble-plx";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AddSensorsToSubdevice from "../AddDevice/AddSensors/AddSensorsToSubdevice";
import AddValveModal from "../AddDevice/AddValveModal";

const FirstLogo = require("@/assets/images/home/sub-device/firstLogo.png");
const SecondLogo = require("@/assets/images/home/sub-device/secondLogo.png");
const SuccessLogo = require("@/assets/images/home/sub-device/successLogo.png");
const ErrorLogo = require("@/assets/images/home/sub-device/errorLogo.png");

type ScanState =
  | "idle"
  | "scanning"
  | "found"
  | "connecting"
  | "connected"
  | "addSensor"
  | "error";

interface AddSubDeviceProps {
  visible: boolean;
  onClose: () => void;
  onDeviceConnected?: (device: Device) => void;
  mockMode?: boolean;
  onSaveSubDevice?: (name: string, valves: Valve[]) => void;
}

interface Valve {
  id: number;
  valve: string;
  name: string;
}

const AddSubDeviceModal = ({
  visible,
  onClose,
  onDeviceConnected,
  onSaveSubDevice,
  mockMode = false,
}: AddSubDeviceProps) => {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [foundDevice, setFoundDevice] = useState<Device | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const scanStateRef = useRef<ScanState>("idle");

  const [editingValve, setEditingValve] = useState<Valve | null>(null);
  const [valves, setValves] = useState<Valve[]>([]);
  const [valveName, setValveName] = useState("");
  const [selectedValve, setSelectedValve] = useState("");
  const [showValveModal, setShowValveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const scanningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bleManager = getBleManager();

  useEffect(() => {
    scanStateRef.current = scanState;
  }, [scanState]);

  useEffect(() => {
    if (!visible) {
      handleReset();
    }
  }, [visible, mockMode, bleManager]);

  const handleReset = () => {
    setScanState("idle");
    setFoundDevice(null);
    setErrorMessage("");
    setDeviceName("");

    // Timeout-ları təmizlə
    if (scanningTimeoutRef.current) {
      clearTimeout(scanningTimeoutRef.current);
      scanningTimeoutRef.current = null;
    }

    if (!mockMode) {
      bleManager.stopDeviceScan();
    }
  };

  // MOCK - Manual state transitions
  const mockScanning = async () => {
    setScanState("scanning");
    setErrorMessage("");

    // 30 saniyə timeout
    scanningTimeoutRef.current = setTimeout(() => {
      if (scanStateRef.current === "scanning") {
        setScanState("error");
        setErrorMessage("Cihaz tapılmadı. Yenidən cəhd edin.");
      }
    }, 30000);

    // 2-5 saniyə random axtarış
    const scanDuration = 2000 + Math.random() * 3000;
    await new Promise((resolve) => setTimeout(resolve, scanDuration));

    // Random success/error
    const isSuccess = Math.random() > 0.3;
    console.log("Mock result:", isSuccess ? "success" : "error");

    if (scanStateRef.current === "scanning") {
      if (isSuccess) {
        if (scanningTimeoutRef.current) {
          clearTimeout(scanningTimeoutRef.current);
        }
        setScanState("found");
        console.log("Device found - waiting for user action");
      } else {
        if (scanningTimeoutRef.current) {
          clearTimeout(scanningTimeoutRef.current);
        }
        setScanState("error");
        setErrorMessage("Cihaz tapılmadı. Yenidən cəhd edin.");
      }
    }
  };

  // Stop scanning manually
  const stopScanning = () => {
    if (scanningTimeoutRef.current) {
      clearTimeout(scanningTimeoutRef.current);
    }

    if (!mockMode) {
      bleManager.stopDeviceScan();
    }

    setScanState("idle");
  };

  // Manual connect
  const handleConnect = async () => {
    if (mockMode) {
      setScanState("connecting");
      console.log("Mock connecting");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const connectionSuccess = Math.random() > 0.2;
      console.log("Mock connection result:", connectionSuccess);

      if (connectionSuccess) {
        setScanState("connected");
        console.log("Mock connected");
      } else {
        setScanState("error");
        setErrorMessage("Qoşulma zamanı xəta baş verdi");
      }
    } else {
      // Real connection
      if (foundDevice) {
        await connectToDevice(foundDevice);
      }
    }
  };

  // Bluetooth permissions
  const requestBluetoothPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "ios") return true;

    if (Platform.Version >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      return (
        results["android.permission.BLUETOOTH_SCAN"] === "granted" &&
        results["android.permission.BLUETOOTH_CONNECT"] === "granted"
      );
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === "granted";
    }
  };

  const checkBluetoothState = async (): Promise<boolean> => {
    const state = await bleManager.state();

    if (state !== "PoweredOn") {
      Alert.alert(
        "Bluetooth söndürülüb",
        "Davam etmək üçün Bluetooth-u açın.",
        [{ text: "OK" }],
      );
      return false;
    }
    return true;
  };

  const isSubDevice = (device: Device): boolean => {
    if (device.name && device.name.includes("SubDevice")) {
      return true;
    }
    return false;
  };

  const connectToDevice = async (device: Device) => {
    try {
      setScanState("connecting");

      const isConnected = await device.isConnected();
      if (isConnected) {
        await device.cancelConnection();
      }

      const connectedDevice = await bleManager.connectToDevice(device.id, {
        timeout: 10000,
      });

      await connectedDevice.discoverAllServicesAndCharacteristics();

      console.log("Connected to device:", connectedDevice.name);
      setScanState("connected");

      if (onDeviceConnected) {
        onDeviceConnected(connectedDevice);
      }
    } catch (err) {
      console.error("Connection error:", err);
      setScanState("error");
      setErrorMessage("Qoşulma zamanı xəta baş verdi");
    }
  };

  const realScanning = async () => {
    try {
      const hasPermissions = await requestBluetoothPermissions();
      if (!hasPermissions) {
        setScanState("error");
        setErrorMessage("Bluetooth icazəsi verilmədi");
        return;
      }

      const isBluetoothOn = await checkBluetoothState();
      if (!isBluetoothOn) {
        setScanState("error");
        setErrorMessage("Bluetooth söndürülüb");
        return;
      }

      setScanState("scanning");
      setErrorMessage("");

      bleManager.stopDeviceScan();

      const timeoutId = setTimeout(() => {
        if (scanStateRef.current === "scanning") {
          bleManager.stopDeviceScan();
          setScanState("error");
          setErrorMessage("Cihaz tapılmadı. Yenidən cəhd edin.");
        }
      }, 30000);

      scanningTimeoutRef.current = timeoutId;

      bleManager.startDeviceScan(
        null,
        {
          allowDuplicates: false,
          scanMode: 2,
        },
        (error, device) => {
          if (error) {
            console.error("Scan error:", error);
            clearTimeout(timeoutId);
            setScanState("error");
            setErrorMessage("Axtarış zamanı xəta baş verdi");
            bleManager.stopDeviceScan();
            return;
          }

          if (device && isSubDevice(device)) {
            console.log("SubDevice found:", device.name, device.id);
            clearTimeout(timeoutId);

            bleManager.stopDeviceScan();
            setFoundDevice(device);
            setScanState("found");
          }
        },
      );
    } catch (err) {
      console.error("Scanning error:", err);
      setScanState("error");
      setErrorMessage("Xəta baş verdi");
    }
  };

  const startScanning = async () => {
    try {
      if (mockMode) {
        await mockScanning();
      } else {
        await realScanning();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRetry = () => {
    handleReset();
  };

  // Success - add device name və ya valve
  const handleContinue = () => {
    if (!deviceName.trim()) {
      Alert.alert("Xəta", "Subcihaz adı daxil edin");
      return;
    }

    if (onSaveSubDevice) {
      onSaveSubDevice(deviceName, valves);
    }

    // Parent-ə device məlumatını göndər
    if (foundDevice && onDeviceConnected) {
      onDeviceConnected(foundDevice);
    }

    setScanState("addSensor");
    // Növbəti addım - valve əlavə et və ya close
    // onClose();
    // və ya növbəti modal açın
  };

  const handleSkip = () => {
    onClose();
  };

  const handleAddNewValve = () => {
    setEditingValve(null);
    setValveName("");
    setSelectedValve("");
    setShowValveModal(true);
  };

  const addNewValve = () => {
    if (!valveName || !selectedValve) return;

    const payload: Valve = {
      id: Date.now(),
      valve: selectedValve,
      name: valveName,
    };

    setValves((prev) => [...prev, payload]);

    // reset
    setValveName("");
    setSelectedValve("");
    setShowValveModal(false);
  };

  // Valve update et
  const updateValve = () => {
    if (!valveName || !selectedValve || !editingValve) return;

    setValves((prev) =>
      prev.map((valve) =>
        valve.id === editingValve.id
          ? { ...valve, valve: selectedValve, name: valveName }
          : valve,
      ),
    );

    // reset
    setValveName("");
    setSelectedValve("");
    setEditingValve(null);
    setShowValveModal(false);
  };

  const handleCloseModal = () => {
    setValveName("");
    setSelectedValve("");
    setEditingValve(null);
    setShowValveModal(false);
  };

  const handleEditValve = (valve: Valve) => {
    setEditingValve(valve);
    setValveName(valve.name);
    setSelectedValve(valve.valve);
    setShowValveModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDeleteId !== null) {
      setValves((prev) => prev.filter((data) => data.id !== selectedDeleteId));
      setSelectedDeleteId(null);
    }
  };

  const handleDeleteValve = (id: number) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={onClose}
        >
          <Pressable style={styles.overlay} onPress={onClose}>
            <Pressable
              style={styles.container}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.handle} />

              <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                  <BackIcon />
                </TouchableOpacity>
              </View>

              {mockMode && (
                <View style={styles.mockBadge}>
                  <Text style={styles.mockBadgeText}>TEST MODE</Text>
                </View>
              )}

              {scanState === "idle" && (
                <View style={styles.contentWrapper}>
                  <Image source={FirstLogo} style={styles.logo} />
                  <View style={styles.content}>
                    <Text style={styles.contentTitle}>
                      Subcihazı qoşmağa hazırlaşın
                    </Text>
                    <Text style={styles.contentSubTitle}>
                      Subcihazı qoşmaq üçün aşağıdakı addımları yerinə yetirin.
                    </Text>
                  </View>
                  <View style={styles.stepsContainer}>
                    <Text style={styles.stepHeader}>Addımlar</Text>
                    <Text style={styles.stepText}>
                      1. Subcihazı enerji mənbəyinə qoşun.
                    </Text>
                    <Text style={styles.stepText}>
                      2. Cihazın üzərindəki düyməni işıq yanıb-sönənə qədər
                      sıxılı saxlayın.
                    </Text>
                    <Text style={styles.stepText}>
                      3. Hazır olduqda aşağıdakı düymə ilə axtarışı başladın.
                    </Text>
                  </View>
                  <View style={styles.btnContainer}>
                    <CustomAddButton
                      text="Axtarışı başlat"
                      size="l"
                      onClick={startScanning}
                    />
                  </View>
                </View>
              )}

              {/* SCANNING STATE */}
              {scanState === "scanning" && (
                <View style={styles.contentWrapper}>
                  <Image source={SecondLogo} style={styles.logo} />
                  <View style={styles.content}>
                    <Text style={styles.contentTitle}>
                      Subcihaz axtarılır...
                    </Text>
                    <Text style={styles.contentSubTitle}>
                      Ətrafda qoşulmağa hazır subcihazlar yoxlanılır. Cihazın
                      üzərindəki düymə yanıb-sönürsə, qısa müddətdə tapılacaq.
                    </Text>
                  </View>

                  <View style={styles.btnContainer}>
                    <CustomAddButton
                      text="Axtarışı dayandır"
                      size="l"
                      onClick={stopScanning}
                      type="secondary"
                    />
                  </View>
                </View>
              )}

              {/* FOUND STATE */}
              {scanState === "found" && (
                <View style={styles.contentWrapper}>
                  <Image source={SuccessLogo} style={styles.logo} />
                  <View style={styles.content}>
                    <Text style={styles.contentTitle}>
                      Subcihaz uğurla qoşuldu
                    </Text>
                    <Text style={styles.contentSubTitle}>
                      Cihazı asan tapmaq və idarə etmək üçün ad yazın. İstəsəniz
                      sonra dəyişə bilərsiniz.
                    </Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Subcihaz adı</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Subcihaz adı daxil edin"
                      placeholderTextColor="#A0A8B0"
                      value={deviceName}
                      onChangeText={setDeviceName}
                      autoFocus
                    />
                  </View>

                  <View style={styles.btnContainer}>
                    <CustomAddButton
                      text="Davam et"
                      size="l"
                      onClick={handleConnect}
                    />
                  </View>
                </View>
              )}

              {/* CONNECTING STATE */}
              {scanState === "connecting" && (
                <View style={styles.stateContainer}>
                  <View style={styles.loadingSpinner}>
                    <Text style={styles.loadingDots}>⋯</Text>
                  </View>
                  <Text style={styles.stateTitle}>Qoşulur...</Text>
                </View>
              )}

              {/* CONNECTED STATE */}
              {scanState === "connected" && (
                <View style={styles.contentWrapper}>
                  <Image source={SuccessLogo} style={styles.logo} />
                  <View style={styles.content}>
                    <Text style={styles.contentTitle}>
                      Subcihaz uğurla qoşuldu!
                    </Text>
                    <Text style={styles.contentSubTitle}>
                      Artıq bu subcihaz üçün klapanların hansı valve-lərə bağlı
                      olduğunu seçə bilərsiniz.
                    </Text>
                  </View>

                  <CommonValveCard
                    valves={valves}
                    onEditValve={handleEditValve}
                    onDeleteValve={handleDeleteValve}
                    onAddValve={handleAddNewValve}
                  />

                  {/* <TouchableOpacity
                    style={styles.addValveBtn}
                    onPress={handleAddNewValve}
                  >
                    <PlusIcon />
                    <Text style={styles.addValveBtnText}>Klapan əlavə et</Text>
                  </TouchableOpacity> */}

                  <View style={styles.btnContainer}>
                    <CustomAddButton
                      text="Davam et"
                      size="l"
                      onClick={handleContinue}
                      disabled={valves.length === 0}
                    />
                  </View>
                </View>
              )}

              {scanState === "addSensor" && (
                <View style={styles.addSensorContainer}>
                  <AddSensorsToSubdevice onClose={() => setScanState("idle")} />
                </View>
              )}

              {/* ERROR STATE */}
              {scanState === "error" && (
                <View style={styles.contentWrapper}>
                  <Image source={ErrorLogo} style={styles.logo} />
                  <View style={styles.content}>
                    <Text style={styles.contentTitle}>Subcihaz tapılmadı</Text>
                    <Text style={styles.contentSubTitle}>
                      Cihazın enerji mənbəyinə qoşulduğundan və ya yenidən cəhd
                      edin.
                    </Text>
                  </View>

                  <View style={styles.btnContainer}>
                    <CustomAddButton
                      text="Yenidən axtar"
                      size="l"
                      onClick={handleRetry}
                    />
                    <TouchableOpacity
                      style={styles.skipBtn}
                      onPress={handleSkip}
                    >
                      <Text style={styles.skipBtnText}>Sonra</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <AddValveModal
                visible={showValveModal}
                onClose={handleCloseModal}
                valveName={valveName}
                setValveName={setValveName}
                selectedValve={selectedValve}
                setSelectedValve={setSelectedValve}
                onAdd={editingValve ? updateValve : addNewValve}
                isEdit={!!editingValve}
              />
              <CommonConfirmModal
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onFinish={handleDeleteConfirm}
                text="Klapanı silmək istədiyinizdən əminsiniz?"
                desc="Bu klapan və seçilmiş valve portu əlaqəsi silinəcək. Sonra yenidən əlavə edə bilərsiniz."
                type="valve"
              />
            </Pressable>
          </Pressable>
        </Modal>
      </GestureHandlerRootView>
    </>
  );
};

export default AddSubDeviceModal;

const styles = StyleSheet.create({
  mockBadge: {
    position: "absolute",
    top: 60,
    right: 24,
    backgroundColor: "#FFA500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 999,
  },
  mockBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 20,
  },

  addSensorContainer: {
    flex: 1,
    padding: 0,
  },
  logo: {
    alignSelf: "center",
    marginBottom: 20,
  },
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  loadingDots: {
    fontSize: 48,
    color: "#0069FE",
  },
  stateTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
    marginBottom: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#F5F7FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    flex: 1,
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
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    marginVertical: 24,
  },
  contentTitle: {
    color: "#0E121B",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  contentSubTitle: {
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepHeader: {
    color: "#0E121B",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  stepText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0E121B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0E121B",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  btnContainer: {
    marginTop: "auto",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 12,
  },
  skipBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#717784",
  },

  addValveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  addValveBtnText: {
    fontSize: 16,
    color: "#0069FE",
    fontWeight: "500",
    marginLeft: 6,
  },

  valveCards: {
    marginBottom: 16,
  },
  valveCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minHeight: 70,
  },
  valveCardContent: {
    flex: 1, // ƏLAVƏ
  },
  valveTitle: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "500",
  },
  valveSubtitle: {
    marginTop: 6,
    color: "#717784",
    fontSize: 12,
    fontWeight: "400",
  },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignSelf: "stretch",
    height: 70,
  },

  valveScrollContainer: {
    maxHeight: 300, // ✅ ƏLAVƏ
    marginBottom: 16,
  },

  emptyText: {
    textAlign: "center",
    color: "#717784",
    fontSize: 14,
    paddingVertical: 40,
  },
});
