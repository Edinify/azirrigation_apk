import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ConfirmProps {
  visible: boolean;
  onClose: () => void;
  text: string;
  desc: string;
  type: string;
  onFinish?: () => void;
}

const CommonConfirmModal = ({
  visible,
  onClose,
  onFinish,
  text,
  desc,
  type,
}: ConfirmProps) => {
  const router = useRouter();
  const handleDelete = () => {
    onFinish();
    onClose();
  };

  const [checked, setChecked] = useState(false);

  const [checkedDevice, setCheckedDevice] = useState(false);

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

          {/* Title */}
          <Text style={styles.title}>{text}</Text>

          {/* Description */}
          <Text style={styles.description}>{desc}</Text>

          {type === "valve" ? (
            <View>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Klapanı sil</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : type === "profile" ? (
            <View style={styles.buttonContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  value={checked}
                  onValueChange={setChecked}
                  color={checked ? "#0069FE" : "#D9DCE3"}
                />
                <Text style={styles.checkboxText}>
                  Məlumatlarımın silinəcəyini anlayıram.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  !checked && styles.deleteButtonDisabled,
                ]}
                disabled={!checked}
                onPress={onFinish}
              >
                <Text style={styles.deleteButtonText}>Hesabı sil</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancelText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : type === "subDevice" ? (
            <View>
              <View style={[styles.checkboxRow, styles.subDeviceCheckbox]}>
                <Checkbox
                  value={checkedDevice}
                  onValueChange={setCheckedDevice}
                  color={checkedDevice ? "#0069FE" : "#D9DCE3"}
                />
                <Text style={styles.checkboxText}>
                  Bu subcihaz və ona bağlı bütün məlumatların silinəcəyini başa
                  düşürəm.
                </Text>
              </View>
              <TouchableOpacity
                disabled={!checkedDevice}
                style={[
                  styles.deleteBtn,
                  !checkedDevice && styles.deleteButtonDisabled,
                ]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteBtnText}>Subcihazı sil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : type === "delete-device" ? (
            <View>
              <View style={[styles.checkboxRow, styles.subDeviceCheckbox]}>
                <Checkbox
                  value={checkedDevice}
                  onValueChange={setCheckedDevice}
                  color={checkedDevice ? "#0069FE" : "#D9DCE3"}
                />
                <Text style={styles.checkboxText}>
                  Bu cihaz və ona bağlı bütün məlumatların silinəcəyini başa
                  düşürəm.
                </Text>
              </View>
              <TouchableOpacity
                disabled={!checkedDevice}
                style={[
                  styles.deleteBtn,
                  !checkedDevice && styles.deleteButtonDisabled,
                ]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteBtnText}>Cihazı sil</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : type === "sensor" ? (
            <View style={{ marginTop: 40 }}>
              <CustomAddButton
                type="delete"
                size="l"
                text="Sensoru sil"
                onClick={handleDelete}
              />

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : type === "notification" ? (
            <View style={{ marginTop: 40 }}>
              <CustomAddButton
                type="delete"
                size="l"
                text="Bildirişi sil"
                onClick={handleDelete}
              />

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : type === "stop_configuration" ? (
            <View>
              <TouchableOpacity style={styles.continueBtn} onPress={onClose}>
                <Text style={styles.continueBtnText}>Davam et</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.cancelBtn]}
                onPress={() => router.replace("/(tabs)")}
              >
                <Text style={[styles.cancelBtnText, styles.stopBtnText]}>
                  Quraşdırmanı dayandır
                </Text>
              </TouchableOpacity>
            </View>
          ) : type === "zone" ? (
            <View style={{ marginTop: 40 }}>
              <CustomAddButton
                type="delete"
                size="l"
                text="Bitir"
                onClick={handleDelete}
              />

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : type === "plan" ? (
            <View style={{ marginTop: 40 }}>
              <CustomAddButton
                type="delete"
                size="l"
                text="Planı sil"
                onClick={handleDelete}
              />

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Ləğv et</Text>
              </TouchableOpacity>
            </View>
          ) : (
            ""
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CommonConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    width: "100%",
    maxWidth: 400,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: "#717784",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 16,
  },
  deleteBtn: {
    backgroundColor: "#FE171B",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 40,
  },
  deleteBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  cancelBtnText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "500",
  },

  continueBtn: {
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 40,
  },

  continueBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  stopBtnText: {
    color: "#FE171B",
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: 400,
    color: "#0E121B",
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#FE171B",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    textAlign: "center",
    fontSize: 16,
    color: "#0E121B",
    fontWeight: "500",
    marginTop: 12,
  },

  subDeviceCheckbox: {
    marginTop: 40,
  },
});
