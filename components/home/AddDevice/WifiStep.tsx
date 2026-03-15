import HighLevelWifiIcon from "@/assets/icons/home/add-device/wifi/wifi-line-high.svg";
import LowLevelWifiIcon from "@/assets/icons/home/add-device/wifi/wifi-line-low.svg";
import MidLevelWifiIcon from "@/assets/icons/home/add-device/wifi/wifi-line-mid.svg";

import LoaderIcon from "@/assets/icons/home/add-device/wifi/loader.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import CheckIcon from "@/assets/icons/menu/settings/check.svg";
import { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WifiManager from "react-native-wifi-reborn";

interface WifiNetwork {
  SSID: string;
  BSSID: string;
  level: number;
  frequency: number;
}

interface WifiStepProps {
  onNext: (network: string) => void;
  onSkip: () => void;
  onCantSee: () => void;
  type: string;
  mockMode?: boolean;
}

const WifiStep = ({
  onNext,
  onSkip,
  onCantSee,
  type,
  mockMode = false,
}: WifiStepProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Məkan icazəsi",
          message: "Wi-Fi şəbəkələrini görmək üçün məkan icazəsi lazımdır.",
          buttonPositive: "İcazə ver",
          buttonNegative: "Ləğv et",
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error("Location permission error:", err);
      return false;
    }
  };

  const scanNetworks = async () => {
    if (mockMode) {
      setIsLoading(true);

      setTimeout(() => {
        setNetworks(mockNetworks);
        setIsLoading(false);
      }, 800);
      // Mock data
      const mockNetworks: WifiNetwork[] = [
        {
          SSID: "AgroFarm_Main",
          BSSID: "00:11:22:33:44:55",
          level: -50,
          frequency: 2437,
        },
        {
          SSID: "Greenhouse_WiFi",
          BSSID: "00:11:22:33:44:66",
          level: -70,
          frequency: 2412,
        },
        {
          SSID: "IrrigationControl_2.4G",
          BSSID: "00:11:22:33:44:77",
          level: -55,
          frequency: 2462,
        },
        {
          SSID: "FieldSensor_Network",
          BSSID: "00:11:22:33:44:88",
          level: -75,
          frequency: 2437,
        },
        {
          SSID: "BarnOffice_WiFi",
          BSSID: "00:11:22:33:44:99",
          level: -80,
          frequency: 2412,
        },
      ];
      setNetworks(mockNetworks);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError("Məkan icazəsi verilmədi");
        setIsLoading(false);
        return;
      }

      const wifiList = await WifiManager.loadWifiList();

      const sortedNetworks = wifiList
        .filter((wifi) => wifi.SSID && wifi.SSID.trim() !== "")
        .sort((a, b) => b.level - a.level)
        .filter(
          (
            wifi,
            index,
            self, // ✅ unique SSID
          ) => index === self.findIndex((w) => w.SSID === wifi.SSID),
        );

      setNetworks(sortedNetworks);
      // console.log("✅ Wi-Fi networks found:", sortedNetworks.length);
    } catch (err: any) {
      console.error("Wi-Fi scan error:", err);
      setError("Wi-Fi şəbəkələri tapılmadı");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scanNetworks();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.stepContainer}>
      {type === "details" ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => onNext("")}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.headerText}>Wi-Fi bağlantısı</Text>
          </View>
          <Text style={styles.stepSubtitle}>
            Cihazın qoşulu olduğu Wi-Fi şəbəkəsini və bağlantı statusunu
            yoxlayın, yeni şəbəkəyə qoşulun.
          </Text>
        </>
      ) : (
        <View>
          <Text style={styles.stepTitle}>Wi-Fi-a qoşun</Text>
          <Text style={styles.stepSubtitle}>
            Cihaz yaxınlıqdakı Wi-Fi şəbəkələrini göstərir. Qoşulduqda cihazı
            sonradan uzaqdan idarə edə bilərsiniz. Şəbəkə yoxdursa, keçin.
          </Text>
        </View>
      )}

      {mockMode && (
        <View style={styles.mockBadge}>
          <Text style={styles.mockBadgeText}>MOCK MODE</Text>
        </View>
      )}

      <View style={styles.networkListHeader}>
        <Text style={styles.networkListTitle}>YAXINLIQDAKI ŞƏBƏKƏLƏR</Text>
        {isLoading && <LoaderIcon />}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={scanNetworks}>
            <Text style={styles.retryBtnText}>Yenidən cəhd et</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.networkList}
          showsVerticalScrollIndicator={false}
        >
          {networks.length === 0 && !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Wi-Fi şəbəkəsi tapılmadı</Text>
            </View>
          ) : (
            networks.map((network, index) => (
              <TouchableOpacity
                key={`${network.BSSID}-${index}`}
                style={styles.networkItem}
                onPress={() => setSelected(network.SSID)}
              >
                <Text style={styles.networkIcon}>
                  {network.level < 0 && network.level >= -20 ? (
                    <HighLevelWifiIcon />
                  ) : network.level < -20 && network.level >= -50 ? (
                    <MidLevelWifiIcon />
                  ) : network.level < -40 && network.level >= -80 ? (
                    <LowLevelWifiIcon />
                  ) : (
                    ""
                  )}
                </Text>
                <Text
                  style={[
                    styles.networkName,
                    selected === network.SSID && styles.networkNameSelected,
                  ]}
                >
                  {network.SSID}
                </Text>
                {selected === network.SSID && <CheckIcon />}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.cantSeeBtn} onPress={onCantSee}>
        <Text style={styles.cantSeeBtnText}>Bağlantını görə bilmirəm</Text>
      </TouchableOpacity>

      {type === "device" && (
        <>
          <TouchableOpacity
            style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
            disabled={!selected}
            onPress={() => selected && onNext(selected)} // ✅ Password modal aç
          >
            <Text style={styles.primaryBtnText}>Davam et</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default WifiStep;

const styles = StyleSheet.create({
  stepContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  mockBadge: {
    position: "absolute",
    top: 20,
    right: 20,
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
  header: {
    marginVertical: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    width: "100%",
    textAlign: "center",
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "600",
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#0E121B",
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    marginTop: 8,
  },
  networkListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 36,
    height: 40,
  },
  networkListTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#717784",
    letterSpacing: 0.5,
  },
  refreshIcon: {
    fontSize: 18,
    color: "#0069FE",
    fontWeight: "600",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "#0069FE",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#717784",
  },
  networkList: {
    maxHeight: 300,
    marginBottom: 24,
  },
  networkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
    gap: 12,
  },

  networkName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
  networkNameSelected: {
    color: "#0069FE",
  },
  cantSeeBtn: {
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  cantSeeBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0069FE",
  },
  primaryBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#717784",
  },
});
