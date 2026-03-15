import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

const TimePicker = ({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const items = Array.from({ length: max }, (_, i) => i);
  const isScrolling = useRef(false);
  const internalValue = useRef(value);

  useEffect(() => {
    // ✅ Yalnız xaricdən fərqli dəyər gələndə scroll et
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
    // momentum başlayacaqsa müdaxilə etmə
    setTimeout(() => {
      if (isScrolling.current) return;
      const index = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, max - 1));
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
    const clamped = Math.max(0, Math.min(index, max - 1));
    internalValue.current = clamped;
    // ✅ Əvvəlcə false et, sonra onChange — useEffect scroll etməsin
    isScrolling.current = false;
    onChange(clamped);
    // ✅ Momentum snap artıq etdi, əlavə scrollTo lazım deyil
  };

  return (
    <View
      style={{
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        width: 64,
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
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.7}
            style={{
              height: ITEM_HEIGHT,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              // ✅ Item-a tıklayanda da seç
              onChange(item);
              scrollRef.current?.scrollTo({
                y: item * ITEM_HEIGHT,
                animated: true,
              });
            }}
          >
            <Text
              style={{
                fontSize: 22,
                color: item === value ? "#0E121B" : "#C0C6D4",
                fontWeight: item === value ? "600" : "400",
              }}
            >
              {String(item).padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: ITEM_HEIGHT * 2 }} />
      </ScrollView>

      {/* ✅ Seçim xətti */}
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

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onStart: (seconds: number) => void;
  mode?: "duration" | "time";
}

const TimePickerModal = ({
  visible,
  onClose,
  onStart,
  mode = "time",
}: TimePickerModalProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [disabled, setDisabled] = useState(false);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const handleStart = () => {
    if (mode === "time") {
      onStart(hours * 3600 + minutes * 60);
    } else {
      onStart(hours * 3600 + minutes * 60 + seconds);
    }
    setDisabled(true);
  };

  const handleClose = () => {
    setDisabled(false);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setDisabled(false);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
    }
  }, [visible]);

  const isDisabled =
    disabled ||
    (mode === "time"
      ? hours === 0 && minutes === 0
      : hours === 0 && minutes === 0 && seconds === 0);

  return (
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
          <View style={styles.handle} />
          <Text style={styles.title}>Suvarma müddəti seçin</Text>

          <View style={styles.pickerRow}>
            {mode === "duration" ? (
              <>
                <TimePicker value={hours} onChange={setHours} max={24} />
                <Text style={styles.label}>saat</Text>
                <TimePicker value={minutes} onChange={setMinutes} max={60} />
                <Text style={styles.label}>dəq</Text>
                <TimePicker value={seconds} onChange={setSeconds} max={60} />
                <Text style={styles.label}>san</Text>
              </>
            ) : (
              <>
                <TimePicker value={hours} onChange={setHours} max={24} />
                <Text style={styles.label}>:</Text>
                <TimePicker value={minutes} onChange={setMinutes} max={60} />
              </>
            )}
          </View>

          <TouchableOpacity
            style={[styles.startBtn, isDisabled && styles.startBtnDisabled]}
            disabled={isDisabled}
            onPress={handleStart}
          >
            <Text style={styles.startBtnText}>Başlat</Text>
          </TouchableOpacity>
          {/* <CustomAddButton
            text="Başlat"
            onClick={handleStart}
            addDisabled={totalSeconds === 0}
            size="l"
          /> */}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default TimePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
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
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
    marginBottom: 24,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#0E121B",
    fontWeight: "500",
    marginHorizontal: 4,
  },
  startBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  startBtnDisabled: {
    backgroundColor: "#0069FE",
    opacity: 0.5,
  },
  startBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
