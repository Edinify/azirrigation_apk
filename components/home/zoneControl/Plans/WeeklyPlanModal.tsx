import CloseIcon from "@/assets/icons/home/add-device/xmark-line.svg";
import TimePickerModal from "@/components/home/zoneControl/TimePicker/TimePicker";
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

const WEEK_DAYS = [
  { id: 1, label: "B.e" },
  { id: 2, label: "Ç.a" },
  { id: 3, label: "Ç" },
  { id: 4, label: "C.a" },
  { id: 5, label: "C" },
  { id: 6, label: "Ş" },
  { id: 7, label: "B" },
];

interface WeeklyPlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    days: number[];
    startTime: string;
    duration: number;
  }) => void;

  onDelete?: () => void;
  editData?: {
    _id: string;
    days: number[];
    startTime: string;
    duration: number;
  } | null;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h} s ${m} dəq`;
  if (m > 0) return `${m} dəqiqə`;
  return `${s} san`;
};

const WeeklyPlanModal = ({
  visible,
  onClose,
  onSave,
  onDelete,
  editData,
}: WeeklyPlanModalProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("07:00");
  const [duration, setDuration] = useState(900);
  const [dayError, setDayError] = useState(false);

  const isEdit = !!editData;

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const toggleDay = (id: number) => {
    setDayError(false);
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const handleStartTimeSelect = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    setStartTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    setShowStartTimePicker(false);
  };

  const handleDurationSelect = (seconds: number) => {
    setDuration(seconds);
    setShowDurationPicker(false);
  };

  const handleSave = () => {
    if (selectedDays.length === 0) {
      setDayError(true);
      return;
    }
    onSave({ days: selectedDays, startTime, duration });
    handleClose();
  };

  const handleClose = () => {
    setSelectedDays([]);
    setStartTime("07:00");
    setDuration(900);
    setDayError(false);
    onClose();
  };

  useEffect(() => {
    if (editData) {
      setSelectedDays(editData.days);
      setStartTime(editData.startTime);
      setDuration(editData.duration);
    } else {
      setSelectedDays([]);
      setStartTime("07:00");
      setDuration(900);
    }
  }, [editData, visible]);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable
            style={styles.container}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <CloseIcon />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>
                {isEdit ? "Həftəlik planı dəyişin" : "Həftəlik planı yaradın"}
              </Text>
              <Text style={styles.subtitle}>
                Bu zona üçün həftənin günlərini, saatı va suvarma müddətini
                seçin
              </Text>

              {/* Həftənin günləri */}
              <Text style={styles.label}>Həftənin günləri</Text>
              <View style={styles.daysRow}>
                {WEEK_DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day.id);
                  return (
                    <TouchableOpacity
                      key={day.id}
                      style={[styles.dayBtn, isSelected && styles.dayBtnActive]}
                      onPress={() => toggleDay(day.id)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && styles.dayTextActive,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {dayError && (
                <Text style={styles.errorText}>Ən azı bir gün seçin</Text>
              )}

              {/* Başlama vaxtı */}
              <Text style={styles.label}>Başlama vaxtı</Text>
              <TouchableOpacity
                style={styles.valueCard}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.valueText}>{startTime}</Text>
              </TouchableOpacity>

              {/* Suvarma müddəti */}
              <Text style={styles.label}>Suvarma müddəti</Text>
              <TouchableOpacity
                style={styles.valueCard}
                onPress={() => setShowDurationPicker(true)}
              >
                <Text style={styles.valueText}>{formatTime(duration)}</Text>
              </TouchableOpacity>
            </ScrollView>

            {isEdit ? (
              <View style={styles.editBtns}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Yadda saxla</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                  <Text style={styles.deleteBtnText}> Planı Sil</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Planı yarat</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onStart={handleStartTimeSelect}
        mode="time"
      />

      <TimePickerModal
        visible={showDurationPicker}
        onClose={() => setShowDurationPicker(false)}
        onStart={handleDurationSelect}
        mode="duration"
      />
    </>
  );
};

export default WeeklyPlanModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    height: "100%",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    height: "100%",
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0E121B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#717784",
    lineHeight: 18,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0E121B",
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
  },
  dayBtnActive: {
    backgroundColor: "#0069FE",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#717784",
  },
  dayTextActive: {
    color: "white",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginBottom: 16,
  },
  valueCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
  },
  saveBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#FE171B",
    fontSize: 16,
    fontWeight: "500",
  },
});
