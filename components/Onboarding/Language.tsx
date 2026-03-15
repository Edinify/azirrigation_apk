// components/Onboarding/LanguageModal.tsx
import AzerbaijanFlag from "@/assets/icons/languages/Azerbaijan.svg";
import RussianFlag from "@/assets/icons/languages/Russia.svg";
import EnglishFlag from "@/assets/icons/languages/UnitedKingdom.svg";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const languages = [
  {
    id: "az",
    code: "AZE",
    name: "Azərbaycan dili",
    FlagComponent: AzerbaijanFlag,
  },
  {
    id: "ru",
    code: "RU",
    name: "Русский",
    FlagComponent: RussianFlag, // ⬅️ Düzgün import
  },
  {
    id: "en",
    code: "ENG",
    name: "English",
    FlagComponent: EnglishFlag, // ⬅️ Düzgün import
  },
];

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  selectedLanguage: string;
}

export default function LanguageModal({
  visible,
  onClose,
  onSelect,
  selectedLanguage,
}: LanguageModalProps) {
  const [tempSelected, setTempSelected] = useState(selectedLanguage);

  const handleSelect = (code: string) => {
    setTempSelected(code);
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Drag indicator */}
          <View style={styles.dragIndicator} />

          <View style={styles.languageList}>
            {languages.map((language) => {
              const FlagComponent = language.FlagComponent;

              return (
                <TouchableOpacity
                  key={language.id}
                  style={styles.languageItem}
                  onPress={() => handleSelect(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <FlagComponent width={32} height={24} style={styles.flag} />
                    <Text style={styles.languageName}>{language.name}</Text>
                  </View>

                  {/* Radio button */}
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        tempSelected === language.code &&
                          styles.radioOuterSelected,
                      ]}
                    >
                      {tempSelected === language.code && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bağla düyməsi */}
          <TouchableOpacity style={styles.closeButton} onPress={handleConfirm}>
            <Text style={styles.closeButtonText}>Bağla</Text>
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
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D1D6",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  languageList: {
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
  radioContainer: {
    padding: 4,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D1D6",
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#0069FE",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0069FE",
  },
  closeButton: {
    backgroundColor: "#E4E7EC",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
  },
});
