import DownArrowIcon from "@/assets/icons/home/add-device/down-line.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";

import { useUpdateMainMutation } from "@/services/devices/deviceApi";
import { useUpdateProfileMutation } from "@/services/profile/profileApi";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CommonUnitModal from "../CommonUnitModal/CommonUnitModal";

interface Props {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
  onClose: () => void;
  text: string;
  type: string;
  unit?: string;
  id?: string;
  currentWaterValue?: number;
  currentWaterUnit?: string;
  currentElectricValue?: number;
  currentElectricUnit?: string;
}

export type WaterUnit = "L/saat" | "m³/saat" | "L/deq" | "L/san" | "GPM";

export type ElectricUnit = "KW" | "W" | "HP";

interface WaterUnitOption {
  value: WaterUnit;
  label: string;
  description: string;
}

const WATER_UNITS: WaterUnitOption[] = [
  {
    value: "L/saat",
    label: "L/saat",
    description: "(litr/saat)",
  },
  {
    value: "m³/saat",
    label: "m³/saat",
    description: "(kub metr/saat)",
  },
  {
    value: "L/deq",
    label: "L/deq",
    description: "(litr/dəqiqə)",
  },
  {
    value: "L/san",
    label: "L/san",
    description: "(litr/saniyə)",
  },
  {
    value: "GPM",
    label: "GPM",
    description: "(gallon/dəqiqə)",
  },
];

interface ElectricUnitOption {
  value: ElectricUnit;
  label: string;
  description?: string;
}

const ELECTRIC_UNITS: ElectricUnitOption[] = [
  {
    value: "KW",
    label: "KW",
  },
  {
    value: "W",
    label: "W",
  },
  {
    value: "HP",
    label: "HP",
    description: "(at gücü)",
  },
];

const CommonUpdateInput = ({
  visible,
  value,
  onChange,
  onClose,
  text,
  unit,
  type,
  id,
  currentElectricUnit,
  currentElectricValue,
  currentWaterUnit,
  currentWaterValue,
}: Props) => {
  const [updateMain] = useUpdateMainMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const [waterConsumptionModal, setWaterConsumptionModal] = useState(false);

  const [electricPowerModal, setElectricPowerModal] = useState(false);

  const [selectedWaterUnit, setSelectedWaterUnit] = useState<WaterUnit>(
    (unit as WaterUnit) || "L/h",
  );

  const [selectedEletricUnit, setSelectedElectricUnit] = useState<ElectricUnit>(
    (unit as ElectricUnit) || "kW",
  );

  const handleUpdateDevice = async () => {
    try {
      if (type === "device") {
        await updateMain({
          mainDeviceId: id,
          body: { name: value },
        }).unwrap();
        onClose();
      } else if (type === "water") {
        await updateMain({
          mainDeviceId: id,
          body: {
            enginePerformance: {
              waterConsumption: {
                value: Number(value),
                unitOfMeasure: selectedWaterUnit,
              },
              electricity: {
                // ✅ mövcud dəyəri də göndər
                value: Number(currentElectricValue),
                unitOfMeasure: currentElectricUnit,
              },
            },
          },
        }).unwrap();
        onClose();
      } else if (type === "electric") {
        await updateMain({
          mainDeviceId: id,
          body: {
            enginePerformance: {
              electricity: {
                value: Number(value),
                unitOfMeasure: selectedEletricUnit,
              },
              waterConsumption: {
                // ✅ mövcud dəyəri də göndər
                value: Number(currentWaterValue),
                unitOfMeasure: currentWaterUnit,
              },
            },
          },
        }).unwrap();
        onClose();
      } else if (type === "profile") {
        await updateProfile({ fullName: value }).unwrap();
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (unit && type === "water") {
      setSelectedWaterUnit(unit as WaterUnit);
    }
    if (unit && type === "electric") {
      setSelectedElectricUnit(unit as ElectricUnit);
    }
  }, [unit, visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <View style={styles.content}>
            <TouchableOpacity style={styles.close} onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.title}>{text}</Text>

            {type === "device" ? (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={text}
                placeholderTextColor="#717784"
                style={styles.input}
                autoFocus
              />
            ) : type === "water" ? (
              <View style={styles.indicatorInput}>
                <TextInput
                  value={String(value)}
                  onChangeText={onChange}
                  placeholder={text}
                  placeholderTextColor="#717784"
                  style={styles.waterInput}
                  keyboardType="numeric"
                  autoFocus
                />
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => setWaterConsumptionModal(true)}
                >
                  <Text style={styles.valueText}>{selectedWaterUnit}</Text>
                  <DownArrowIcon style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ) : type === "electric" ? (
              <View style={styles.indicatorInput}>
                <TextInput
                  value={String(value)}
                  onChangeText={onChange}
                  placeholder={text}
                  placeholderTextColor="#717784"
                  style={styles.waterInput}
                  keyboardType="numeric"
                  autoFocus
                />
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => setElectricPowerModal(true)}
                >
                  <Text style={styles.valueText}>{selectedEletricUnit}</Text>
                  <DownArrowIcon style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.indicatorInput}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={text}
                  placeholderTextColor="#717784"
                  style={styles.waterInput}
                  // keyboardType="numeric"
                  autoFocus
                />
              </View>
            )}
          </View>

          <View style={styles.saveBtn}>
            <TouchableOpacity style={styles.btn} onPress={handleUpdateDevice}>
              <Text style={styles.btnText}>Yadda saxla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <CommonUnitModal
        visible={waterConsumptionModal}
        title="Su sərfiyyatı vahidi"
        options={WATER_UNITS}
        selectedValue={selectedWaterUnit}
        onSelect={(val) => {
          setSelectedWaterUnit(val);
        }}
        onClose={() => setWaterConsumptionModal(false)}
      />

      <CommonUnitModal
        visible={electricPowerModal}
        title="Elektrik gücü vahidi"
        options={ELECTRIC_UNITS}
        selectedValue={selectedEletricUnit}
        onSelect={(val) => {
          setSelectedElectricUnit(val);
        }}
        onClose={() => setElectricPowerModal(false)}
      />
    </Modal>
  );
};

export default CommonUpdateInput;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  close: {
    padding: 5,
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    position: "absolute",
    right: 20,
    top: 20,
    flexDirection: "row",
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0E121B",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: "400",
    marginTop: 24,
    color: "#0E121B",
    backgroundColor: "#F5F7FA",
  },
  btn: {
    backgroundColor: "#0069FE",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  indicatorInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    borderColor: "#0E121B",
    borderWidth: 1,
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12, // ✅ 8-dən 12-yə artırdım
  },
  valueText: {
    color: "#717784",
    fontSize: 16,
    fontWeight: "400",
  },
  waterInput: {
    flex: 1,
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 4, // ✅ Əlavə padding
  },
});
