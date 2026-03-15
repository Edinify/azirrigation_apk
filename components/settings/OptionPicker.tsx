// components/Settings/OptionPickerModal.tsx
import CheckIcon from "@/assets/icons/menu/settings/check.svg";

import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface OptionItem {
  id: string;
  label: string;
  value: string;
}

interface OptionPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: OptionItem) => void;
  title: string;
  options: OptionItem[];
  selectedValue: string;
}

export default function OptionPickerModal({
  visible,
  onClose,
  onSelect,
  title,
  options,
  selectedValue,
}: OptionPickerModalProps) {
  const handleSelect = (option: OptionItem) => {
    onSelect(option);
    onClose();
  };

  const renderOption = ({ item }: { item: OptionItem }) => {
    const isSelected = selectedValue === item.value;

    return (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.optionLabel}>{item.label}</Text>
        {isSelected && <CheckIcon />}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            {/* <Text style={styles.headerTitle}>{title}</Text> */}
          </View>

          {/* Options List */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.id}
            renderItem={renderOption}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "50%",
  },
  handle: {
    width: 40,
    height: 6,
    borderRadius: 100,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  listContent: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: "#0E121B",
    fontWeight: "500",
  },
});
