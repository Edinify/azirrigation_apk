// components/Settings/TimezonePicker.tsx
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import CheckIcon from "@/assets/icons/menu/settings/check.svg";
import SearchIcon from "@/assets/icons/menu/settings/search.svg";

import { TIMEZONES, Timezone } from "@/constants/Timezones";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TimezonePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (timezone: Timezone) => void;
  selectedTimezone: string;
}

export default function TimezonePicker({
  visible,
  onClose,
  onSelect,
  selectedTimezone,
}: TimezonePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter timezones
  const filteredTimezones = useMemo(() => {
    if (!searchQuery.trim()) return TIMEZONES;

    const query = searchQuery.toLowerCase();
    return TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(query) ||
        tz.offset.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleSelect = (timezone: Timezone) => {
    onSelect(timezone);
    setSearchQuery("");
    onClose();
  };

  const renderTimezone = ({ item }: { item: Timezone }) => {
    const isSelected = selectedTimezone === item.value;

    return (
      <TouchableOpacity
        style={styles.timezoneItem}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.timezoneInfo}>
          <Text style={styles.timezoneLabel}>
            {item.label} ({item.offset})
          </Text>
        </View>
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
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Saat qurşağı</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Search */}

          <View style={{ paddingHorizontal: 16 }}>
            <View style={styles.searchContainer}>
              <SearchIcon />
              <TextInput
                style={styles.searchInput}
                placeholder="Axtarın"
                placeholderTextColor="#717784"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <FlatList
            data={filteredTimezones}
            keyExtractor={(item) => item.id}
            renderItem={renderTimezone}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // ⬅️ Əlavə olundu
  },
  container: {
    backgroundColor: "#F5F7FA",
    height: "100%", // ⬅️ maxHeight əvəzinə height
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    fontSize: 16,
    color: "#0E121B",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  timezoneItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    marginBottom: 16,
  },
  timezoneInfo: {
    flex: 1,
    padding: 8,
  },
  timezoneLabel: {
    fontSize: 16,
    color: "#0E121B",
    fontWeight: "500",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
});
