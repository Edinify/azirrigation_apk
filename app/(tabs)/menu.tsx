import BookIcon from "@/assets/icons/menu/bookIcon.svg";
import DropIcon from "@/assets/icons/menu/drop-line.svg";
import InfoIcon from "@/assets/icons/menu/infoIcon.svg";
import ProfileArrow from "@/assets/icons/menu/profileArrow.svg";
import ProfileIcon from "@/assets/icons/menu/profileIcon.svg";
import QuestionIcon from "@/assets/icons/menu/questionIcon.svg";
import RouterIcon from "@/assets/icons/menu/router-line.svg";
import SensorIcon from "@/assets/icons/menu/sensor-line.svg";
import SettingsIcon from "@/assets/icons/menu/settings.svg";
import SupportIcon from "@/assets/icons/menu/supportIcon.svg";
import { useGetProfileQuery } from "@/services/profile/profileApi";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SupportModal from "../../components/Onboarding/Support";
const Menu = () => {
  interface User {
    fullName: string;
    phone: string;
  }

  const router = useRouter();

  const [openSupportModal, setOpenSupportModal] = useState(false);

  const { data } = useGetProfileQuery();

  const devices = [
    {
      id: 1,
      name: "Cihazlar",
      Icon: RouterIcon,
      click: () => router.push("/menu/device/deviceManagement"),
    },
    {
      id: 2,
      name: "Sensorlar",
      Icon: SensorIcon,
      click: () => router.push("/menu/device/sensors/sensors"),
    },
    {
      id: 3,
      name: "Ağıllı suvarma",
      Icon: DropIcon,
      click: () => router.push("/menu/smartIrrigation/smartIrrigation"),
    },
  ];

  const supports = [
    {
      id: 1,
      name: "Tez-tez verilən suallar",
      Icon: QuestionIcon,
      click: () => router.push("/menu/fag"),
    },
    {
      id: 2,
      name: "Dəstək",
      Icon: SupportIcon,
      click: () => setOpenSupportModal(true),
    },
    {
      id: 3,
      name: "Tətbiq bələdçisi",
      Icon: BookIcon,
      click: () => router.push("/menu/guide"),
    },
    {
      id: 4,
      name: "Haqqımızda",
      Icon: InfoIcon,
      click: () => router.push("/menu/about"),
    },
  ];
  return (
    <ScrollView style={styles.menuPage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileImgContainer}>
            <ProfileIcon />
          </View>
          <View style={styles.userDatas}>
            <Text style={styles.userNameText}>{data?.fullName}</Text>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() =>
                router.push({
                  pathname: "/profile",
                  params: {
                    fullName: data?.fullName,
                    phone: data?.phone,
                  },
                })
              }
            >
              <Text style={styles.profileText}>Profil</Text>
              <ProfileArrow style={styles.arrow} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.devicesContainer}>
          {devices?.map((device, index) => {
            const Icon = device.Icon;
            return (
              <TouchableOpacity
                key={device.id}
                onPress={device.click}
                style={[
                  styles.deviceCard,
                  index === devices.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View style={styles.deviceContent}>
                  <Icon />
                  <Text style={styles.deviceText}>{device.name}</Text>
                </View>

                <ProfileArrow />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsCard}
            onPress={() => router.push("/menu/settings")}
          >
            <View style={styles.deviceContent}>
              <SettingsIcon />
              <Text style={styles.deviceText}>Tənzimləmələr</Text>
            </View>

            <ProfileArrow />
          </TouchableOpacity>
        </View>
        <View style={styles.devicesContainer}>
          {supports?.map((support, index) => {
            const Icon = support.Icon;
            return (
              <TouchableOpacity
                onPress={support.click}
                key={support.id}
                style={[
                  styles.deviceCard,
                  index === supports.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View style={styles.deviceContent}>
                  <Icon />
                  <Text style={styles.deviceText}>{support.name}</Text>
                </View>
                <ProfileArrow />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {openSupportModal && (
        <SupportModal
          visible={openSupportModal}
          onClose={() => setOpenSupportModal(false)}
        />
      )}
    </ScrollView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  menuPage: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImgContainer: {
    padding: 14,
    borderRadius: "100%",
    backgroundColor: "rgba(0, 105, 254, 0.10)",
  },
  userDatas: {
    marginLeft: 16,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 600,
    color: "#0E121B",
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  profileText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 500,
  },
  arrow: {
    marginLeft: 10,
  },

  devicesContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
  },
  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  deviceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#0E121B",
    fontWeight: 500,
  },

  settingsContainer: {
    marginVertical: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
  },
  settingsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
