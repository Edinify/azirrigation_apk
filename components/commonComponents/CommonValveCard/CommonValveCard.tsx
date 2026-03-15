import PlusIcon from "@/assets/icons/home/add-device/plus-line.svg";
import TrashIcon from "@/assets/icons/home/add-device/trash.svg";
import RightArrowIcon from "@/assets/icons/rightIcon.svg";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
  Swipeable,
} from "react-native-gesture-handler";

interface Valve {
  id: number;
  valve: string;
  name: string;
}

interface ValveSwipeableListProps {
  valves: Valve[];
  onEditValve: (valve: Valve) => void;
  onDeleteValve: (id: number) => void;
  onAddValve: () => void;
}

const CommonValveCard = ({
  valves,
  onEditValve,
  onDeleteValve,
  onAddValve,
}: ValveSwipeableListProps) => {
  const renderRightActions = (id: number) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          console.log("🗑️ Delete pressed for:", id);
          onDeleteValve(id);
        }}
        activeOpacity={0.8}
      >
        <TrashIcon />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView
          style={styles.valveScrollContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEnabled={true}
        >
          {valves.length > 0 ? (
            <View style={styles.valveCards}>
              {valves.map((data) => (
                <Swipeable
                  key={data.id}
                  renderRightActions={() => renderRightActions(data.id)}
                  overshootRight={false}
                  friction={2}
                  rightThreshold={40}
                >
                  <TouchableOpacity
                    style={styles.valveCard}
                    onPress={() => onEditValve(data)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.valveCardContent}>
                      <Text style={styles.valveTitle}>{data.name}</Text>
                      <Text style={styles.valveSubtitle}>{data.valve}</Text>
                    </View>
                    <RightArrowIcon />
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Hələ klapan əlavə edilməyib</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.addValveBtn} onPress={onAddValve}>
          <PlusIcon />
          <Text style={styles.addValveBtnText}>Klapan əlavə et</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default CommonValveCard;

const styles = StyleSheet.create({
  container: {},
  valveScrollContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  valveCards: {
    gap: 12,
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
    flex: 1,
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
  emptyText: {
    textAlign: "center",
    color: "#717784",
    fontSize: 14,
    paddingVertical: 40,
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
});
