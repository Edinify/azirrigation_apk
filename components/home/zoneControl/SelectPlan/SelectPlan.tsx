import CalendarIcon from "@/assets/icons/home/zoneControl/plan/calendar-days.svg";
import DropIcon from "@/assets/icons/home/zoneControl/plan/droplet.svg";
import RepeatIcon from "@/assets/icons/home/zoneControl/plan/repeat.svg";
import Arrow from "@/assets/icons/menu/profileArrow.svg";

import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PlanProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlan: (type: "weekly" | "periodic" | "humidity") => void;
}

const SelectPlan = ({ visible, onClose, onSelectPlan }: PlanProps) => {
  const planDatas = [
    {
      id: 1,
      title: "Həftəlik plan",
      desc: "Həftənin günlərinə görə",
      icon: CalendarIcon,
      type: "weekly" as const,
    },
    {
      id: 2,
      title: "Periodik plan",
      desc: "Hər X gündən bir",
      icon: RepeatIcon,
      type: "periodic" as const,
    },
    {
      id: 3,
      title: "Rütubət",
      desc: "Torpağın nəmliyinə görə",
      icon: DropIcon,
      type: "humidity" as const,
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
          <Text style={styles.planHeaderText}>Suvarma planını seçin</Text>
          <View style={styles.planCards}>
            {planDatas.map((plan) => {
              const Icon = plan.icon;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planCard}
                  onPress={() => {
                    onSelectPlan(plan.type);
                    onClose();
                  }}
                >
                  <View style={styles.left}>
                    <View style={styles.iconContainer}>
                      <Icon />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.titleText}>{plan.title}</Text>
                      <Text style={styles.descText}>{plan.desc}</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Arrow />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SelectPlan;

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

  planHeaderText: {
    color: "#0E121B",
    fontSize: 20,
    fontWeight: 600,
  },

  planCards: {
    marginTop: 20,
  },

  planCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    backgroundColor: "#EEF2F6",
    padding: 6,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 12,
  },

  titleText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
  descText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
    marginTop: 2,
  },
});
