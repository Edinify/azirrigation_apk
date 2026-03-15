// components/Settings/UnitsModal.tsx
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import ProfileArrow from "@/assets/icons/menu/profileArrow.svg";
import {
  DATE_FORMAT_OPTIONS,
  HOUR_FORMAT_OPTIONS,
  PRECIPITATION_OPTIONS,
  TEMPERATURE_OPTIONS,
  WIND_SPEED_OPTIONS,
} from "@/constants/UnitOptions";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OptionPickerModal, { OptionItem } from "./OptionPicker";

export interface UnitsProps {
  visible: boolean;
  onClose: () => void;
}

type ModalType =
  | "hourFormat"
  | "dateFormat"
  | "temperature"
  | "precipitation"
  | "windSpeed"
  | null;

const UnitsModal = ({ visible, onClose }: UnitsProps) => {
  // State - Seçilən dəyərlər
  const [hourFormat, setHourFormat] = useState("24h");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [temperature, setTemperature] = useState("celsius");
  const [precipitation, setPrecipitation] = useState("mm");
  const [windSpeed, setWindSpeed] = useState("kmh");

  // Hansı modal açıqdır
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Get label from value
  const getLabel = (options: OptionItem[], value: string) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  // Handler-lər
  const handleHourFormatSelect = (option: OptionItem) => {
    setHourFormat(option.value);
  };

  const handleDateFormatSelect = (option: OptionItem) => {
    setDateFormat(option.value);
  };

  const handleTemperatureSelect = (option: OptionItem) => {
    setTemperature(option.value);
  };

  const handlePrecipitationSelect = (option: OptionItem) => {
    setPrecipitation(option.value);
  };

  const handleWindSpeedSelect = (option: OptionItem) => {
    setWindSpeed(option.value);
  };

  // Sections data
  const sections = [
    {
      title: "Tarix və saat",
      items: [
        {
          id: 1,
          label: "Saat formatı",
          value: getLabel(HOUR_FORMAT_OPTIONS, hourFormat),
          click: () => setActiveModal("hourFormat"),
        },
        {
          id: 2,
          label: "Tarix formatı",
          value: getLabel(DATE_FORMAT_OPTIONS, dateFormat),
          click: () => setActiveModal("dateFormat"),
        },
      ],
    },
    {
      title: "Hava göstəriciləri",
      items: [
        {
          id: 3,
          label: "Temperatur",
          value: getLabel(TEMPERATURE_OPTIONS, temperature),
          click: () => setActiveModal("temperature"),
        },
        {
          id: 4,
          label: "Yağış miqdarı",
          value: getLabel(PRECIPITATION_OPTIONS, precipitation),
          click: () => setActiveModal("precipitation"),
        },
        {
          id: 5,
          label: "Külək sürəti",
          value: getLabel(WIND_SPEED_OPTIONS, windSpeed),
          click: () => setActiveModal("windSpeed"),
        },
      ],
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ölçü vahidləri</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {sections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionCard}>
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.itemRow,
                        itemIndex === 0 && { marginTop: 0 },
                      ]}
                      onPress={item.click}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.itemLabel}>{item.label}</Text>
                      <View style={styles.itemRight}>
                        <Text style={styles.itemValue}>{item.value}</Text>
                        <View style={styles.arrowIcon}>
                          <ProfileArrow width={20} height={20} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Option Picker Modals */}
      <OptionPickerModal
        visible={activeModal === "hourFormat"}
        onClose={() => setActiveModal(null)}
        onSelect={handleHourFormatSelect}
        title="Saat formatı"
        options={HOUR_FORMAT_OPTIONS}
        selectedValue={hourFormat}
      />

      <OptionPickerModal
        visible={activeModal === "dateFormat"}
        onClose={() => setActiveModal(null)}
        onSelect={handleDateFormatSelect}
        title="Tarix formatı"
        options={DATE_FORMAT_OPTIONS}
        selectedValue={dateFormat}
      />

      <OptionPickerModal
        visible={activeModal === "temperature"}
        onClose={() => setActiveModal(null)}
        onSelect={handleTemperatureSelect}
        title="Temperatur"
        options={TEMPERATURE_OPTIONS}
        selectedValue={temperature}
      />

      <OptionPickerModal
        visible={activeModal === "precipitation"}
        onClose={() => setActiveModal(null)}
        onSelect={handlePrecipitationSelect}
        title="Yağış miqdarı"
        options={PRECIPITATION_OPTIONS}
        selectedValue={precipitation}
      />

      <OptionPickerModal
        visible={activeModal === "windSpeed"}
        onClose={() => setActiveModal(null)}
        onSelect={handleWindSpeedSelect}
        title="Külək sürəti"
        options={WIND_SPEED_OPTIONS}
        selectedValue={windSpeed}
      />
    </>
  );
};

export default UnitsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
  },
  arrowIcon: {
    marginLeft: 4,
  },
});
