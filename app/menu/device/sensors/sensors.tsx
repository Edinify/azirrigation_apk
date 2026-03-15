import FlowSensorIcon from "@/assets/icons/home/add-device/sensors/Flow_sensor.svg";
import LevelSensorIcon from "@/assets/icons/home/add-device/sensors/Level_sensor.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import { useGetMainByIdQuery } from "@/services/devices/deviceApi";
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

const Sensors = () => {
  const router = useRouter();

  const { deviceId } = useSelector((state) => state.deviceForm);

  const { data: mainData } = useGetMainByIdQuery(deviceId);

  // const { pressureSensor, levelSensor, flowSensor } = useSelector(
  //   (state) => state.deviceForm,
  // );

  // console.log(levelSensor, "level sensor");
  // console.log(flowSensor, "flow sensor");
  const sensors = [
    {
      id: 1,
      key: "flow_sensor",
      name: "Su axını sensoru",
      status: mainData?.flowSensor?.isConnected ? "added" : "not_added",
      desc: "Bu sensor cihazdakı su axınını nəzarətdə saxlayır. Suvarma hansı zonada getsə də, xəttdə su axını kəsilərsə xəbərdarlıq ediləcək.",
      Icon: FlowSensorIcon,
    },
    {
      id: 2,
      key: "level_sensor",
      name: "Su səviyyəsi sensoru",
      status: mainData?.levelSensor?.isConnected ? "added" : "not_added",
      desc: "Bu sensor hovuzda suyun olub-olmadığını yoxlayır. Su qurtardıqda suvarma dayandırılır və xəbərdarlıq göndərilir.",
      Icon: LevelSensorIcon,
    },
    // {
    //   id: 3,
    //   key: "pressure_sensor",
    //   name: "Təzyiq sensoru",
    //   desc: "Bu sensor suvarma zamanı xəttdəki su təzyiqini izləyir. Təzyiq normadan aşağı düşərsə xəbərdarlıq göndərilir.",
    //   status: "not_added",
    //   Icon: PressureSensorIcon,
    // },
    // {
    //   id: 4,
    //   key: "humidity_sensor",
    //   name: "Rütubət sensoru",
    //   status: "not_added",
    //   Icon: HumiditySensorIcon,
    // },
  ];
  return (
    <View style={styles.devices}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={[styles.headerText]}>Sensorlar</Text>
        </View>

        <View style={styles.sensorCards}>
          <FlatList
            data={sensors}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.sensorCard,
                  index % 2 === 1 && { marginLeft: 12 },
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
                      type: "sensor",
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
                      item.status === "added" && styles.addedSensorStatus,
                    ]}
                  >
                    {item.status === "not_added"
                      ? "Əlavə edilməyib"
                      : "Əlavə edilib"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default Sensors;

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
    width: "100%",
    textAlign: "center",
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 600,
  },
  sensorCards: {
    marginTop: 24,
  },
  sensorCard: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 16,
    marginBottom: 12,
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

  addedSensorStatus: {
    color: "#00AB1C",
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
});
