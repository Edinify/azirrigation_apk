// components/statistics/DatePickerModal.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const monthNames = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (day: number, month: number, year: number) => void;
  selectedMonth: number;
  selectedYear: number;
  selectedDay: number;
}

export default function DatePickerModal({
  visible,
  onClose,
  onSelect,
  selectedMonth,
  selectedDay,
  selectedYear,
}: DatePickerModalProps) {
  const [tempDay, setTempDay] = useState(selectedDay);
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempYear, setTempYear] = useState(selectedYear);

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
  const daysInMonth = new Date(tempYear, tempMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = () => {
    onSelect(tempDay, tempMonth, tempYear);
    onClose();
  };

  useEffect(() => {
    const maxDays = new Date(tempYear, tempMonth + 1, 0).getDate();
    if (tempDay > maxDays) {
      setTempDay(maxDays);
    }
  }, [tempMonth, tempYear]);

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
          <Text style={styles.title}>Tarix seçin</Text>

          <View style={styles.pickerContainer}>
            {/* Day picker */}
            <View style={styles.column}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerItem,
                      tempDay === day && styles.pickerItemSelected,
                    ]}
                    onPress={() => setTempDay(day)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        tempDay === day && styles.pickerItemTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Month picker */}
            <View style={styles.column}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {monthNames.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      tempMonth === index && styles.pickerItemSelected,
                    ]}
                    onPress={() => setTempMonth(index)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        tempMonth === index && styles.pickerItemTextSelected,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Year picker */}
            <View style={styles.column}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      tempYear === year && styles.pickerItemSelected,
                    ]}
                    onPress={() => setTempYear(year)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        tempYear === year && styles.pickerItemTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Tətbiq et</Text>
          </TouchableOpacity>
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
    marginBottom: 24,
    textAlign: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    height: 240,
  },
  column: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  pickerItemSelected: {
    backgroundColor: "#0069FE",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
  pickerItemTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#0069FE",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
