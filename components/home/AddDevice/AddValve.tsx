import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import CommonValveCard from "@/components/commonComponents/CommonValveCard/CommonValveCard";
import {
  useAddMainValveMutation,
  useDeleteMainValveMutation,
  useUpdateMainValveMutation,
} from "@/services/devices/deviceApi";
import { setValves as setValvesAction } from "@/services/devices/deviceFormSlice";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import CommonConfirmModal from "../../commonComponents/CommonConfirmModal/CommonConfirmModal";
import AddValveModal from "./AddValveModal";

interface Valve {
  id: number;
  valve: string;
  name: string;
}

const AddValve = ({
  onNext,
  type,
  valves: initialValves,
  id,
}: {
  onNext: () => void;
  type: string;
  valves: any[];
  mainDeviceId?: string;
  id: string;
}) => {
  const dispatch = useDispatch();
  const { deviceId } = useSelector((state: any) => state.deviceForm);

  const [addMainValve] = useAddMainValveMutation();
  const [updateMainValve] = useUpdateMainValveMutation();
  const [deleteMainValve] = useDeleteMainValveMutation();
  const [showValveModal, setShowValveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [editingValve, setEditingValve] = useState<Valve | null>(null);
  const [valves, setValves] = useState<Valve[]>(
    initialValves?.map((v) => ({
      id: v.valveId,
      valve: `valve ${v.valveId}`,
      name: v.name,
    })) ?? [],
  );

  const [valveName, setValveName] = useState("");
  const [selectedValve, setSelectedValve] = useState("");

  const addNewValve = async () => {
    if (!valveName || !selectedValve) return;

    if (type === "device") {
      setValves((prev) => [
        ...prev,
        {
          id: Date.now(),
          valve: selectedValve,
          name: valveName,
        },
      ]);
      setValveName("");
      setSelectedValve("");
      setShowValveModal(false);
      return;
    } else if (type === "details") {
      try {
        await addMainValve({
          mainDeviceId: deviceId,
          valveId: Number(selectedValve.replace("valve ", "")),
          name: valveName,
        }).unwrap();

        setValveName("");
        setSelectedValve("");
        setShowValveModal(false);
      } catch (error) {
        console.log(error);
      }
    }

    // reset
  };

  const handleNext = () => {
    dispatch(
      setValvesAction(
        valves
          .filter((v) => v.valve)
          .map((v) => ({
            valveId: Number(v.valve.replace("valve ", "")),
            name: v.name,
          })),
      ),
    );
    onNext();
  };

  const updateValve = async () => {
    if (!valveName || !selectedValve || !editingValve) return;

    try {
      if (type === "device") {
        setValves((prev) =>
          prev.map((valve) =>
            valve.id === editingValve.id
              ? { ...valve, valve: selectedValve, name: valveName }
              : valve,
          ),
        );
      } else if (type === "details") {
        await updateMainValve({
          mainDeviceId: id,
          valveId: editingValve.id,
          body: {
            name: valveName,
            valveId: Number(selectedValve.replace("valve ", "")),
          },
        }).unwrap();
      }

      setValveName("");
      setSelectedValve("");
      setEditingValve(null);
      setShowValveModal(false);
    } catch (error) {
      console.log(error);
    }
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

  // Modal bağlananda reset et
  const handleCloseModal = () => {
    setValveName("");
    setSelectedValve("");
    setEditingValve(null);
    setShowValveModal(false);
  };

  const handleDeleteValve = (id: number) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    if (selectedDeleteId !== null) {
      try {
        if (type === "details") {
          await deleteMainValve({
            mainDeviceId: deviceId,
            valveId: selectedDeleteId,
          }).unwrap();
        } else if (type === "device") {
          setValves((prev) => prev.filter((v) => v.id !== selectedDeleteId));
        }

        setShowDeleteModal(false);
      } catch (error) {
        console.log(error);
      }
      setSelectedDeleteId(null);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.stepContainer}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {type === "details" ? (
            <View style={styles.header}>
              <TouchableOpacity onPress={onNext}>
                <BackIcon />
              </TouchableOpacity>
              <Text style={styles.headerText}>Klapan bağlantıları</Text>
            </View>
          ) : (
            <Text style={styles.stepTitle}>Klapan bağlantılarını seçin</Text>
          )}
          <Text style={styles.stepSubtitle}>
            Hər klapan kabeli platada hansı Valve 1/2/3…-ə qoşulubsa, onu seçin.
            Bu addım sistemin düzgün işləməsi üçün vacibdir.
          </Text>

          <CommonValveCard
            valves={valves}
            onEditValve={handleEditValve}
            onDeleteValve={handleDeleteValve}
            onAddValve={handleAddNewValve}
          />
        </ScrollView>

        {type === "device" && (
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              valves.length === 0 && styles.primaryBtnDisabled,
            ]}
            disabled={valves.length === 0}
            onPress={handleNext}
          >
            <Text style={styles.primaryBtnText}>Davam et</Text>
          </TouchableOpacity>
        )}

        <AddValveModal
          visible={showValveModal}
          onClose={handleCloseModal}
          valveName={valveName}
          setValveName={setValveName}
          selectedValve={selectedValve}
          setSelectedValve={setSelectedValve}
          onAdd={editingValve ? updateValve : addNewValve}
          isEdit={!!editingValve}
          valvePortCount={valves.length}
          type="valve"
          usedValves={
            editingValve
              ? valves
                  .filter((v) => v.id !== editingValve.id) // ✅ edit edərkən özünü disabled etmə
                  .map((v) => v.valve)
              : valves.map((v) => v.valve) // ✅ yeni əlavə edərkən hamısı disabled
          }
        />

        <CommonConfirmModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onFinish={handleDeleteConfirm}
          text="Klapanı silmək istədiyinizdən əminsiniz?"
          desc="Bu klapan və seçilmiş valve portu əlaqəsi silinəcək. Sonra yenidən əlavə edə bilərsiniz."
          type="valve"
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default AddValve;

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1, // ƏLAVƏ
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: "space-between", // ƏLAVƏ
    backgroundColor: "#F5F7FA",
  },

  header: {
    marginVertical: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    width: "100%",
    textAlign: "center",
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 600,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0E121B",
    marginBottom: 12,
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    lineHeight: 20,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    backgroundColor: "#A0A8B0",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  valveCards: {
    marginBottom: 16,
  },
  valveCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minHeight: 70,
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
});
