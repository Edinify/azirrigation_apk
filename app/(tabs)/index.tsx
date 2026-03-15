import WifiIcon from "@/assets/icons/home/devices/wifi-line.svg";
import BellIcon from "@/assets/icons/home/header/bell.svg";
import DownArrowIcon from "@/assets/icons/home/header/down.svg";
import Illustration from "@/assets/icons/home/header/Illustration.svg";
import SearchIcon from "@/assets/icons/home/header/search.svg";
import BluetoothIcon from "@/assets/icons/home/permission/bluetooth-line.svg";
import SunnyIcon from "@/assets/icons/home/weather/sunny.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import DeviceListModal from "@/components/home/AddDevice/DeviceListModal/DeviceListModal";
import BleScanModal from "@/components/home/bleScan/BleScanModal";
import ManualQr from "@/components/home/ManualQr/ManualQr";
import Permission from "@/components/home/Permission/Permission";
import QrScannerComponent from "@/components/home/QrScanner/QrScanner";
import { ZoneCard } from "@/components/home/zoneControl/ZoneCard/ZoneCard";

import { setDeviceId } from "@/services/devices/deviceFormSlice";

import {
  useGetMainByIdQuery,
  useGetMainDropdownQuery,
} from "@/services/devices/deviceApi";
import { DeviceDropdownItem } from "@/types/device.types";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const Logo = require("@/assets/images/home/logo.png");

const WEATHER_API_KEY = "9f6378993c8050a4d21c24243ced35d3";

interface WeatherInfo {
  temp: number;
  description: string;
  windSpeed: number;
  rainProbability: number;
  icon: string;
  cityName: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const initialized = useRef(false);

  const { data: deviceList } = useGetMainDropdownQuery();

  const [selectedDevice, setSelectedDevice] =
    useState<DeviceDropdownItem | null>(null);
  const { data, error } = useGetMainByIdQuery(selectedDevice?.deviceId ?? "", {
    skip: !selectedDevice?.deviceId,
  });
  const [showPermission, setShowPermission] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [manualVisible, setManualVisible] = useState(false);
  const [bleScanVisible, setBleScanVisible] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    if (deviceList?.length && !selectedDevice) {
      setSelectedDevice(deviceList[0]);
    }
  }, [deviceList, selectedDevice]);

  useEffect(() => {
    // if (!data?.location?.lat || !data?.location?.lng) return;
    // if (data.location.lat === 0 && data.location.lng === 0) return;

    if (!data?.location) return;

    const fetchWeather = async () => {
      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${data.location.lat}&lon=${data.location.lng}&appid=${WEATHER_API_KEY}&units=metric&lang=az`,
        );
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${data.location.lat}&lon=${data.location.lng}&appid=${WEATHER_API_KEY}&units=metric&cnt=1`,
        );
        const forecastData = await forecastRes.json();

        const rainPop = forecastData?.list?.[0]?.pop ?? 0;

        setWeatherInfo({
          temp: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          windSpeed: Math.round(weatherData.wind.speed * 3.6),
          rainProbability: Math.round(rainPop * 100),
          icon: weatherData.weather[0].icon,
          cityName: weatherData.name,
        });
      } catch (error) {
        console.log("Weather error:", error);
      }
    };

    fetchWeather();
  }, [data?.location]);

  useEffect(() => {
    dispatch(setDeviceId(selectedDevice?.deviceId));
  }, [selectedDevice?.deviceId, dispatch]);

  const handleGuide = () => {
    router.push("/menu/guide");
  };

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
      // İcazələr artıq verilib - birbaşa QR scanner aç
      setQrScannerVisible(true);
    } else {
      // İcazələr yoxdur - Permission modal aç
      setShowPermission(true);
    }
  };

  // Permission modal-dan icazə verildikdən sonra
  const handlePermissionsGranted = () => {
    setShowPermission(false);
    setTimeout(() => {
      setQrScannerVisible(true);
    }, 300);
  };

  const handleQrScanned = (data: string) => {
    console.log("✅ QR scanned:", data);
    setQrCode(data);
    setQrScannerVisible(false);

    setTimeout(() => {
      setBleScanVisible(true);
    }, 300);
  };

  return (
    <ScrollView style={styles.homePage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.deviceName}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => setShowDeviceModal(true)}
            >
              <Text style={styles.deviceNameText}>{selectedDevice?.name}</Text>

              <DownArrowIcon style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <SearchIcon style={{ marginRight: 12 }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/notification/notification")}
            >
              <BellIcon />
            </TouchableOpacity>
          </View>
        </View>

        {weatherInfo && (
          <LinearGradient
            colors={["rgba(0, 105, 254, 0.05)", "rgba(0, 105, 254, 0.10)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.weatherCard}
          >
            <View style={styles.weatherTop}>
              <SunnyIcon />
              <Text style={styles.weatherTemp}>{weatherInfo?.temp}°</Text>
            </View>
            <View style={styles.weatherBottom}>
              <View>
                <Text style={styles.weatherCity}>{weatherInfo?.cityName}</Text>
                <Text style={styles.weatherDesc}>
                  {weatherInfo?.description}
                </Text>
              </View>
              <View>
                <Text style={styles.weatherLabel}>Yağış ehtimalı</Text>
                <Text style={styles.weatherValue}>
                  {weatherInfo?.rainProbability}%
                </Text>
              </View>
              <View>
                <Text style={styles.weatherLabel}>Külək</Text>
                <Text style={styles.weatherValue}>
                  {weatherInfo?.windSpeed} km/s
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {data ? (
          <View style={styles.deviceDataContainer}>
            <View style={styles.deviceValveContainer}>
              <View style={styles.deviceValveHeader}>
                <Text style={styles.deviceValveText}>Əsas cihaz</Text>
                <View style={styles.deviceConnectIcon}>
                  <View style={styles.bluetoothIconContainer}>
                    <BluetoothIcon width={22} height={22} />
                  </View>
                  <View style={styles.wifiIconContainer}>
                    <WifiIcon width={22} height={22} />
                  </View>
                </View>
              </View>
              <View style={styles.zoneContainer}>
                <Text style={styles.zoneHeaderText}>Suvarma zonaları</Text>
                <View style={styles.zoneCards}>
                  {data?.valves?.map((valve) => (
                    <ZoneCard
                      key={valve._id}
                      valve={valve}
                      onPress={() =>
                        router.push({
                          pathname: "/zoneControl/zoneControl",
                          params: {
                            valve: JSON.stringify(valve),
                            deviceId: String(selectedDevice?.deviceId),
                            valvePortCount: String(data.valves.length),
                            usedValvePorts: JSON.stringify(
                              data.valves
                                .filter((v) => v._id !== valve._id)
                                .map((v) => `valve ${v.valveId}`),
                            ),
                          },
                        })
                      }
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={["#0059D6", "#3387FF"]}
              start={{ x: 0, y: 0.2 }}
              end={{ x: 1, y: 1 }}
              style={styles.guideLink}
            >
              <View style={styles.leftSide}>
                <Text style={styles.leftText}>
                  Tətbiqdən istifadə üçün qısa bələdçiyə göz atın
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleGuide}
                >
                  <Text style={styles.startButtonText}>Başla</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rightSide}>
                <Illustration width={160} height={160} />
              </View>
            </LinearGradient>

            <View style={styles.addDeviceContainer}>
              <Image source={Logo} />
              <Text style={styles.addDeviceText}>
                QR kodu skan edin və suvarma cihazınızı tətbiqə qoşun
              </Text>

              <View style={{ marginTop: 24 }}>
                <CustomAddButton
                  text="Cihaz əlavə et"
                  onClick={handleAddDevicePress}
                  size="m"
                />
              </View>
            </View>
          </>
        )}
      </View>

      {/* Permission Modal */}
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
        onOpenBleScan={(code) => {
          // ✅
          setQrCode(code);
          setBleScanVisible(true);
        }}
        openQrScanner={() => {
          setManualVisible(false);
          setQrScannerVisible(true);
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
      <DeviceListModal
        visible={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
        addDevice={handleAddDevicePress}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homePage: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deviceName: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceNameText: {
    color: "#0E121B",
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  guideLink: {
    marginTop: 16,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  leftSide: {
    flex: 1,
    paddingRight: 8,
  },
  leftText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 16,
    maxWidth: "60%",
  },
  startButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  startButtonText: {
    color: "#0069FE",
    fontSize: 14,
    fontWeight: "500",
  },
  rightSide: {
    position: "absolute",
    right: -10,
    top: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addDeviceContainer: {
    borderRadius: 16,
    backgroundColor: "white",
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 72,
    paddingHorizontal: 70,
  },
  addDeviceText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 16,
    fontFamily: "SF-Pro-Display",
  },
  addDeviceBtn: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#0069FE",
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  addDeviceBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  // WEATHER

  weatherCard: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  weatherTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    marginLeft: 12,
  },
  weatherBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  weatherCity: {
    fontSize: 10,
    color: "#717784",
    fontWeight: "400",
  },
  weatherDesc: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
    textTransform: "capitalize",
    marginTop: 4,
  },
  weatherLabel: {
    fontSize: 10,
    color: "#717784",
    fontWeight: "400",
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
    marginTop: 4,
  },
  //  DEVICES

  deviceDataContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderRadius: 16,
  },

  deviceValveHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  deviceValveText: {
    color: "#0E121B",
    fontSize: 20,
    fontWeight: 600,
  },

  deviceConnectIcon: {
    flexDirection: "row",
    alignItems: "center",
  },

  bluetoothIconContainer: {
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    padding: 4,
  },

  wifiIconContainer: {
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    padding: 4,
    marginLeft: 12,
  },

  zoneContainer: {
    marginTop: 8,
    marginBottom: 24,
  },

  zoneHeaderText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
    marginBottom: 8,
  },

  zoneCards: {
    flexDirection: "row",
    flexWrap: "wrap", // ✅ növbəti sətrə keçəcək
    justifyContent: "space-between",
  },
  zoneCard: {
    width: "48%",
    backgroundColor: "#F5F7FA",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  zoneText: {
    color: "#0E121B",
    fontSize: 14,
    fontWeight: 500,
  },
});
