import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import AboutValvePort from "./AboutValvePort";

interface AddValveProps {
  visible: boolean;
  onClose: () => void;
  valveName: string;
  setValveName: (valve: string) => void;
  selectedValve: string;
  setSelectedValve: (valve: string) => void;
  onAdd: () => void;
  isEdit?: boolean;
  valvePortCount?: number;
  usedValves: [];
  type: string;
}

const AddValveModal = ({
  visible,
  onClose,
  valveName,
  setValveName,
  setSelectedValve,
  selectedValve,
  onAdd,
  isEdit,
  valvePortCount,
  usedValves,
  type,
}: AddValveProps) => {
  const [showModal, setShowModal] = useState(false);

  const { valvePortCount: deviceValvePortCount } = useSelector(
    (state) => state.deviceForm,
  );

  const valvePortCountData =
    type === "zone" ? valvePortCount : deviceValvePortCount;

  const [keyboardHeight, setKeyboardHeight] = useState(0); // ✅

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const valvePorts = Array.from({ length: valvePortCountData }, (_, i) => ({
    id: i + 1,
    name: `valve ${i + 1}`,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.container,
            {
              paddingBottom:
                keyboardHeight > 0 ? keyboardHeight * 0.5 + 16 : 40,
            }, // ✅
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconContainer}
            >
              <CloseIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.headerContent}>
              <Text style={styles.titleText}>
                {" "}
                {isEdit ? "Klapanı redaktə et" : "Klapan əlavə et"}
              </Text>
            </View>
            <TextInput
              placeholder="Klapan adını daxil edin"
              value={valveName}
              onChangeText={setValveName}
              style={styles.input}
              placeholderTextColor="#0E121B"
            />
            <View style={styles.selectedValveContainer}>
              <View style={styles.selectedValveContent}>
                <Text style={styles.valveText}>Qoşulduğu klapan portu</Text>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                  <Text style={styles.valvePortText}>Valve portu nədir?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.valvesCards}>
                {valvePorts.map((valve) => {
                  const isActive = selectedValve === valve?.name;
                  const isUsed = usedValves.includes(valve?.name); // ✅ artıq seçilibmi

                  return (
                    <TouchableOpacity
                      key={valve?.id}
                      style={[
                        styles.valveCard,
                        isActive && styles.valveCardActive,
                        isUsed && styles.valveCardDisabled, // ✅ disabled stil
                      ]}
                      onPress={() => !isUsed && setSelectedValve(valve?.name)} // ✅ disabled-da click yoxdur
                      disabled={isUsed}
                    >
                      <Text
                        style={[
                          styles.valveCardText,
                          isActive && styles.valveCardTextActive,
                          isUsed && styles.valveCardTextDisabled, // ✅ disabled mətn
                        ]}
                      >
                        {valve?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.descText}>
                Seçdiyiniz port sistem idarəsini müəyyən edir.
              </Text>
              <Text style={styles.descText}>
                Platadakı işarə ilə eyni olmalıdır.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={onAdd}
              disabled={valveName === ""}
            >
              <Text style={styles.addBtnText}>
                {isEdit ? "Yadda saxla" : "Əlavə et"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
      <AboutValvePort visible={showModal} onClose={() => setShowModal(false)} />
    </Modal>
  );
};

export default AddValveModal;

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
  header: {
    position: "relative",
  },
  closeIconContainer: {
    position: "absolute",
    right: 5,
    top: -20,
    padding: 5,
    backgroundColor: "#EEF2F6",
    borderRadius: 100,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 32,
  },
  titleText: {
    color: "#0E121B",
    fontSize: 24,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: "#0E121B",
    borderColor: "0E121B",
    borderWidth: 1,
    height: 60,
  },

  selectedValveContainer: {
    marginTop: 36,
  },

  selectedValveContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  valveText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 600,
  },

  valvePortText: {
    color: "#0069FE",
    fontSize: 12,
    fontWeight: 400,
  },

  valvesCards: {
    marginTop: 16,
    marginBottom: 6,
    flexDirection: "row",
    flexWrap: "wrap", // ✅ 3-dən çox olduqda alta düşür
    gap: 8, // ✅ aralarında boşluq
  },

  valveCard: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    width: "30%", // ✅ hər sırada 3 dənə
  },

  valveCardDisabled: {
    backgroundColor: "#E4E7EC",
    opacity: 0.5,
  },

  valveCardTextDisabled: {
    color: "#A0A8B0",
  },

  valveCardText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },

  valveCardActive: {
    borderColor: "#0069FE",
    borderWidth: 1,
    backgroundColor: "rgba(0, 105, 254, 0.10)",
  },

  descText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
    maxWidth: "90%",
  },

  addBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  addBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
