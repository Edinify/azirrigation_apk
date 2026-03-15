import PlusIcon from "@/assets/icons/menu/smart-irrigation/plus-line.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import { useGetMainDropdownQuery } from "@/services/devices/deviceApi";
import { DeviceDropdownItem } from "@/types/device.types";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import AddSubDevice from "../../AddSubDevice/AddSubDevice";

interface ValveProps {
  visible: boolean;
  onClose: () => void;
  selectedDevice: DeviceDropdownItem | null;
  setSelectedDevice: (value: DeviceDropdownItem) => void;
  addDevice: () => void;
}

const DeviceListModal = ({
  visible,
  onClose,
  selectedDevice,
  setSelectedDevice,
  addDevice,
}: ValveProps) => {
  const [showSubDevice, setShowSubDevice] = useState(false);

  const { data } = useGetMainDropdownQuery();
  const dispatch = useDispatch();

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
          <View style={styles.headerContent}>
            <Text style={styles.titleText}>Cihazlar</Text>
          </View>
          <View style={styles.deviceListContainer}>
            {data?.map((data) => (
              <TouchableOpacity
                key={data._id}
                style={[
                  styles.deviceCard,
                  selectedDevice?._id === data._id ? styles.activeDevice : "",
                ]}
                onPress={() => setSelectedDevice(data)}
              >
                <Text>{data.name}</Text>
                {selectedDevice?._id === data._id && (
                  <TouchableOpacity
                    style={styles.addSubdeviceBtn}
                    onPress={() => setShowSubDevice(true)}
                  >
                    <PlusIcon />
                    <Text style={styles.subDeviceText}>Subcihaz</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ marginTop: 40 }}>
            <CustomAddButton
              text="Cihaz əlavə et"
              size="l"
              onClick={addDevice}
            />
          </View>
        </Pressable>
      </Pressable>

      <Modal
        visible={showSubDevice}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddSubDevice onNext={() => setShowSubDevice(false)} type="details" />
      </Modal>
    </Modal>
  );
};

export default DeviceListModal;

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
    width: 36,
    height: 6,
    borderRadius: 100,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 20,
  },

  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 32,
  },
  titleText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "600",
  },

  deviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    marginTop: 12,
  },

  activeDevice: {
    borderColor: "#0069FE",
  },

  addSubdeviceBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#E4E7EC",
  },

  subDeviceText: {
    marginLeft: 4,
    color: "#0E121B",
    fontSize: 14,
    fontWeight: 400,
  },
});
