import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import CheckIcon from "@/assets/icons/menu/settings/check.svg";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UnitOption<T> {
  value: T;
  label: string;
  description?: string;
}

interface CommonUnitModalProps<T> {
  visible: boolean;
  title: string;
  options: UnitOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  onClose: () => void;
}

function CommonUnitModal<T>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: CommonUnitModalProps<T>) {
  const handleSelect = (value: T) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconContainer}
            >
              <CloseIcon width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option, i) => (
              <TouchableOpacity
                key={i}
                style={styles.unitOption}
                onPress={() => handleSelect(option.value || option.name)}
                activeOpacity={0.7}
              >
                <View style={styles.unitContent}>
                  <Text style={styles.unitLabel}>
                    {option.label || option.name}
                  </Text>
                  {option.description && (
                    <Text style={styles.unitDescription}>
                      {option.description}
                    </Text>
                  )}
                </View>
                {selectedValue === option.value && <CheckIcon />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default CommonUnitModal;

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
    maxHeight: "70%",
  },

  header: {
    position: "relative",
  },
  closeIconContainer: {
    position: "absolute",
    right: 5,
    top: 10,
    padding: 5,
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  titleText: {
    color: "#0E121B",
    fontSize: 20,
    fontWeight: "600",
  },
  unitOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  unitContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
  unitDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
    marginLeft: 5,
  },
  checkmark: {
    fontSize: 20,
    color: "#0069FE",
    fontWeight: "700",
    marginLeft: 12,
  },
});
