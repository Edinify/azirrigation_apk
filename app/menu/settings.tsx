import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import ProfileArrow from "@/assets/icons/menu/profileArrow.svg";
import Notifications from "@/components/settings/Notifications";
import Permissions from "@/components/settings/Permissions";
import { Timezone } from "@/constants/Timezones";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguageModal from "../../components/Onboarding/Language";
import TimezonePicker from "../../components/settings/Timezone";
import Units from "../../components/settings/Units";

export interface SettingItem {
  id: number;
  label: string;
  value?: string;
  click?: () => void;
}

export interface Permissiontem {
  id: number;
  label: string;
  click?: () => void;
}

const Settings = () => {
  const router = useRouter();

  const [country, setCountry] = useState<string>("AZE");
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [openTimezoneModal, setOpenTimezoneModal] = useState(false);
  const [openUnitsModal, setOpenUnitsModal] = useState(false);
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const [openPermissionModal, setOpenPermissionModal] = useState(false);
  const [timezone, setTimezone] = useState<Timezone>({
    id: "1",
    label: "Bakı vaxtı",
    offset: "GMT+4",
    value: "Asia/Baku",
  });

  const handleLanguageSelect = (languageCode: string) => {
    setCountry(languageCode);
    console.log("Seçilən dil:", languageCode);
  };

  const handleTimezoneSelect = (selectedTimezone: Timezone) => {
    setTimezone(selectedTimezone);
    console.log("Seçilən timezone:", selectedTimezone);
  };

  const commonDatas: SettingItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "Dil",
        value: country,
        click: () => setOpenLanguageModal(true),
      },
      {
        id: 2,
        label: "Saat qurşağı",
        value: `${timezone.label}`,
        click: () => setOpenTimezoneModal(true),
      },
      {
        id: 3,
        label: "Ölçü vahidləri",
        click: () => setOpenUnitsModal(true),
      },
    ],
    [timezone, country],
  );

  const permissionDatas: Permissiontem[] = [
    {
      id: 1,
      label: "Bildirişlər",
      click: () => setOpenNotificationsModal(true),
    },
    {
      id: 2,
      label: "Tətbiq icazələri",
      click: () => setOpenPermissionModal(true),
    },
  ];
  return (
    <SafeAreaView style={styles.settings}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/menu")}
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tənzimləmələr</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>Ümumi</Text>
          <View style={styles.commonCards}>
            {commonDatas?.map((data) => (
              <TouchableOpacity
                onPress={data.click}
                key={data.id}
                style={[styles.commonCard, data.id === 1 && { marginTop: 0 }]}
              >
                <View>
                  <Text style={styles.labelText}>{data.label}</Text>
                </View>
                <View style={styles.rightSide}>
                  {data.value && (
                    <Text style={styles.valueText}>{data.value}</Text>
                  )}
                  <ProfileArrow style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>İcazələr</Text>
          <View style={styles.commonCards}>
            {permissionDatas?.map((data) => (
              <TouchableOpacity
                onPress={data.click}
                key={data.id}
                style={[styles.commonCard, data.id === 1 && { marginTop: 0 }]}
              >
                <View>
                  <Text style={styles.labelText}>{data.label}</Text>
                </View>
                <View style={styles.rightSide}>
                  <ProfileArrow style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <LanguageModal
        visible={openLanguageModal}
        onClose={() => setOpenLanguageModal(false)}
        onSelect={handleLanguageSelect}
        selectedLanguage={country}
      />
      <TimezonePicker
        visible={openTimezoneModal}
        onClose={() => setOpenTimezoneModal(false)}
        onSelect={handleTimezoneSelect}
        selectedTimezone={timezone.value}
      />
      <Units
        visible={openUnitsModal}
        onClose={() => setOpenUnitsModal(false)}
      />
      <Notifications
        visible={openNotificationsModal}
        onClose={() => setOpenNotificationsModal(false)}
      />
      <Permissions
        visible={openPermissionModal}
        onClose={() => setOpenPermissionModal(false)}
      />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  settings: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },
  placeholder: {
    width: 40,
  },

  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

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
    marginTop: 24,
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

  valueText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },
});
