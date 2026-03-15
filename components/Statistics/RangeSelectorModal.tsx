// components/statistics/RangeSelectorModal.tsx
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

type RangeType = "weekly" | "monthly" | "3 month";

interface RangeSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (range: RangeType) => void;
  selectedRange: RangeType;
}

export default function RangeSelectorModal({
  visible,
  onClose,
  onSelect,
  selectedRange,
}: RangeSelectorModalProps) {
  const [tempRange, setTempRange] = useState(selectedRange);

  const ranges: { value: RangeType; label: string }[] = [
    { value: "weekly", label: "Həftəlik" },
    { value: "monthly", label: "Aylıq" },
    { value: "3 month", label: "3 Aylıq" },
  ];

  const handleSelect = (range: RangeType) => {
    setTempRange(range);
    onSelect(range);
    onClose();
  };

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
          <Text style={styles.title}>Vaxt aralığı</Text>

          {ranges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={styles.option}
              onPress={() => handleSelect(range.value)}
            >
              <Text style={styles.optionText}>{range.label}</Text>
              {tempRange === range.value && (
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
}

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
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
