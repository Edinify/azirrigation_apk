import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { getBleManager } from "@/utils/bleManeger";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import HumiditySensor from "@/assets/icons/home/add-device/sensors/Humidity_sensor.svg";

import PauseIcon from "@/assets/icons/menu/sensors/pause-solid.svg";

import PlayIcon from "@/assets/icons/menu/sensors/play-solid.svg";
import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import CommonSensorModal from "@/components/commonComponents/CommonSensorModal/CommonSensorModal";
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { Device } from "react-native-ble-plx";
import {
  useAddLevelSensorMutation,
  useAddMainFlowSensorMutation,
  useAddSubFlowSensorMutation,
  useDeleteLevelSensorMutation,
  useDeleteMainFlowSensorMutation,
  useGetAllDevicesByDeviceIdForFlowSensorQuery,
  useGetAllValvesByDeviceIdForFlowSensorQuery,
} from "@/services/devices/deviceApi";
import { useSelector } from "react-redux";

const FLowSensor = require("@/assets/images/home/sensors/flow_sensor/flow_sensor.png");
const FlowSensorTesting = require("@/assets/images/home/sensors/flow_sensor/flow_sensor_testing.png");
const FlowSensorSuccess = require("@/assets/images/home/sensors/flow_sensor/flow_sensor_success.png");
const FlowSensorFailed = require("@/assets/images/home/sensors/flow_sensor/flow_sensor_failed.png");

const PressureSensor = require("@/assets/images/home/sensors/pressure_sensor/pressure_sensor.png");
const PressureSuccess = require("@/assets/images/home/sensors/pressure_sensor/pressure_sensor_success.png");
const PressureFailed = require("@/assets/images/home/sensors/pressure_sensor/pressure_sensor_failed.png");
const PressureTesting = require("@/assets/images/home/sensors/pressure_sensor/Gauge.png");

const LevelSensor = require("@/assets/images/home/sensors/level_sensor/level_sensor.png");
const LevelSensorTesting = require("@/assets/images/home/sensors/level_sensor/level_sensor_testing.png");
const LevelSensorSuccess = require("@/assets/images/home/sensors/level_sensor/level_sensor_success.png");

type ScanState =
  | "idle"
  | "testing"
  | "addTesting"
  | "addValves"
  | "selectDevice"
  | "success"
  | "failed"
  | "error";

interface Valve {
  id: string;
  name: string;
}

interface ValveGroup {
  deviceName: string;
  valves: Valve[];
}

const SensorDetails = () => {
  const router = useRouter();

  const { name, key, id, status, desc, type } = useLocalSearchParams<{
    name: string;
    key: string;
    id: string;
    status: string;
    desc: string;
    type: string;
  }>();

  const sensorKey = key.split("_")[0];

  // console.log(sensorKey, "key");

  const mockMode = true; // false edin real test üçün

  const { deviceId, bleDeviceId } = useSelector((state) => state.deviceForm);

  const { data: allValvesForFlowSensor } =
    useGetAllValvesByDeviceIdForFlowSensorQuery({ mainDeviceId: deviceId });

  console.log(allValvesForFlowSensor, "all valves for flow ");

  const [scanState, setScanState] = useState<ScanState>("idle");

  const scanStateRef = useRef<ScanState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState<any>(null);

  const { data: allDevicesForFlowSensor } =
    useGetAllDevicesByDeviceIdForFlowSensorQuery({ mainDeviceId: deviceId });

  const [addSubFlowSensor] = useAddSubFlowSensorMutation();

  const [addLevelSensor] = useAddLevelSensorMutation();
  const [addMainFlowSensor] = useAddMainFlowSensorMutation();
  const [deleteMainFlowSensor] = useDeleteMainFlowSensorMutation();
  const [deleteLevelSensor] = useDeleteLevelSensorMutation();
  const handleSensorDelete = async () => {
    try {
      if (sensorKey === "flow") {
        await deleteMainFlowSensor({ mainDeviceId: deviceId }).unwrap();
        // setShowDeleteModal(false);
        router.push("/menu/device/sensors/sensors");
      } else if (sensorKey === "level") {
        await deleteLevelSensor({ mainDeviceId: deviceId }).unwrap();
        // setShowDeleteModal(false);
        setScanState("idle");
        router.push("/menu/device/sensors/sensors");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [humiditySensorName, setHumiditySensorName] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedSubDevice, setSelectedSubDevice] = useState<any>(null);

  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const [selectedValves, setSelectedValves] = useState<string[]>([]);
  const [selectedValve, setSelectedValve] = useState<string | null>(null);

  const handleSelectValve = (valveId: string) => {
    setSelectedValve((prev) => (prev === valveId ? null : valveId));
  };

  console.log(selectedValve, "selected valve");

  const [showSensorModal, setShowSensorModal] = useState(false);

  // const {data} = useGet

  // ✅ Mock data - real data-nı props və ya API-dən alacaqsınız
  // const valveGroups: ValveGroup[] = [
  //   {
  //     deviceName: "Əsas cihaz",
  //     valves: [
  //       { id: "v1", name: "Ağaclar" },
  //       { id: "v2", name: "Çiçəklər" },
  //       { id: "v3", name: "Nar" },
  //       { id: "v4", name: "Ərik" },
  //       { id: "v5", name: "Alma" },
  //     ],
  //   },
  //   {
  //     deviceName: "Subcihaz - Anbar tərəf",
  //     valves: [
  //       { id: "v6", name: "Üzüm" },
  //       { id: "v7", name: "Ağaclar" },
  //     ],
  //   },
  // ];

  // const toggleValve = (valveId: string) => {
  //   setSelectedValves((prev) => {
  //     if (prev.includes(valveId)) {
  //       // Deselect
  //       return prev.filter((id) => id !== valveId);
  //     } else {
  //       // Select
  //       return [...prev, valveId];
  //     }
  //   });
  // };

  const subDevices = [
    {
      id: 1,
      name: "Kanalın yanı",
      key: "subdevice_1",
    },
    {
      id: 2,
      name: "Anbar tərəf",
      key: "subdevice_2",
    },
    {
      id: 3,
      name: "Yol qırağı",
      key: "subdevice_3",
    },
  ];

  const scanningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bleManager = getBleManager();

  const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
  const UART_RX_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; // Telefon → Cihaz
  const UART_TX_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"; // Cihaz → Telefon

  useEffect(() => {
    scanStateRef.current = scanState;
  }, [scanState]);

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

  const connectAndTestSensor = async (device: Device) => {
    try {
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);

      // ✅ Əvvəlcə dinlə, sonra göndər
      device.monitorCharacteristicForService(
        UART_SERVICE_UUID,
        UART_TX_UUID,
        (error, characteristic) => {
          if (error) {
            // ✅ Disconnect xətasını ignore et — cavab gəlibsə OK-dır
            if (error.message?.includes("disconnected")) {
              console.log("⚠️ Cihaz disconnect oldu — normal ola bilər");
              return;
            }
            setScanState("failed");
            return;
          }
          if (characteristic?.value) {
            const decoded = atob(characteristic.value)
              .replace(/\0/g, "")
              .trim();
            console.log("✅ Sensor cavabı:", decoded);
            try {
              const parsed = JSON.parse(decoded);
              if (parsed.ok === true || parsed.status === "ok") {
                setSensorData(parsed);
                setScanState("success");
              } else {
                setScanState("failed");
                setErrorMessage("Sensor test uğursuz oldu");
              }
            } catch {
              setSensorData(decoded);
              setScanState("success");
            }
          }
        },
      );

      // ✅ Sonra göndər
      const testPayload = JSON.stringify({ status: "test", sensor: sensorKey });
      await device.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_RX_UUID,
        btoa(testPayload),
      );
      console.log("✅ Test komandası göndərildi:", testPayload);
    } catch (err) {
      console.error("Connection error:", err);
      setScanState("failed");
      setErrorMessage("Sensora qoşulma uğursuz oldu");
    }
  };

  // Mock sensor test
  const mockSensorTest = async () => {
    console.log("Mock sensor test started");
    setScanState("testing");
    setErrorMessage("");

    // 30 saniyə timeout
    scanningTimeoutRef.current = setTimeout(() => {
      if (scanStateRef.current === "testing") {
        setScanState("failed");
        setErrorMessage("Sensor cavab vermir. Qoşulmanı yoxlayın.");
      }
    }, 30000);

    // 3-7 saniyə test
    const testDuration = 3000 + Math.random() * 4000;
    await new Promise((resolve) => setTimeout(resolve, testDuration));

    const isSuccess = Math.random() > 0.3; // 70% success

    if (scanStateRef.current === "testing") {
      if (scanningTimeoutRef.current) {
        clearTimeout(scanningTimeoutRef.current);
      }

      if (isSuccess) {
        setScanState("success");
        setSensorData({ flowRate: 2.5, temperature: 22 }); // Mock data
        console.log("Sensor test successful");
      } else {
        setScanState("failed");
        setErrorMessage(
          "Sensor cavab vermir. Qoşulmanı yoxlayın və ya kabel zədələnib.",
        );
      }
    }
  };

  // ✅ Real sensor test
  const realSensorTest = async () => {
    try {
      const hasPermissions = await requestBluetoothPermissions();
      if (!hasPermissions) {
        setScanState("failed");
        setErrorMessage("Bluetooth icazəsi verilmədi");
        return;
      }

      const isBluetoothOn = await checkBluetoothState();
      if (!isBluetoothOn) {
        setScanState("failed");
        return;
      }

      setScanState("testing");
      setErrorMessage("");

      // ✅ bleDeviceId istifadə et
      if (!bleDeviceId) {
        setScanState("failed");
        setErrorMessage("Cihaz tapılmadı");
        return;
      }

      console.log("🔗 Birbaşa qoşulur:", bleDeviceId);
      const connected = await bleManager.connectToDevice(bleDeviceId, {
        timeout: 10000,
      });
      await connectAndTestSensor(connected);
    } catch (err) {
      setScanState("failed");
      setErrorMessage("Xəta baş verdi");
    }
  };

  const handleAddSensor = () => {
    if (type === "device") {
      setScanState("addTesting");
      return;
    }
    if (key === "flow_sensor" || key === "humidity_sensor") {
      setScanState("selectDevice");
    } else {
      setScanState("addTesting");
    }
  };

  const handleAddTesting = () => {
    setScanState("addTesting");
  };

  const startTest = async () => {
    try {
      if (mockMode) {
        await mockSensorTest();
      } else {
        await realSensorTest();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stopTest = () => {
    if (scanningTimeoutRef.current) {
      clearTimeout(scanningTimeoutRef.current);
    }

    if (!mockMode) {
      bleManager.stopDeviceScan();
    }

    if (connectedDevice) {
      connectedDevice.cancelConnection();
    }

    setScanState("idle");
    setConnectedDevice(null);
    setSensorData(null);
    console.log("Test stopped by user");
  };

  const handleRetry = () => {
    setScanState("idle");
    setErrorMessage("");
    setConnectedDevice(null);
    setSensorData(null);
  };

  console.log(selectedValve, "selected valve");

  const handleFinish = async () => {
    try {
      if (!connectedDevice) {
        console.log("Qoşulu cihaz yoxdur");
        router.back();
        return;
      }

      const payload = {
        deviceId,
        status: "test",
        subDeviceId: selectedSubDevice ?? 0,
        sensorName: humiditySensorName || sensorKey,
      };

      const jsonString = JSON.stringify(payload);
      const base64Data = btoa(jsonString); // ✅ string → base64

      await connectedDevice.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_RX_UUID,
        base64Data,
      );

      console.log("✅ BLE data göndərildi:", payload);

      if (sensorKey === "level") {
        await addLevelSensor({ mainDeviceId: deviceId }).unwrap();
      } else if (sensorKey === "flow" && selectedDevice.deviceType === "main") {
        await addMainFlowSensor({
          mainDeviceId: deviceId,
          body: {
            isConnected: true,
            relatedValve: {
              subDeviceId: 0,
              valveId: selectedValve,
            },
          },
        }).unwrap();
      } else if (sensorKey === "flow" && selectedDevice.deviceType === "sub") {
        await addSubFlowSensor({
          mainDeviceId: deviceId,
          subDeviceId: selectedDevice._id,
        });
      }

      connectedDevice.cancelConnection();
      router.push("/menu/device/sensors/sensorDetails");
    } catch (error) {
      console.log("BLE write error:", error);
      router.back();
      // router.push("/menu/device/sensors/sensorDetails");
    }
  };

  const handleAddValve = () => {
    setScanState("addValves");
  };

  const sensorImages = {
    flow_sensor: {
      idle: FLowSensor,
      testing: FlowSensorTesting,
      success: FlowSensorSuccess,
      failed: FlowSensorFailed,
      addValves: FlowSensorSuccess,
    },
    level_sensor: {
      idle: LevelSensor,
      testing: LevelSensorTesting,
      addTesting: LevelSensorTesting,
      success: LevelSensorSuccess,
      // failed: LevelSensorFailed,
    },
    pressure_sensor: {
      idle: PressureSensor,
      testing: FlowSensorTesting,
      success: PressureSuccess,
      failed: PressureFailed,
    },
    humidity_sensor: {
      idle: HumiditySensor,
      testing: HumiditySensor,
      success: HumiditySensor,
      failed: HumiditySensor,
    },
  };

  const getSensorImage = () => {
    return (
      sensorImages[key]?.[scanState] || sensorImages[key]?.idle || FLowSensor
    );
  };

  useEffect(() => {
    if (scanState === "success" && key === "flow_sensor") {
      const timer = setTimeout(() => {
        setScanState("addValves");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [scanState, key]);

  return (
    <View style={styles.devices}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
        </View>

        {/* IDLE STATE */}
        {scanState === "idle" && (
          <View style={styles.contentWrapper}>
            <View style={styles.imageContainer}>
              {key === "humidity_sensor" ? (
                <HumiditySensor width={200} height={120} />
              ) : (
                <Image source={getSensorImage()} style={styles.sensorImage} />
              )}
            </View>

            <View style={styles.sensorContent}>
              <Text style={styles.titleText}>
                {name} qoşulub{status === "not_added" ? " ?" : ""}
              </Text>
              <Text style={styles.descText}>
                {status === "added"
                  ? desc
                  : key === "level_sensor"
                    ? "Sensor qoşulubsa davam edin. Növbəti addımda onu test edib işlədiyini təsdiqləyəcəyik."
                    : "Sensor yalnız qoşulu olduqda test edilə bilər. Zəhmət olmasa sensorun kabelinin cihazda düzgün qoşulduğunu yoxlayın."}
              </Text>
            </View>

            <View style={styles.sensorBtnContainer}>
              {status === "added" ? (
                <View style={styles.addedBtnContainer}>
                  <CustomAddButton
                    size="l"
                    text="Sensoru test et"
                    onClick={startTest}
                  />
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => setShowDeleteModal(true)}
                  >
                    <Text style={styles.deleteBtnText}>Sensoru sil</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.notAddedBtnContainer}>
                  <CustomAddButton
                    text="Xeyr qoşulmayıb"
                    type="secondary"
                    size="l"
                    onClick={() => setShowSensorModal(true)}
                  />

                  <View style={{ marginLeft: 12 }}>
                    <CustomAddButton
                      size="l"
                      text="Bəli, qoşulub"
                      onClick={handleAddSensor}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {scanState === "testing" && (
          <View style={styles.contentWrapper}>
            {key === "humidity_sensor" ? (
              <>
                <View style={styles.imageContainer}>
                  {key === "humidity_sensor" ? (
                    <HumiditySensor width={200} height={120} />
                  ) : (
                    <Image
                      source={getSensorImage()}
                      style={styles.sensorImage}
                    />
                  )}
                </View>
                <View style={styles.sensorContent}>
                  <Text style={styles.titleText}>Yoxlanılır…</Text>
                  <Text style={styles.descText}>
                    Sensorun seçilən subcihaza qoşulu olub-olmadığı yoxlanılır.
                  </Text>
                </View>
              </>
            ) : (
              <>
                {key === "pressure_sensor" ? (
                  <View style={styles.pressureTestingImgContainer}>
                    <Image source={PressureTesting} />
                    <View style={styles.pressureValueContainer}>
                      <Text style={styles.pressureValue}>
                        2747 <Text style={styles.pressureUnit}>Pa</Text>
                      </Text>
                      <Text style={styles.pressureText}>Suyun təzyiqi</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.imageContainer}>
                    <Image source={getSensorImage()} />
                  </View>
                )}

                <View style={styles.sensorContent}>
                  <Text style={styles.titleText}>Test gedir...</Text>
                  <Text style={styles.descText}>
                    {key === "flow_sensor"
                      ? "Su axını olduqda nəticə avtomatik çıxacaq."
                      : key === "pressure_sensor"
                        ? "Təzyiq olduqda nəticə avtomatik çıxacaq."
                        : "Sensor axtarılır və test olunur..."}
                  </Text>
                </View>

                <View style={styles.sensorBtnContainer}>
                  <TouchableOpacity style={styles.stopBtn} onPress={stopTest}>
                    <PauseIcon />
                    <Text style={styles.stopBtnText}>Dayandır</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {scanState === "selectDevice" && (
          <View style={styles.contentWrapper}>
            <View style={styles.pressureTestingImgContainer}>
              <View style={styles.imageContainer}>
                {key === "humidity_sensor" ? (
                  <HumiditySensor width={200} height={120} />
                ) : (
                  <Image source={getSensorImage()} style={styles.sensorImage} />
                )}
              </View>
            </View>

            <View style={styles.sensorContent}>
              <Text style={styles.titleText}>
                {key === "humidity_sensor"
                  ? "Qoşulduğu subcihazı seçin"
                  : "Qoşulduğu cihazı seçin"}
              </Text>
              <Text style={styles.descText}>
                {key === "humidity_sensor"
                  ? "Rütubət sensorunun qoşulduğu subcihazı seçin."
                  : "Su axını sensorunun qoşulduğu cihazı seçin."}
              </Text>
              {key === "humidity_sensor" && (
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {subDevices.map((data) => (
                    <TouchableOpacity
                      key={data.id}
                      style={[
                        styles.subDeviceCard,
                        selectedSubDevice === data.key ? styles.active : "",
                      ]}
                      onPress={() => setSelectedSubDevice(data.key)}
                    >
                      <Text style={styles.subDeviceText}>{data.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {key === "flow_sensor" && (
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {allDevicesForFlowSensor.map((data) => (
                    <TouchableOpacity
                      key={data._id}
                      style={[
                        styles.subDeviceCard,
                        selectedDevice?.name === data?.name
                          ? styles.active
                          : "",
                      ]}
                      onPress={() => setSelectedDevice(data)}
                    >
                      <Text style={styles.subDeviceText}>{data.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.sensorBtnContainer}>
              {key === "flow_sensor" ? (
                <CustomAddButton
                  size="l"
                  text="Davam et"
                  addDisabled={selectedDevice === null}
                  onClick={handleAddTesting}
                />
              ) : (
                <CustomAddButton
                  size="l"
                  text={
                    key === "level_sensor"
                      ? "Təsdiqlə və əlavə et"
                      : key === "humidity_sensor"
                        ? "Davam et"
                        : "Testi başlat"
                  }
                  onClick={startTest}
                />
              )}
            </View>
          </View>
        )}

        {scanState === "addTesting" && (
          <View style={styles.contentWrapper}>
            <View style={styles.pressureTestingImgContainer}>
              <View style={styles.imageContainer}>
                {key === "humidity_sensor" ? (
                  <HumiditySensor width={200} height={120} />
                ) : (
                  <Image source={getSensorImage()} style={styles.sensorImage} />
                )}
              </View>
            </View>

            <View style={styles.sensorContent}>
              <Text style={styles.titleText}>
                {key === "humidity_sensor"
                  ? "Qoşulduğu subcihazı seçin"
                  : "Sensoru test edək"}
              </Text>
              <Text style={styles.descText}>
                {key === "flow_sensor"
                  ? "Test zamanı motor qısa müddət işə düşəcək. Su axını varsa sensor fırlanacaq və nəticə avtomatik təsdiqlənəcək."
                  : key === "pressure_sensor"
                    ? "Test zamanı motor qısa müddət işə düşəcək. Təzyiq varsa sensor bunu aşkar edəcək və nəticə avtomatik təsdiqlənəcək."
                    : key === "level_sensor"
                      ? "Sensoru yuxarı-aşağı hərəkət etdirin. Top kontakt nöqtəsinə dəyəndə siqnal alınacaq. Siqnal gəlməsə də, sensorun qoşulduğuna əminsinizsə təsdiqləyib əlavə edə bilərsiniz."
                      : key === "humidity_sensor"
                        ? "Rütubət sensorunun qoşulduğu subcihazı seçin."
                        : "Sensor axtarılır və test olunur..."}
              </Text>
            </View>

            <View style={styles.sensorBtnContainer}>
              <CustomAddButton
                size="l"
                text={
                  key === "level_sensor"
                    ? "Təsdiqlə və əlavə et"
                    : key === "humidity_sensor"
                      ? "Davam et"
                      : "Testi başlat"
                }
                onClick={startTest}
                icon={
                  key === "pressure_sensor" ||
                  (key === "flow_sensor" && <PlayIcon />)
                }
              />
            </View>
          </View>
        )}

        {/* SUCCESS STATE */}
        {scanState === "success" && (
          <View style={styles.contentWrapper}>
            {key === "humidity_sensor" ? (
              <>
                <View style={styles.imageContainer}>
                  {/* <Image source={getSensorImage()} /> */}
                  {key === "humidity_sensor" ? (
                    <HumiditySensor width={200} height={120} />
                  ) : (
                    <Image
                      source={getSensorImage()}
                      style={styles.sensorImage}
                    />
                  )}
                  <View style={styles.successIcon}>
                    <Text style={styles.successIconText}>✓</Text>
                  </View>
                </View>

                <View style={styles.sensorContent}>
                  <Text style={styles.titleText}>Sensor qoşulub</Text>
                  <Text style={styles.descText}>
                    Sensoru asan tapmaq və idarə etmək üçün ad yazın. İstəsəniz
                    sonra dəyişə bilərsiniz.
                  </Text>
                </View>

                <View style={styles.sensorInputContainer}>
                  <Text style={styles.sensorNameText}>Sensor adı</Text>
                  <TextInput
                    style={styles.sensorInput}
                    value={humiditySensorName}
                    onChangeText={setHumiditySensorName}
                    placeholder="Sensor adı"
                  />
                </View>

                <View style={styles.sensorBtnContainer}>
                  <CustomAddButton
                    size="l"
                    text="Davam et"
                    onClick={handleAddValve}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.imageContainer}>
                  {key === "humidity_sensor" ? (
                    <HumiditySensor width={200} height={120} />
                  ) : (
                    <Image
                      source={getSensorImage()}
                      style={styles.sensorImage}
                    />
                  )}
                  <View style={styles.successIcon}>
                    <Text style={styles.successIconText}>✓</Text>
                  </View>
                </View>

                <View style={styles.sensorContent}>
                  <Text style={styles.titleText}>
                    {key === "level_sensor"
                      ? "Siqnal alındı"
                      : key === "flow_sensor"
                        ? "Sensor işləyir"
                        : "Test uğurla tamamlandı"}
                  </Text>
                  <Text style={styles.descText}>
                    {key === "flow_sensor"
                      ? " Su axını aşkarlandı. Sensor normal işləyir."
                      : key === "pressure_sensor"
                        ? "Təzyiq aşkarlandı. Sensor normal işləyir."
                        : key === "level_sensor"
                          ? "Sensorun qoşulduğu təsdiqləndi."
                          : ""}
                  </Text>
                </View>

                {key !== "flow_sensor" && (
                  <View style={styles.sensorBtnContainer}>
                    <CustomAddButton
                      size="l"
                      text="Hazırdır"
                      onClick={handleFinish}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {scanState === "addValves" && (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentWrapper}>
              {/* Image */}
              <View style={styles.imageContainer}>
                {key === "humidity_sensor" ? (
                  <HumiditySensor width={200} height={120} />
                ) : (
                  <Image source={getSensorImage()} style={styles.sensorImage} />
                )}
              </View>

              {/* Header */}
              <View style={styles.sensorContent}>
                <Text style={styles.titleText}>
                  {key === "flow_sensor"
                    ? "Bağlı olduğu klapanı seçin"
                    : "Əlaqəli klapanları seçin"}
                </Text>
                <Text style={styles.descText}>
                  İndi sensorun hansı klapan(lar)a bağlı olduğunu seçin.
                </Text>
              </View>

              {/* ✅ Valve Groups */}

              {key === "flow_sensor" && (
                <TouchableOpacity
                  style={[
                    styles.valveCard,
                    { width: "40%", marginTop: 24, marginBottom: 20 },
                    selectedValve === "0" && styles.valveCardSelected, // ✅
                  ]}
                  onPress={() => handleSelectValve("0")}
                >
                  <Text
                    style={[
                      styles.valveText,
                      selectedValves.includes("0") && styles.valveTextSelected,
                    ]}
                  >
                    Ana xətt
                  </Text>
                </TouchableOpacity>
              )}

              {allValvesForFlowSensor?.map((valve) => (
                <View style={styles.valveGroupContainer} key={valve._id}>
                  <Text style={styles.groupTitle}>{valve.deviceName}</Text>
                  <View style={styles.valveGrid}>
                    <TouchableOpacity
                      style={[
                        styles.valveCard,
                        selectedValve === valve.valveId &&
                          styles.valveCardSelected,
                      ]}
                      onPress={() => handleSelectValve(valve.valveId)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.valveText,
                          selectedValve === valve.valveId &&
                            styles.valveTextSelected,
                        ]}
                      >
                        {valve.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* {allValvesForFlowSensor.map((group, groupIndex) => (
                <View key={groupIndex} style={styles.valveGroupContainer}>
                  <Text style={styles.groupTitle}>{group.deviceName}</Text>

                  {key === "flow_sensor" ? (
                    <View style={styles.valveGrid}>
                      {group.valves.map((valve) => (
                        <TouchableOpacity
                          key={valve.id}
                          style={[
                            styles.valveCard,
                            selectedValve === valve.id &&
                              styles.valveCardSelected,
                          ]}
                          onPress={() => handleSelectValve(valve.id)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.valveText,
                              selectedValve === valve.id &&
                                styles.valveTextSelected,
                            ]}
                          >
                            {valve.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.valveGrid}>
                      {group.valves.map((valve) => (
                        <TouchableOpacity
                          key={valve.id}
                          style={[
                            styles.valveCard,
                            selectedValves.includes(valve.id) &&
                              styles.valveCardSelected,
                          ]}
                          onPress={() => toggleValve(valve.id)}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.valveText,
                              selectedValves.includes(valve.id) &&
                                styles.valveTextSelected,
                            ]}
                          >
                            {valve.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))} */}

              <View style={styles.sensorBtnContainer}>
                <CustomAddButton
                  text="Tamamla"
                  onClick={handleFinish}
                  addDisabled={
                    key === "flow_sensor"
                      ? selectedValve === ""
                      : selectedValves.length === 0
                  }
                  size="l"
                />
              </View>
            </View>
          </ScrollView>
        )}

        {scanState === "failed" && (
          <View style={styles.contentWrapper}>
            <View style={styles.imageContainer}>
              {key === "humidity_sensor" ? (
                <HumiditySensor width={200} height={120} />
              ) : (
                <Image source={getSensorImage()} style={styles.sensorImage} />
              )}
            </View>

            <View style={styles.sensorContent}>
              <Text style={styles.titleText}>Test uğursuz oldu</Text>
              <Text style={styles.descText}>
                {errorMessage ||
                  "Sensor cavab vermir. Qoşulmanı və su axınını yoxlayın, sonra yenidən test edin."}
              </Text>
            </View>

            <View style={styles.sensorBtnContainer}>
              <CustomAddButton
                size="l"
                text="Yenidən test et"
                onClick={handleRetry}
              />
              <TouchableOpacity
                style={styles.laterBtn}
                onPress={() => router.back()}
              >
                <Text style={styles.laterBtnText}>Sonra</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <CommonConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        text="Sensoru silmək istədiyinizdən əminsiniz?"
        desc={
          key === "flow_sensor"
            ? "Bu sensor cihazdan silinəcək və su axını ilə bağlı nəzarət və xəbərdarlıqlar işləməyəcək."
            : key === "pressure_sensor"
              ? "Bu sensor silindikdən sonra suvarma zamanı təzyiqə nəzarət və təzyiq problemləri ilə bağlı xəbərdarlıqlar işləməyəcək."
              : key === "level_sensor"
                ? "Bu sensor silindikdən sonra hovuzda su qurtardıqda xəbərdarlıq alınmayacaq və suvarma su bitməsinə görə avtomatik dayandırılmayacaq."
                : ""
        }
        type="sensor"
        onFinish={handleSensorDelete}
      />
      <CommonSensorModal
        visible={showSensorModal}
        type={key}
        onClose={() => setShowSensorModal(false)}
      />
    </View>
  );
};

export default SensorDetails;

const styles = StyleSheet.create({
  devices: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    paddingTop: 32,
    paddingHorizontal: 16,
    flex: 1,
  },
  header: {
    marginVertical: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentWrapper: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 40,
  },

  spinnerOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    position: "absolute",
    backgroundColor: "#00AB1C",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  successIconText: {
    fontSize: 48,
    color: "white",
  },
  errorIcon: {
    position: "absolute",
    backgroundColor: "#EF4444",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  errorIconText: {
    fontSize: 48,
    color: "white",
  },
  sensorContent: {
    marginTop: 24,
  },
  titleText: {
    color: "#0E121B",
    fontSize: 24,
    fontWeight: "600",
  },
  descText: {
    marginTop: 8,
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  dataContainer: {
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  dataText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  sensorBtnContainer: {
    marginTop: "auto",
    paddingBottom: 40,
  },
  addedBtnContainer: {},
  notAddedBtnContainer: {
    flexDirection: "row",
  },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  deleteBtnText: {
    color: "#FE171B",
    fontSize: 16,
    fontWeight: "500",
  },
  stopBtn: {
    backgroundColor: "#FE171B",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  stopBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  laterBtn: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 12,
  },
  laterBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#717784",
  },

  pressureTestingImgContainer: {
    backgroundColor: "white",
    padding: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  pressureValueContainer: {
    marginTop: 16,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  pressureValue: {
    color: "#0E121B",
    fontSize: 32,
    fontWeight: 600,
  },

  pressureUnit: {
    color: "#717784",
    fontSize: 16,
    fontWeight: 500,
  },

  pressureText: {
    marginTop: 4,
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },

  //  humidity sensor

  subDeviceContainer: {
    marginTop: 24,
    marginBottom: 40,
  },

  subDeviceCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },

  subDeviceText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },

  active: {
    backgroundColor: "rgba(0, 105, 254, 0.10))",
    borderWidth: 1,
    borderColor: "#0069FE",
  },

  sensorInputContainer: {
    marginTop: 24,
  },

  sensorNameText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
  },

  sensorInput: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#0E121B",
    borderRadius: 16,
    marginTop: 8,
  },

  // ✅ Valve Groups
  valveGroupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#717784",
    marginBottom: 12,
  },
  valveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  valveCard: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    minWidth: "45%",
    alignItems: "center",
  },
  valveCardSelected: {
    backgroundColor: "#E3F2FD", // Açıq mavi
    borderColor: "#0069FE",
  },
  valveText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
  valveTextSelected: {
    color: "#0069FE",
  },

  finishBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  finishBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  finishBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
