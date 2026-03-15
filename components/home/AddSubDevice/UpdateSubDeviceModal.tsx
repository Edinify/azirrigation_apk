import TrashIcon from "@/assets/icons/home/add-device/trash.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import CommonValveCara from "@/components/commonComponents/CommonValveCard/CommonValveCard";
import React, { useEffect, useState } from "react";
import AddValveModal from "../AddDevice/AddValveModal";

interface AddSubDeviceProps {
  visible: boolean;
  onClose: () => void;
  subDeviceName: string;
  setSubDeviceName: (valve: string) => void;
  isEdit?: boolean;
  onSave: (valves: Valve[]) => void; // ƏLAVƏ
  initialValves: Valve[]; // ƏLAVƏ
}

interface Valve {
  id: number;
  valve: string;
  name: string;
}

const UpdateSubDeviceModal = ({
  visible,
  onClose,
  isEdit,
  subDeviceName,
  setSubDeviceName,
  onSave,
  initialValves,
}: AddSubDeviceProps) => {
  const [showValveModal, setShowValveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [editingValve, setEditingValve] = useState<Valve | null>(null);
  const [valves, setValves] = useState<Valve[]>(initialValves);
  const [valveName, setValveName] = useState("");
  const [selectedValve, setSelectedValve] = useState("");

  const [showSubDeviceDeleteModal, setShowSubDeviceDeleteModal] =
    useState(false);

  useEffect(() => {
    if (visible) {
      setValves(initialValves);
    }
  }, [visible, initialValves]);

  const addNewValve = () => {
    if (!valveName || !selectedValve) return;

    const payload: Valve = {
      id: Date.now(),
      valve: selectedValve,
      name: valveName,
    };

    setValves((prev) => [...prev, payload]);

    // reset
    setValveName("");
    setSelectedValve("");
    setShowValveModal(false);
  };

  // Valve update et
  const updateValve = () => {
    if (!valveName || !selectedValve || !editingValve) return;

    setValves((prev) =>
      prev.map((valve) =>
        valve.id === editingValve.id
          ? { ...valve, valve: selectedValve, name: valveName }
          : valve,
      ),
    );

    // reset
    setValveName("");
    setSelectedValve("");
    setEditingValve(null);
    setShowValveModal(false);
  };

  const handleEditValve = (valve: Valve) => {
    setEditingValve(valve);
    setValveName(valve.name);
    setSelectedValve(valve.valve);
    setShowValveModal(true);
  };

  const handleAddNewValve = () => {
    setEditingValve(null);
    setValveName("");
    setSelectedValve("");
    setShowValveModal(true);
  };

  const handleSave = () => {
    if (!subDeviceName) return;
    onSave(valves);
  };

  const renderRightActions = (id: number) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => {
          setSelectedDeleteId(id);
          setShowDeleteModal(true);
        }}
        activeOpacity={0.8}
      >
        <TrashIcon />
      </TouchableOpacity>
    );
  };

  const handleCloseModal = () => {
    setValveName("");
    setSelectedValve("");
    setEditingValve(null);
    setShowValveModal(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedDeleteId !== null) {
      setValves((prev) => prev.filter((data) => data.id !== selectedDeleteId));
      setSelectedDeleteId(null);
    }
  };

  const handleDeleteValve = (id: number) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.titleText}>Subcihazı redaktə et</Text>
            {/* <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconContainer}
            >
              <CloseIcon width={20} height={20} />
            </TouchableOpacity> */}
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ marginTop: 32 }}
          >
            <TextInput
              placeholder="Subcihaz adı"
              value={subDeviceName}
              onChangeText={setSubDeviceName}
              style={styles.input}
            />
            <View style={styles.valveContainer}>
              <Text style={styles.valveText}>Klapanlar</Text>
              <CommonValveCara
                valves={valves}
                onEditValve={handleEditValve}
                onDeleteValve={handleDeleteValve}
                onAddValve={handleAddNewValve}
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, !subDeviceName && styles.saveBtnDisabled]}
              disabled={!subDeviceName}
              onPress={handleSave}
            >
              <Text style={styles.saveBtnText}>Yadda saxla</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setShowSubDeviceDeleteModal(true)}
          >
            <Text style={styles.deleteBtnText}>Subcihazı sil</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>

      <AddValveModal
        visible={showValveModal}
        onClose={handleCloseModal}
        valveName={valveName}
        setValveName={setValveName}
        selectedValve={selectedValve}
        setSelectedValve={setSelectedValve}
        onAdd={editingValve ? updateValve : addNewValve}
        isEdit={!!editingValve}
      />

      <CommonConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onFinish={handleDeleteConfirm}
        text="Klapanı silmək istədiyinizdən əminsiniz?"
        desc="Bu klapan və seçilmiş valve portu əlaqəsi silinəcək. Sonra yenidən əlavə edə bilərsiniz."
        type="valve"
      />

      <CommonConfirmModal
        visible={showSubDeviceDeleteModal}
        onClose={() => setShowSubDeviceDeleteModal(false)}
        onFinish={handleDeleteConfirm}
        text="Subcihazı silmək istədiyinizdən əminsiniz?"
        desc="Bu subcihazı sildikdə cihazın özü və bütün suvarma planları qalıcı olaraq silinəcək və bu əməliyyatı geri qaytarmaq mümkün olmayacaq."
        type="subDevice"
      />
    </Modal>
  );
};

export default UpdateSubDeviceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#F5F7FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    height: "100%",
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
    flexDirection: "row",
    alignItems: "center",
  },

  titleText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "600",
    width: "80%",
    textAlign: "center",
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

  valveContainer: {
    marginTop: 24,
    flex: 1,
  },

  valveCardContent: {
    flex: 1, // ƏLAVƏ
  },
  valveTitle: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "500",
  },
  valveSubtitle: {
    marginTop: 6,
    color: "#717784",
    fontSize: 12,
    fontWeight: "400",
  },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignSelf: "stretch",
    height: 70,
  },

  valveText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
    marginBottom: 8,
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
    alignItems: "center",
    justifyContent: "space-between",
  },

  valveScrollContainer: {
    maxHeight: 250, // ƏLAVƏ - max hündürlük
    marginVertical: 16, // ƏLAVƏ
  },

  valveCards: {
    // ƏLAVƏ - bu style yox idi
    gap: 12,
  },

  valveCard: {
    flexDirection: "row", // ƏLAVƏ
    justifyContent: "space-between", // ƏLAVƏ
    alignItems: "center", // ƏLAVƏ
    backgroundColor: "white", // ƏLAVƏ
    paddingVertical: 12,
    paddingHorizontal: 16, // DƏYİŞDİ - 24 → 16
    borderRadius: 16, // DƏYİŞDİ - 12 → 16
    minHeight: 70, // ƏLAVƏ
  },

  emptyText: {
    // ƏLAVƏ
    textAlign: "center",
    color: "#717784",
    fontSize: 14,
    paddingVertical: 20,
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

  addValveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  addValveBtnText: {
    fontSize: 16,
    color: "#0069FE",
    fontWeight: "500",
    marginLeft: 6,
  },

  saveBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20, // ƏLAVƏ
  },
  saveBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#FE171B",
    fontSize: 16,
    fontWeight: 500,
  },
});
