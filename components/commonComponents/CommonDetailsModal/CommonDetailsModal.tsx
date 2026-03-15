import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DetailsData {
  id: number;
  label: string;
  value: string;
}

interface DetailsProps {
  visible: boolean;
  onClose: () => void;
  data: DetailsData[];
  text: string;
}

const CommonDetailsModal = ({ visible, data, onClose, text }: DetailsProps) => {
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

          <Text style={styles.title}>{text}</Text>

          <View style={styles.dataCardContainer}>
            {data.map((d) => (
              <View key={d.id} style={styles.dataCard}>
                <Text style={styles.labelText}>{d.label}</Text>
                <Text style={styles.valueText}>{d.value}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Bağla</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CommonDetailsModal;

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

  dataCardContainer: {
    marginTop: 24,
  },

  dataCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  labelText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },
  valueText: {
    color: "#0E121B",
    fontSize: 14,
    fontWeight: 400,
  },

  closeBtn: {
    marginVertical: 36,
    backgroundColor: "#E4E7EC",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
});
