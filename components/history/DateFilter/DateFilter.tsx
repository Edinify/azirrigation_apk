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

type RangeType =
  | "last_seven_days"
  | "this_month"
  | "last_month"
  | "last_three_months";

interface DateRangeOption {
  id: number;
  key: RangeType;
  label: string;
}

interface DateFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (range: RangeType) => void;
  selectedDateRange: RangeType;
}

const DateFilter = ({
  visible,
  onClose,
  onSelect,
  selectedDateRange,
}: DateFilterProps) => {
  const [tempRange, setTempRange] = useState(selectedDateRange);

  const handleSelect = (range: RangeType) => {
    setTempRange(range);
    onSelect(range);
    onClose();
  };

  const ranges: DateRangeOption[] = [
    {
      id: 1,
      key: "last_seven_days",
      label: "Son 7 gün",
    },
    {
      id: 2,
      key: "last_month",
      label: "Son 30 gün",
    },
    {
      id: 3,
      key: "this_month",
      label: "Bu ay",
    },
    {
      id: 4,
      key: "last_three_months",
      label: "Son 3 ay",
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
          <Text style={styles.title}>Tarix filterləri</Text>
          {ranges.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={styles.option}
              onPress={() => handleSelect(range.key)}
            >
              <Text style={styles.optionText}>{range.label}</Text>
              {tempRange === range.key && (
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

export default DateFilter;

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
