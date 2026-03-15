import FlowSensorIcon from "@/assets/icons/home/add-device/sensors/Flow_sensor.svg";
import HumiditySensorIcon from "@/assets/icons/home/add-device/sensors/Humidity_sensor.svg";
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

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

const AddSensorsToSubdevice = ({ onClose }) => {
  const router = useRouter();
  const sensors = [
    {
      id: 1,
      key: "flow_sensor",
      name: "Su axını sensoru",
      status: "not_added",
      desc: "Bu sensor cihazdakı su axınını nəzarətdə saxlayır. Suvarma hansı zonada getsə də, xəttdə su axını kəsilərsə xəbərdarlıq ediləcək.",
      Icon: FlowSensorIcon,
    },

    {
      id: 4,
      key: "humidity_sensor",
      name: "Rütubət sensoru",
      status: "not_added",
      Icon: HumiditySensorIcon,
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
              style={[styles.sensorCard, index % 2 === 1 && { marginLeft: 12 }]}
              onPress={() =>
                router.push({
                  pathname: "/menu/device/sensors/sensorDetails",
                  params: {
                    id: item.id.toString(),
                    name: item.name,
                    status: item.status,
                    key: item.key,
                    desc: item?.desc,
                    type: "subDevice",
                  },
                })
              }
            >
              <item.Icon />
              <View style={styles.sensorContent}>
                <Text style={styles.sensorName}>{item.name}</Text>
                <Text style={[styles.sensorStatus]}>Əlavə edin</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={[styles.primaryBtn]} onPress={() => onClose()}>
          <Text style={styles.primaryBtnText}>Sonra edərəm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddSensorsToSubdevice;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
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
    color: "#0069FE",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "400",
  },

  primaryBtn: {
    backgroundColor: "#E4E7EC",
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
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "600",
  },
});
