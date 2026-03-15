import ErrorIcon from "@/assets/icons/history/error.svg";
import InfoIcon from "@/assets/icons/history/info.svg";

import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HistoryProps {
  visible: boolean;
  onClose: () => void;
  data: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_LABELS = ["B.e", "Ça", "Ç", "Ca", "C", "Ş", "B"]; // 0=Bazar ertəsi ... 6=Bazar

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h} s ${m} dəq`;
  if (h > 0) return `${h} s`;
  return `${m} dəq`;
};

const PlanInfo = ({ plan }: { plan: any }) => {
  if (!plan) return null;

  const duration = formatDuration(plan.duration ?? 0);

  if (plan.planType === "weekly" && plan.days?.length) {
    return (
      <View style={styles.planInfoRow}>
        <Text style={styles.planInfoText}>{duration} | </Text>
        {plan.days.map((d: number, index: number) => (
          <Text
            key={d}
            style={[
              styles.planInfoText,
              d === plan.day && styles.planInfoTextActive,
            ]}
          >
            {DAY_LABELS[d]}
            {index < plan.days.length - 1 ? ", " : ""}
          </Text>
        ))}
      </View>
    );
  }

  if (plan.planType === "periodic" && plan.day) {
    return (
      <Text style={styles.planInfoText}>
        {duration} | {plan.day} gündən bir
      </Text>
    );
  }

  return <Text style={styles.planInfoText}>{duration}</Text>;
};

const AboutHistory = ({ visible, onClose, data }: HistoryProps) => {
  // const getLocationName = (location?: string) => {
  //   if (!location) return "";
  //   return location.split(" ")[0];
  // };

  console.log(data, "data");

  const aboutData = [
    {
      id: 1,
      label: "Zona",
      value: data.location,
    },
    {
      id: 2,
      label: "Suvarma müddəti",
      value: data.duration,
    },
    {
      id: 3,
      label: "Tarix",
      value: data.date,
    },
  ];

  const consumptionData = [
    {
      id: 1,
      label: "İstifadə olunan su",
      value: `${data.waterConsumption.toFixed(2)} L`,
    },
    {
      id: 2,
      label: "Elektrik sərfiyyatı",
      value: `${data.electricity.toFixed(2)} kWh `,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                data.type === "completed"
                  ? { backgroundColor: "rgba(0, 171, 28, 0.10)" }
                  : data.type === "stopped"
                    ? { backgroundColor: "#E4E7EC" }
                    : { backgroundColor: "rgba(254, 23, 27, 0.10)" },
              ]}
            >
              <data.Icon />
            </View>
            <View style={styles.dateHeaderContainer}>
              <Text style={styles.titleText}>{data.title}</Text>
              {data.type && (
                <Text style={styles.descText}>
                  {data.type === "stopped"
                    ? "Suvarma siz tərəfindən dayandırıldı"
                    : data.type === "no_connection"
                      ? "Suvarma başlamadı"
                      : data.type === "empty_pool" ||
                          data.type === "no_water_flow"
                        ? "Suvarma dayandırıldı"
                        : ""}
                </Text>
              )}
              <View style={styles.dataTimeContainer}>
                <Text style={styles.timeText}>{data?.plan?.startTime}</Text>
                <PlanInfo plan={data?.plan} />
              </View>
            </View>
          </View>
          <View style={styles.aboutDataCards}>
            {aboutData?.map((data) => (
              <View
                style={[styles.dataCard, data.id === 1 && { marginTop: 0 }]}
                key={data.id}
              >
                <Text style={styles.labelText}>{data.label}</Text>
                <Text style={styles.valueText}>{data.value}</Text>
              </View>
            ))}
          </View>

          {data.type !== "no_connection" && (
            <View style={styles.consumptionDataCards}>
              {consumptionData?.map((data) => (
                <View
                  style={[styles.dataCard, data.id === 1 && { marginTop: 0 }]}
                  key={data.id}
                >
                  <Text style={styles.labelText}>{data.label}</Text>
                  <Text style={styles.valueText}>{data.value}</Text>
                </View>
              ))}
            </View>
          )}

          {data.type === "no_connection" && (
            <View style={styles.errorContainer}>
              <View style={styles.IconContainer}>
                <ErrorIcon />
              </View>
              <Text style={styles.errorText}>
                Suvarma planı alt cihazla bağlantı olmadığı üçün icra olunmadı.
                Enerjini və bağlantını yoxlayın.
              </Text>
            </View>
          )}
          {data.type === "no_water_flow" && (
            <View style={styles.infoContainer}>
              <View style={styles.IconContainer}>
                <InfoIcon />
              </View>
              <Text style={styles.infoText}>
                Səbəb su olmaması və ya klapan/sensor nasazlığı ola bilər.
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtnContainer} onPress={onClose}>
            <Text style={styles.closeText}>Bağla</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AboutHistory;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
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
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    padding: 12,
    borderRadius: 100,
  },

  dateHeaderContainer: {
    marginVertical: 16,
  },

  titleText: {
    color: "#0E121B",
    fontSize: 24,
    fontWeight: 600,
  },
  descText: {
    marginTop: 8,
    color: "#717784",
    fontSize: 16,
    fontWeight: 400,
    textAlign: "center",
  },

  dataTimeContainer: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  timeText: {
    color: "#0E121B",
    fontSize: 20,
    fontWeight: 500,
  },

  aboutDataCards: {
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderRadius: 16,
  },

  consumptionDataCards: {
    backgroundColor: "#F5F7FA",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  dataCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },

  labelText: {
    color: "#717784",
    fontSize: 16,
    fontWeight: 400,
  },
  valueText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 400,
  },

  closeBtnContainer: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#E4E7EC",
    borderRadius: 16,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },

  closeText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 400,
  },

  planInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    flexWrap: "wrap",
  },
  planInfoText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
  },
  planInfoTextActive: {
    color: "#FE171B",
    fontWeight: "600",
  },

  errorContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(254, 23, 27, 0.05)",
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginLeft: 8,
    color: "#FE171B",
    fontSize: 14,
    fontWeight: 400,
    maxWidth: "80%",
    lineHeight: 18,
  },

  infoContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 105, 254, 0.05)",
  },

  infoText: {
    marginLeft: 8,
    color: "#0069FE",
    fontSize: 14,
    fontWeight: 400,
    maxWidth: "80%",
    lineHeight: 18,
  },
});
