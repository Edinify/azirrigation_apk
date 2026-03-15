import FlowSensorIcon from "@/assets/icons/home/add-device/sensors/Flow_sensor.svg";
import LevelSensorIcon from "@/assets/icons/home/add-device/sensors/Level_sensor.svg";

import { useCreateMainMutation } from "@/services/devices/deviceApi";
import { getBleManager } from "@/utils/bleManeger";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

const bleManager = getBleManager();
const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const UART_RX_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

const AddSensors = ({
  onFinish,
  type,
}: {
  onFinish: () => void;
  type: string;
}) => {
  const router = useRouter();

  const [createMain] = useCreateMainMutation();
  const deviceForm = useSelector((state: any) => state.deviceForm);

  // console.log(deviceForm, "typeee");

  const handleFinish = async () => {
    try {
      const { bleDeviceId, sensorTestResult, ...rest } = deviceForm;
      const payload = {
        ...rest,
      };

      console.log("📦 Final payload:", payload);

      await createMain(payload).unwrap();

      const connected = await bleManager.connectToDevice(bleDeviceId, {
        timeout: 10000,
      });
      await connected.discoverAllServicesAndCharacteristics();

      const clearPayload = btoa(JSON.stringify({ status: "clear" }));
      await connected.writeCharacteristicWithResponseForService(
        UART_SERVICE_UUID,
        UART_RX_UUID,
        clearPayload,
      );
      await connected.cancelConnection();
      onFinish();
    } catch (error) {
      console.log("❌ Create error:", error);
    }
  };
  const sensors = [
    {
      id: 1,
      key: "flow_sensor",
      name: "Su axını sensoru",
      status:
        deviceForm.flowSensor.isConnected === true ? "added" : "not_added",
      desc: "Bu sensor cihazdakı su axınını nəzarətdə saxlayır. Suvarma hansı zonada getsə də, xəttdə su axını kəsilərsə xəbərdarlıq ediləcək.",
      Icon: FlowSensorIcon,
    },

    {
      id: 2,
      key: "level_sensor",
      name: "Su səviyyəsi sensoru",
      status:
        deviceForm.levelSensor.isConnected === true ? "added" : "not_added",
      desc: "Bu sensor hovuzda suyun olub-olmadığını yoxlayır. Su qurtardıqda suvarma dayandırılır və xəbərdarlıq göndərilir.",
      Icon: LevelSensorIcon,
    },
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Sensorları əlavə edin</Text>
      <Text style={styles.stepSubtitle}>
        Sensorlarınız varsa əlavə edin — axın, təzyiq, səviyyə və rütubət
        məlumatları tətbiqdə görünəcək. Sonradan da əlavə etmək mümkündür.
      </Text>

      <View style={styles.sensorCards}>
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              disabled={item.status === "added"}
              style={[
                styles.sensorCard,
                index % 2 === 1 && { marginLeft: 12 },
                item.status === "added" && styles.sensorCardAdded,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/menu/device/sensors/sensorDetails",
                  params: {
                    id: item.id.toString(),
                    name: item.name,
                    status: item.status,
                    key: item.key,
                    desc: item?.desc,
                    type,
                  },
                })
              }
            >
              <item.Icon />
              <View style={styles.sensorContent}>
                <Text style={styles.sensorName}>{item.name}</Text>
                <Text
                  style={[
                    styles.sensorStatus,
                    item.status === "added" && styles.sensorStatusAdded,
                  ]}
                >
                  {item.status === "added" ? "Əlavə edildi" : "Əlavə edin"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={[styles.primaryBtn]} onPress={handleFinish}>
          <Text style={styles.primaryBtnText}>Quraşdırmanı tamamla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddSensors;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: "space-between",
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
    lineHeight: 20,
    marginTop: 8,
  },
  sensorCards: {
    marginTop: 24,
    flex: 1,
  },
  sensorCard: {
    width: CARD_WIDTH, // Fixed width
    backgroundColor: "white",
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 16,
    marginBottom: 12,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sensorContent: {
    marginTop: 28,
  },
  sensorName: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "500",
  },
  sensorStatus: {
    color: "#717784",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "400",
  },

  primaryBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  primaryBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  sensorCardAdded: {
    backgroundColor: "#F0F9F0",
    borderWidth: 1.5,
    borderColor: "#00AB1C",
    opacity: 0.8,
  },
  sensorStatusAdded: {
    color: "#00AB1C",
    fontWeight: "500",
  },
});
