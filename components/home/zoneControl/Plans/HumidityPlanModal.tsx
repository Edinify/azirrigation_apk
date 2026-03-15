import CloseIcon from "@/assets/icons/home/add-device/xmark-line.svg";
import TimePickerModal from "@/components/home/zoneControl/TimePicker/TimePicker";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface HumidityPlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { humidity: number; duration: number }) => void;
  onDelete?: () => void;
  editData?: {
    _id: string;
    humidity: number;
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

const HumidityPlanModal = ({
  visible,
  onClose,
  onSave,
  onDelete,
  editData,
}: HumidityPlanModalProps) => {
  const isEdit = !!editData;

  const [humidity, setHumidity] = useState("30");
  const [duration, setDuration] = useState(900);
  const [humidityError, setHumidityError] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  useEffect(() => {
    if (editData) {
      setHumidity(String(editData.humidity));
      setDuration(editData.duration);
    } else {
      setHumidity("30");
      setDuration(900);
    }
    setHumidityError(false);
  }, [editData, visible]);

  const handleDurationSelect = (seconds: number) => {
    setDuration(seconds);
    setShowDurationPicker(false);
  };

  const handleSave = () => {
    const val = Number(humidity);
    if (!humidity || val < 1 || val > 100) {
      setHumidityError(true);
      return;
    }

    onSave({
      humidity: val,
      duration,
    });
    handleClose();
  };

  const handleClose = () => {
    setHumidity("30");
    setDuration(900);
    setHumidityError(false);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <Pressable style={styles.overlay} onPress={handleClose}>
            <Pressable
              style={styles.container}
              onPress={(e) => e.stopPropagation()}
            >
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <CloseIcon />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>
                  {isEdit
                    ? "Rütubət planını redaktə edin"
                    : "Rütubətə əsasən plan yaradın"}
                </Text>
                <Text style={styles.subtitle}>
                  Bu zonada torpaq nəmliyinə görə avtomatik suvarma rejimi qurun
                </Text>

                {/* Rütubət səviyyəsi */}
                <Text style={styles.label}>Rütubət səviyyəsi</Text>
                <View style={[styles.valueCard, styles.inputCard]}>
                  <TextInput
                    value={humidity}
                    onChangeText={(t) => {
                      setHumidityError(false);
                      setHumidity(t.replace(/[^0-9]/g, ""));
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                    maxLength={3}
                  />
                  <Text style={styles.suffix}>%</Text>
                </View>
                {humidityError && (
                  <Text style={styles.errorText}>
                    1-100 arasında dəyər daxil edin
                  </Text>
                )}
                <Text style={styles.hint}>
                  Torpaq rütubəti bu faizdən aşağı düşəndə suvarma başlayacaq
                </Text>

                {/* Suvarma müddəti */}
                <Text style={styles.label}>Suvarma müddəti</Text>
                <TouchableOpacity
                  style={styles.valueCard}
                  onPress={() => setShowDurationPicker(true)}
                >
                  <Text style={styles.valueText}>{formatTime(duration)}</Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Buttons */}
              {isEdit ? (
                <View style={styles.editBtns}>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Yadda saxla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                    <Text style={styles.deleteBtnText}>Planı sil</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Planı yarat</Text>
                </TouchableOpacity>
              )}
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <TimePickerModal
        visible={showDurationPicker}
        onClose={() => setShowDurationPicker(false)}
        onStart={handleDurationSelect}
        mode="duration"
      />
    </>
  );
};

export default HumidityPlanModal;

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
  valueCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
    minWidth: 40,
    textAlign: "right",
    padding: 0,
  },
  suffix: {
    fontSize: 14,
    color: "#717784",
    marginLeft: 4,
  },
  hint: {
    fontSize: 12,
    color: "#717784",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginBottom: 8,
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
  editBtns: {
    marginTop: 8,
  },
  deleteBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "500",
  },
});
