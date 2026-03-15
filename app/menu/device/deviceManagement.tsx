import PlusIcon from "@/assets/icons/home/add-device/plus-line.svg";
import ValveIcon from "@/assets/icons/menu/device/valve-line.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import { DeviceLocationText } from "@/components/deviceLocation/DeviceLocation";
import BleScanModal from "@/components/home/bleScan/BleScanModal";
import ManualQr from "@/components/home/ManualQr/ManualQr";
import Permission from "@/components/home/Permission/Permission";
import QrScannerComponent from "@/components/home/QrScanner/QrScanner";
import { useGetAllMainQuery } from "@/services/devices/deviceApi";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";

import {
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const Logo = require("@/assets/images/home/logo.png");

const DeviceManagement = () => {
  const router = useRouter();

  const { data } = useGetAllMainQuery();

  const [showPermission, setShowPermission] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [manualVisible, setManualVisible] = useState(false);
  const [bleScanVisible, setBleScanVisible] = useState(false);

  const checkPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      const cameraGranted = status === "granted";

      if (Platform.OS === "ios") {
        return cameraGranted;
      }

      if (Platform.Version >= 31) {
        const scan = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        const connect = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        return cameraGranted && scan && connect;
      } else {
        const location = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return cameraGranted && location;
      }
    } catch {
      return false;
    }
  };

  const handleAddDevicePress = async () => {
    const alreadyGranted = await checkPermissions();

    if (alreadyGranted) {
      setQrScannerVisible(true);
    } else {
      setShowPermission(true);
    }
  };

  const handlePermissionsGranted = () => {
    setShowPermission(false);
    setTimeout(() => {
      setQrScannerVisible(true);
    }, 300);
  };

  const handleQrScanned = (data: string) => {
    console.log("✅ QR scanned:", data);
    setQrCode(data); // kodu saxla
    setQrScannerVisible(false); // ✅ qr bağla

    // ✅ Kiçik delay - modal-ların smooth açılması üçün
    setTimeout(() => {
      setManualVisible(true); // manual aç
    }, 300);
  };

  return (
    <View style={styles.devices}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <Text
            style={[styles.headerText, data?.length === 0 && { width: "100%" }]}
          >
            Cihazlar
          </Text>
          {data?.length > 0 && (
            <TouchableOpacity onPress={handleAddDevicePress}>
              <PlusIcon />
            </TouchableOpacity>
          )}
        </View>

        {data?.length === 0 && (
          <View style={styles.addDeviceContainer}>
            <Image source={Logo} />
            <Text style={styles.addDeviceText}>
              QR kodu skan edin və suvarma cihazınızı tətbiqə qoşun
            </Text>
            <TouchableOpacity
              style={styles.addDeviceBtn}
              onPress={handleAddDevicePress}
            >
              <Text style={styles.addDeviceBtnText}>Cihaz əlavə et</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.deviceContainer}>
          {data?.map((device, i) => (
            <TouchableOpacity
              style={[styles.deviceCard, i !== 0 && { marginTop: 12 }]}
              key={device._id}
              onPress={() => {
                router.push({
                  pathname: "/menu/device/deviceDetails",
                  params: {
                    device: JSON.stringify(device),
                  },
                });
              }}
            >
              <View style={styles.deviceName}>
                <Text>{device.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <Text
                    style={[
                      styles.dot,
                      device?.connect ? styles.connect : styles.noConnect,
                    ]}
                  /> */}
                  {/* <Text
                    style={[
                      styles.deviceNameText,
                      device.connect
                        ? { color: "#00AB1C" }
                        : { color: "#717784" },
                    ]}
                  >
                    {device?.connect ? "Əlaqə var" : "Əlaqə yoxdur"}
                  </Text> */}
                </View>
              </View>
              <View style={{ marginVertical: 8 }}>
                <Text style={styles.locationText}>
                  <DeviceLocationText
                    lat={device.location?.lat}
                    lng={device.location?.lng}
                  />
                  {/* {device.weather} / {device.location} */}
                  {/* {device.location} */}
                </Text>
              </View>
              <View style={styles.devicesContainer}>
                <View style={styles.valveContainer}>
                  <ValveIcon />
                  <Text style={styles.valveCountText}>
                    {device.valvePortCount} klapan{" "}
                  </Text>
                </View>
                {/* {device.subDeviceCount && (
                  <View style={[styles.valveContainer, { marginLeft: 20 }]}>
                    <RouterIcon />
                    <Text style={styles.valveCountText}>
                      {device.subDeviceCount} subcihaz{" "}
                    </Text>
                  </View>
                )} */}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Permission
        visible={showPermission}
        onClose={() => setShowPermission(false)}
        onPermissionsGranted={handlePermissionsGranted}
      />

      <QrScannerComponent
        visible={qrScannerVisible}
        onCancel={() => setQrScannerVisible(false)}
        onScanned={handleQrScanned}
        openManualCode={() => {
          setQrScannerVisible(false);
          setManualVisible(true);
        }}
      />
      <ManualQr
        visible={manualVisible}
        onCancel={() => setManualVisible(false)}
        openQrScanner={() => {
          setManualVisible(false);
          setQrScannerVisible(true);
        }}
        onOpenBleScan={(code) => {
          // ✅
          setQrCode(code);
          setBleScanVisible(true);
        }}
        initialValue={qrCode}
      />

      <BleScanModal
        visible={bleScanVisible}
        qrCode={qrCode}
        onCancel={() => setBleScanVisible(false)}
        onManualOpen={() => {
          setBleScanVisible(false);
          setManualVisible(true);
        }}
      />
    </View>
  );
};

export default DeviceManagement;

const styles = StyleSheet.create({
  devices: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    marginVertical: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    // width: "100%",
    textAlign: "center",
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 600,
  },

  addDeviceContainer: {
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 72,
    paddingHorizontal: 70,
    height: "80%",
  },
  addDeviceText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 16,
  },
  addDeviceBtn: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#0069FE",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  addDeviceBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  deviceContainer: {
    marginTop: 20,
  },

  deviceCard: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },

  deviceName: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dot: {
    height: 6,
    width: 6,
    backgroundColor: "#00AB1C",
    borderRadius: 100,
  },

  connect: {
    backgroundColor: "#00AB1C",
  },
  noConnect: {
    backgroundColor: "#717784",
  },

  deviceNameText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 500,
  },

  locationText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 500,
  },

  devicesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  valveContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  valveCountText: {
    marginLeft: 6,
  },
});
