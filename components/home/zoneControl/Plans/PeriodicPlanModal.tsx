import CloseIcon from "@/assets/icons/home/add-device/xmark-line.svg";
import TimePickerModal from "@/components/home/zoneControl/TimePicker/TimePicker";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Date Picker ─────────────────────────────────────────────────────────────

const MONTHS = [
  "yan",
  "fev",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avg",
  "sent",
  "okt",
  "noy",
  "dek",
];

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const DateScroller = ({
  value,
  onChange,
  data,
}: {
  value: number;
  onChange: (v: number) => void;
  data: string[];
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const isScrolling = useRef(false);
  const internalValue = useRef(value);

  useEffect(() => {
    if (!isScrolling.current && internalValue.current !== value) {
      scrollRef.current?.scrollTo({ y: value * ITEM_HEIGHT, animated: false });
      internalValue.current = value;
    }
  }, [value]);

  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
  };

  const handleScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setTimeout(() => {
      if (isScrolling.current) return;
      const index = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      internalValue.current = clamped;
      onChange(clamped);
      scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
    }, 100);
  };

  const handleMomentumBegin = () => {
    isScrolling.current = true;
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, data.length - 1));
    internalValue.current = clamped;
    isScrolling.current = false;
    onChange(clamped);
  };

  return (
    <View
      style={{
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        width: 80,
        overflow: "hidden",
      }}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollBegin={handleMomentumBegin}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
      >
        <View style={{ height: ITEM_HEIGHT * 2 }} />
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={{
              height: ITEM_HEIGHT,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              isScrolling.current = false;
              internalValue.current = index;
              onChange(index);
              scrollRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true,
              });
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: index === value ? "#0E121B" : "#C0C6D4",
                fontWeight: index === value ? "600" : "400",
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: ITEM_HEIGHT * 2 }} />
      </ScrollView>

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <View style={{ height: ITEM_HEIGHT * 2 }} />
        <View
          style={{
            height: ITEM_HEIGHT,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#E4E7EC",
          }}
        />
      </View>
    </View>
  );
};

const DatePickerModal = ({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (day: number, month: number) => void;
}) => {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate() - 1);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.dateContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />
          <Text style={styles.dateTitle}>Başlama tarixini seçin</Text>

          <View style={styles.dateRow}>
            <DateScroller
              value={selectedDay}
              onChange={setSelectedDay}
              data={days}
            />
            <DateScroller
              value={selectedMonth}
              onChange={setSelectedMonth}
              data={MONTHS}
            />
          </View>

          {/* Selection highlight */}
          <View style={styles.selectionHighlight} pointerEvents="none" />

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => onConfirm(selectedDay + 1, selectedMonth)}
          >
            <Text style={styles.confirmBtnText}>Təsdiqə</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

interface PeriodicPlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    dayRange: number;
    startDate: Date;
    startTime: string;
    duration: number;
  }) => void;
  onDelete?: () => void;
  editData?: {
    _id: string;
    dayRange: number;
    startDate: string;
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

const formatDate = (day: number, month: number) => {
  return `${String(day).padStart(2, "0")} ${MONTHS[month]}`;
};

const PeriodicPlanModal = ({
  visible,
  onClose,
  onSave,
  onDelete,
  editData,
}: PeriodicPlanModalProps) => {
  const isEdit = !!editData;
  const today = new Date();

  const [dayRange, setDayRange] = useState("3");
  const [startDay, setStartDay] = useState(today.getDate());
  const [startMonth, setStartMonth] = useState(today.getMonth());
  const [startTime, setStartTime] = useState("07:00");
  const [duration, setDuration] = useState(900);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [intervalError, setIntervalError] = useState(false);

  useEffect(() => {
    if (editData) {
      setDayRange(String(editData.dayRange));
      setStartTime(editData.startTime);
      setDuration(editData.duration);
      // startDate parse
      if (editData.startDate) {
        const d = new Date(editData.startDate);
        setStartDay(d.getDate());
        setStartMonth(d.getMonth());
      }
    } else {
      setDayRange("3");
      setStartDay(today.getDate());
      setStartMonth(today.getMonth());
      setStartTime("07:00");
      setDuration(900);
    }
    setIntervalError(false);
  }, [editData, visible]);

  const handleStartTimeSelect = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    setStartTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    setShowStartTimePicker(false);
  };

  const handleDateConfirm = (day: number, month: number) => {
    setStartDay(day);
    setStartMonth(month);
    setShowDatePicker(false);
  };

  const handleSave = () => {
    if (!dayRange || Number(dayRange) < 1) {
      setIntervalError(true);
      return;
    }

    const year = today.getFullYear();
    const startDate = `${year}-${String(startMonth + 1).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`;

    onSave({
      dayRange: Number(dayRange),
      startDate: new Date(startDate),
      startTime,
      duration,
    });
    handleClose();
  };

  const handleClose = () => {
    setDayRange("3");
    setStartDay(today.getDate());
    setStartMonth(today.getMonth());
    setStartTime("07:00");
    setDuration(900);
    setIntervalError(false);
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
                    ? "Periodik planı redaktə edin"
                    : "Periodik plan yaradın"}
                </Text>
                <Text style={styles.subtitle}>
                  Bu zonada suvarmanın neçə gündən bir, hansı tarixdən və
                  saatdan başlayacağını seçin
                </Text>

                {/* Gün aralığı */}
                <Text style={styles.label}>Gün aralığı</Text>
                <View style={[styles.valueCard, styles.intervalCard]}>
                  <TextInput
                    value={dayRange}
                    onChangeText={(t) => {
                      setIntervalError(false);
                      setDayRange(t.replace(/[^0-9]/g, ""));
                    }}
                    keyboardType="numeric"
                    style={styles.intervalInput}
                    maxLength={2}
                  />
                  <Text style={styles.intervalSuffix}>/gündən bir</Text>
                </View>
                {intervalError && (
                  <Text style={styles.errorText}>Gün aralığını daxil edin</Text>
                )}

                {/* Başlama tarixi */}
                <Text style={styles.label}>Başlama tarixi</Text>
                <TouchableOpacity
                  style={styles.valueCard}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.valueText}>
                    {formatDate(startDay, startMonth)} {today.getFullYear()}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.hint}>
                  Suvarma seçilmiş tarixdən etibarən təyin edilmiş aralıqla
                  təkrarlanacaq
                </Text>

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

              {/* Buttons */}
              {isEdit ? (
                <View>
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

      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
      />
      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onStart={handleStartTimeSelect}
        mode="time"
      />
      <TimePickerModal
        visible={showDurationPicker}
        onClose={() => setShowDurationPicker(false)}
        onStart={(s) => {
          setDuration(s);
          setShowDurationPicker(false);
        }}
        mode="duration"
      />
    </>
  );
};

export default PeriodicPlanModal;

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
  intervalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  intervalInput: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
    minWidth: 30,
    textAlign: "right",
    padding: 0,
  },
  intervalSuffix: {
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

  // Date Picker
  dateContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4E7EC",
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  selectionHighlight: {
    position: "absolute",
    left: 24,
    right: 24,
    height: ITEM_HEIGHT,
    top: ITEM_HEIGHT * 2 + 80,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E4E7EC",
  },
  confirmBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  confirmBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
