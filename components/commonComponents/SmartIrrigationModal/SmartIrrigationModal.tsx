import MinusIcon from "@/assets/icons/menu/smart-irrigation/minus-line.svg";
import PlusIcon from "@/assets/icons/menu/smart-irrigation/plus-line.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";

import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SmartIrrigationModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  currentValue: number;
  recommendedValue: number;
  minValue: number;
  maxValue: number;
  unit: string;
  onSave: (value: number) => void;
}

const SmartIrrigationModal = ({
  visible,
  onClose,
  title,
  currentValue,
  recommendedValue,
  minValue,
  maxValue,
  unit,
  onSave,
}: SmartIrrigationModalProps) => {
  const [value, setValue] = useState(currentValue);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      setValue(currentValue);
    }
  }, [visible, currentValue]);

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
          <View style={styles.handle} />

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          <View style={{ marginVertical: 48 }}>
            <View style={styles.valueContainer}>
              <TouchableOpacity
                style={styles.minusBtn}
                onPress={() => setValue(Math.max(minValue, value - 1))}
              >
                <MinusIcon />
              </TouchableOpacity>

              <Text style={styles.valueText}>
                {Math.round(value)} {unit}
              </Text>

              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() => setValue(Math.min(maxValue, value + 1))}
              >
                <PlusIcon />
              </TouchableOpacity>
            </View>

            <Text style={styles.recommendedText}>
              Tövsiyə olunan dəyər:
              <Text style={styles.unitText}>
                {" "}
                {recommendedValue} {unit}
              </Text>
            </Text>

            {/* Slider */}
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={minValue}
                maximumValue={maxValue}
                value={value}
                onValueChange={setValue}
                minimumTrackTintColor="#0069FE"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#0069FE"
                step={1}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>
                  {minValue} {unit}
                </Text>
                <Text style={styles.sliderLabel}>
                  {maxValue} {unit}
                </Text>
              </View>
            </View>
          </View>

          <CustomAddButton text="Təsdiqlə" onClick={handleSave} size="l" />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SmartIrrigationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 6,
    borderRadius: 100,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  minusBtn: {
    borderRadius: 8,
    padding: 6,
    backgroundColor: "#E4E7EC",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: 30,
    height: 30,
  },
  plusBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    padding: 6,
    backgroundColor: "#E4E7EC",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 24,
    color: "#0E121B",
    fontWeight: "600",
  },
  valueText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
    marginHorizontal: 24,
  },
  recommendedText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    textAlign: "center",
    marginTop: 16,
  },

  unitText: {
    color: "#0E121B",
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 8,
  },
  sliderContainer: {
    marginBottom: 32,
    marginTop: 48,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: "#717784",
  },
  confirmBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
