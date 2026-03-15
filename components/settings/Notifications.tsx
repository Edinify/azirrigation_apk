import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SwitchToggle from "react-native-switch-toggle";

export interface NotificationProps {
  visible: boolean;
  onClose: () => void;
}

export interface IrrigationItem {
  id: number;
  label: string;
  desc: string;
}

export interface AnnouncementItem {
  id: number;
  label: string;
  desc: string;
}

const Notifications = ({ visible, onClose }: NotificationProps) => {
  const irrigationData: IrrigationItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "Suvarma xətaları",
        desc: "Su axını, hovuz və təzyiq problemi olanda.",
      },
      {
        id: 2,
        label: "Başlanma və bitmə",
        desc: "Zonada suvarma başlayanda və bitəndə.",
      },
      {
        id: 3,
        label: "Aşağı rütubət",
        desc: "Sahədə rütubət həddən aşağı düşəndə.",
      },
    ],
    [],
  );

  const announcementData: IrrigationItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "AI məsləhətləri",
        desc: "AI-dan suvarma və mövsüm üzrə məsləhətlər.",
      },
      {
        id: 2,
        label: "Sistem elanları",
        desc: "Vacib yeniləmə və texniki elan bildirişləri.",
      },
    ],
    [],
  );

  const [irrigationSwitchStates, setIrrigationSwitchStates] = useState<
    Record<number, boolean>
  >(() =>
    irrigationData.reduce(
      (acc, item) => {
        acc[item.id] = false; // hamısı OFF olaraq başlayır
        return acc;
      },
      {} as Record<number, boolean>,
    ),
  );

  const [announcementSwitchStates, setAnnouncementSwitchStates] = useState<
    Record<number, boolean>
  >(() =>
    announcementData.reduce(
      (acc, item) => {
        acc[item.id] = false;
        return acc;
      },
      {} as Record<number, boolean>,
    ),
  );

  const toggleIrrigationSwitch = (id: number) => {
    setIrrigationSwitchStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAnnouncementSwitch = (id: number) => {
    setAnnouncementSwitchStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };
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
            <Text style={styles.headerTitle}>Bildirişlər</Text>
            <View style={styles.placeholder} />
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.irrigationContainer}>
              <Text style={styles.contentText}>Suvarma bildirişləri</Text>
              <View style={styles.commonCards}>
                {irrigationData?.map((data) => (
                  <View
                    key={data.id}
                    style={[
                      styles.commonCard,
                      data.id === 1 && { marginTop: 0 },
                    ]}
                  >
                    <View>
                      <Text style={styles.labelText}>{data.label}</Text>
                      <Text style={styles.descText}>{data?.desc}</Text>
                    </View>
                    <View style={styles.rightSide}>
                      <TouchableOpacity style={{ marginLeft: 8 }}>
                        <SwitchToggle
                          switchOn={irrigationSwitchStates[data.id]}
                          onPress={() => toggleIrrigationSwitch(data.id)}
                          circleColorOn="white"
                          circleColorOff="white"
                          backgroundColorOn="#00AB1C"
                          backgroundColorOff="#E5E7EB"
                          containerStyle={{
                            width: 60,
                            height: 32,
                            borderRadius: 25,
                            padding: 2,
                          }}
                          circleStyle={{
                            width: 28,
                            height: 28,
                            borderRadius: 20,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.announcementContainer}>
              <Text style={styles.contentText}>Məsləhətlər və elanlar</Text>
              <View style={styles.commonCards}>
                {announcementData?.map((data) => (
                  <View
                    key={data.id}
                    style={[
                      styles.commonCard,
                      data.id === 1 && { marginTop: 0 },
                    ]}
                  >
                    <View>
                      <Text style={styles.labelText}>{data.label}</Text>
                      <Text style={styles.descText}>{data?.desc}</Text>
                    </View>
                    <View style={styles.rightSide}>
                      <TouchableOpacity style={{ marginLeft: 8 }}>
                        <SwitchToggle
                          switchOn={announcementSwitchStates[data.id]}
                          onPress={() => toggleAnnouncementSwitch(data.id)}
                          circleColorOn="white"
                          circleColorOff="white"
                          backgroundColorOn="#00AB1C"
                          backgroundColorOff="#E5E7EB"
                          containerStyle={{
                            width: 60,
                            height: 32,
                            borderRadius: 25,
                            padding: 2,
                          }}
                          circleStyle={{
                            width: 28,
                            height: 28,
                            borderRadius: 20,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Notifications;

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
  // contentContainer: {
  //   paddingVertical: 16,
  //   paddingHorizontal: 12,
  // },

  contentText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },

  commonCards: {
    marginTop: 8,
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  commonCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
  },

  rightSide: {
    flexDirection: "row",
    alignItems: "center",
  },

  labelText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
  descText: {
    color: "#717784",
    fontSize: 12,
    fontWeight: 400,
  },

  valueText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },

  announcementContainer: {
    marginTop: 24,
  },
});
