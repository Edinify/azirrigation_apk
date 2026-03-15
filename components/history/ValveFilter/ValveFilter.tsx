import CheckIcon from "@/assets/icons/menu/settings/check.svg";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ValveType = "all_valves" | "apple" | "trees";

interface ValveOption {
  id: number;
  key: ValveType;
  label: string;
}

interface ValveFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (range: ValveType) => void;
  selectedValve: ValveType;
}

const ValveFilter = ({
  visible,
  onClose,
  onSelect,
  selectedValve,
}: ValveFilterProps) => {
  const [tempValve, setTempValve] = useState(selectedValve);

  const handleSelect = (range: ValveType) => {
    setTempValve(range);
    onSelect(range);
    onClose();
  };

  const ranges: ValveOption[] = [
    {
      id: 1,
      key: "all_valves",
      label: "Bütün sahələr",
    },
    {
      id: 2,
      key: "trees",
      label: "Ağaclar",
    },
    {
      id: 3,
      key: "apple",
      label: "Alma",
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
          <Text style={styles.title}>Sahə filteri</Text>
          {ranges.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={styles.option}
              onPress={() => handleSelect(range.key)}
            >
              <Text style={styles.optionText}>{range.label}</Text>
              {tempValve === range.key && (
                <View style={styles.checkmark}>
                  <CheckIcon />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ValveFilter;

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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0E121B",
    marginBottom: 24,
    textAlign: "center",
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#0E121B",
    fontWeight: "500",
  },
  checkmark: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
