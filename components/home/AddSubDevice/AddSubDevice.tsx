import PlusIcon from "@/assets/icons/home/add-device/plus-line.svg";
import TrashIcon from "@/assets/icons/home/add-device/trash.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import RightArrowIcon from "@/assets/icons/rightIcon.svg";
import React, { useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import CommonConfirmModal from "../../commonComponents/CommonConfirmModal/CommonConfirmModal";
import AddSubDeviceModal from "./AddSubDeviceModal";
import UpdateSubDeviceModal from "./UpdateSubDeviceModal";
const Logo = require("@/assets/images/home/logo.png");

interface Valve {
  id: number;
  valve: string;
  name: string;
}

interface SubDevice {
  id: number;
  name: string;
  valves: Valve[];
}

const AddSubDevice = ({
  onNext,
  type,
}: {
  onNext: () => void;
  type: string;
}) => {
  const [showSubDeviceModal, setShowSubDeviceModal] = useState(false);
  const [showAddSubDeviceModal, setShowAddSubDeviceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [editingSubDevice, setEditingSubDevice] = useState<SubDevice | null>(
    null,
  );
  const [subDevices, setSubDevices] = useState<SubDevice[]>([
    {
      id: 1,
      name: "helllo",
      valves: [
        {
          id: 23234,
          valve: "fsdgs",
          name: "dgsdg",
        },
      ],
    },
  ]);
  const [subDeviceName, setSubDeviceName] = useState("");

  // ✅ Yeni subcihaz əlavə et (BLE-dən)
  const handleAddSubDeviceFromBLE = (name: string, valves: Valve[]) => {
    const payload: SubDevice = {
      id: Date.now(),
      name: name,
      valves: valves,
    };

    setSubDevices((prev) => [...prev, payload]);

    console.log("✅ New SubDevice added:", payload);

    // setShowAddSubDeviceModal(false);
  };

  const addNewSubDevice = (valves: Valve[]) => {
    if (!subDeviceName) return;

    const payload: SubDevice = {
      id: Date.now(),
      name: subDeviceName,
      valves: valves,
    };

    setSubDevices((prev) => [...prev, payload]);

    // reset
    setSubDeviceName("");
    setShowSubDeviceModal(false);
  };

  const updateSubDevice = (valves: Valve[]) => {
    if (!subDeviceName || !editingSubDevice) return;

    setSubDevices((prev) =>
      prev.map((device) =>
        device.id === editingSubDevice.id
          ? { ...device, name: subDeviceName, valves: valves }
          : device,
      ),
    );

    // reset
    setSubDeviceName("");
    setEditingSubDevice(null);
    setShowSubDeviceModal(false);
  };

  const handleEditSubDevice = (device: SubDevice) => {
    setEditingSubDevice(device);
    setSubDeviceName(device.name);
    setShowSubDeviceModal(true);
  };

  const handleCloseModal = () => {
    setSubDeviceName("");
    setEditingSubDevice(null);
    setShowSubDeviceModal(false);
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

  const handleDeleteConfirm = () => {
    if (selectedDeleteId !== null) {
      setSubDevices((prev) =>
        prev.filter((data) => data.id !== selectedDeleteId),
      );
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
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={onNext}>
                  <BackIcon />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.headerText,
                    subDevices.length === 0 && { width: "100%" },
                  ]}
                >
                  SubCihazlar
                </Text>
                {subDevices.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setShowAddSubDeviceModal(true)}
                  >
                    <PlusIcon />
                  </TouchableOpacity>
                )}
              </View>

              {subDevices.length === 0 && (
                <View style={styles.addDeviceContainer}>
                  <Image source={Logo} />
                  <Text style={styles.addDeviceText}>
                    QR kodu skan edin və suvarma cihazınızı tətbiqə qoşun
                  </Text>
                  <TouchableOpacity
                    style={styles.addDeviceBtn}
                    onPress={() => setShowAddSubDeviceModal(true)}
                  >
                    <Text style={styles.addDeviceBtnText}>
                      Subcihaz əlavə et
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.stepTitle}>Klapan bağlantılarını seçin</Text>
          )}

          <View style={styles.valveCards}>
            {subDevices.map((data) => (
              <Swipeable
                key={data.id}
                renderRightActions={() => renderRightActions(data.id)}
                overshootRight={false}
                friction={2}
              >
                <TouchableOpacity
                  style={styles.valveCard}
                  onPress={() => handleEditSubDevice(data)}
                >
                  <View style={styles.valveCardContent}>
                    <Text style={styles.valveTitle}>{data.name}</Text>
                    <Text style={styles.valveSubtitle}>
                      {data.valves.length}
                    </Text>
                  </View>
                  <RightArrowIcon />
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>
        </ScrollView>

        <UpdateSubDeviceModal
          visible={showSubDeviceModal}
          onClose={handleCloseModal}
          subDeviceName={subDeviceName}
          setSubDeviceName={setSubDeviceName}
          isEdit={!!editingSubDevice}
          onSave={editingSubDevice ? updateSubDevice : addNewSubDevice} // ƏLAVƏ
          initialValves={editingSubDevice?.valves || []} // ƏLAVƏ
        />

        <CommonConfirmModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onFinish={handleDeleteConfirm}
          text="Subcihazı silmək istədiyinizdən əminsiniz?"
          desc="Bu subcihazı sildikdə cihazın özü və bütün suvarma planları qalıcı olaraq silinəcək və bu əməliyyatı geri qaytarmaq mümkün olmayacaq."
          type="subDevice"
        />

        <AddSubDeviceModal
          visible={showAddSubDeviceModal}
          onClose={() => setShowAddSubDeviceModal(false)}
          onDeviceConnected={(device) => {
            console.log("Device connected:");
          }}
          onSaveSubDevice={handleAddSubDeviceFromBLE}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default AddSubDevice;

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
    // marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
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

  addDeviceContainer: {
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 72,
    paddingHorizontal: 70,
    height: "80%",
  },
  addDeviceText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 16,
  },
  addDeviceBtn: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#0069FE",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  addDeviceBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
