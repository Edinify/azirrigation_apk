import DownArrowIcon from "@/assets/icons/home/add-device/down-line.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { setDeviceInfo } from "@/services/devices/deviceFormSlice";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import CommonUnitModal from "../../commonComponents/CommonUnitModal/CommonUnitModal";
import LocationModal from "./LocationModal";

export interface LocationData {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export type WaterUnit = "L/h" | "L/min" | "L/san" | "m³/h" | "GPM";
export type PowerUnit = "kW" | "W" | "HP";

interface WaterUnitOption {
  value: WaterUnit;
  label: string;
  description: string;
}
const WATER_UNITS: WaterUnitOption[] = [
  {
    value: "L/h",
    label: "L/saat",
    description: "(litr/saat)",
  },
  {
    value: "m³/h",
    label: "m³/saat",
    description: "(kub metr/saat)",
  },
  {
    value: "L/min",
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
  value: PowerUnit;
  label: string;
  description?: string;
}

const ELECTRIC_UNITS: ElectricUnitOption[] = [
  {
    value: "kW",
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

const AddDeviceName = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null,
  );

  const [showLocationModal, setShowLocationModal] = useState(false);

  const [waterConsumption, setWaterConsumption] = useState("");

  const [waterConsumptionModal, setWaterConsumptionModal] = useState(false);
  const [selectedWaterUnit, setSelectedWaterUnit] = useState<WaterUnit>("L/h");

  const [electricPower, setElectricPower] = useState("");

  const [electricPowerModal, setElectricPowerModal] = useState(false);

  const [selectedEletricUnit, setSelectedElectricUnit] =
    useState<PowerUnit>("kW");

  const disabled = electricPower === "" || waterConsumption === "";

  const handleNext = () => {
    dispatch(
      setDeviceInfo({
        name,
        enginePerformance: {
          waterConsumption: {
            value: Number(waterConsumption),
            unitOfMeasure: selectedWaterUnit as any, // tip uyğunlaşdırması aşağıda
          },
          electricity: {
            value: Number(electricPower),
            unitOfMeasure: selectedEletricUnit as any,
          },
        },
        location: {
          lat: selectedLocation?.lat ?? 0,
          lng: selectedLocation?.lng ?? 0,
        },
      }),
    );
    onNext();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.stepContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepTitle}>Cihaz məlumatlarını tamamlayın</Text>
        <Text style={styles.stepSubtitle}>
          Bu məlumatlar daha dəqiq nəticələr üçün istifadə olunacaq.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Cihaz adı"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#0E121B"
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.input, styles.location]}
            onPress={() => setShowLocationModal(true)}
          >
            <Text style={{ color: selectedLocation ? "#000" : "#999" }}>
              {selectedLocation?.name || "Məkan (şəhər/rayon)"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.descText}>
            Məkan məlumatı hava proqnozunu dəqiq almaq və “Günün məsləhətləri”ni
            (məsələn, suvarma vaxtı və risk xəbərdarlıqları) həmin əraziyə uyğun
            göstərmək üçün istifadə olunur.
          </Text>
        </View>
        <View style={styles.indicatorsContainer}>
          <Text style={styles.indicatorTitle}>Motor göstəriciləri</Text>
          <Text style={styles.indicatorSubtitle}>
            Motor üzərində qeyd olunan dəyəri yazın və etiketdə göstərilən
            vahidi seçin.
          </Text>
          <View style={styles.indicatorInputContainer}>
            <View style={styles.indicatorInput}>
              <TextInput
                value={waterConsumption}
                onChangeText={setWaterConsumption}
                placeholder="Su sərfiyyatı"
                placeholderTextColor="#717784"
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
            <View style={[styles.indicatorInput, { marginTop: 20 }]}>
              <TextInput
                value={electricPower}
                onChangeText={setElectricPower}
                placeholder="Elektrik gücü"
                placeholderTextColor="#717784"
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
          </View>
          <View style={{ marginVertical: 20 }}>
            <CustomAddButton
              text="Davam et"
              size="l"
              onClick={handleNext}
              addDisabled={disabled}
            />
          </View>

          {/* <TouchableOpacity
            style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
            disabled={disabled}
            onPress={handleNext}
          >
            <Text style={styles.primaryBtnText}>Davam et</Text>
          </TouchableOpacity> */}
        </View>

        <LocationModal
          visible={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onLocationSelect={setSelectedLocation}
        />

        <CommonUnitModal
          visible={waterConsumptionModal}
          title="Su sərfiyyatı vahidi"
          options={WATER_UNITS}
          selectedValue={selectedWaterUnit}
          onSelect={setSelectedWaterUnit}
          onClose={() => setWaterConsumptionModal(false)}
        />

        <CommonUnitModal
          visible={electricPowerModal}
          title="Elektrik gücü vahidi"
          options={ELECTRIC_UNITS}
          selectedValue={selectedEletricUnit}
          onSelect={setSelectedElectricUnit}
          onClose={() => setElectricPowerModal(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddDeviceName;

const styles = StyleSheet.create({
  stepContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    // paddingBottom: 20,
    justifyContent: "space-between",
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#0E121B",
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    lineHeight: 20,
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  primaryBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  inputContainer: {
    marginVertical: 36,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: "#0E121B",
    height: 60,
  },

  location: {
    marginTop: 20,
    marginBottom: 8,
    justifyContent: "center",
  },

  descText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
    marginTop: 4,
  },

  indicatorsContainer: {},

  indicatorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0E121B",
  },

  indicatorSubtitle: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
    marginTop: 8,
  },

  indicatorInputContainer: {
    marginTop: 24,
  },

  indicatorInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
  },

  valueText: {
    color: "#717784",
    fontSize: 16,
    fontWeight: 400,
  },
});
