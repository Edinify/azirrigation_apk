import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import ProfileArrow from "@/assets/icons/menu/profileArrow.svg";
import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import CommonDetailsModal from "@/components/commonComponents/CommonDetailsModal/CommonDetailsModal";
import CommonUpdateInput from "@/components/commonComponents/CommonUpdateInput/CommonUpdateInput";
import AddValve from "@/components/home/AddDevice/AddValve";
import HideWifi from "@/components/home/AddDevice/HideWifi";
import LocationModal from "@/components/home/AddDevice/LocationModal";
import WifiStep from "@/components/home/AddDevice/WifiStep";
import AddSubDevice from "@/components/home/AddSubDevice/AddSubDevice";
import { useLocationName } from "@/hooks/useLocationName";
import {
  useDeleteMainMutation,
  useGetMainByIdQuery,
} from "@/services/devices/deviceApi";
import { resetDeviceForm } from "@/services/devices/deviceFormSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export interface LocationData {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const DeviceDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { device } = useLocalSearchParams();
  const parsedDevice = JSON.parse(device as string);

  const { data: mainData } = useGetMainByIdQuery(parsedDevice.deviceId);

  console.log(mainData, "main data");

  const { ssid } = useSelector((state) => state.deviceForm);

  const [deleteMain] = useDeleteMainMutation();

  const handleDeleteDevice = async () => {
    try {
      await deleteMain(parsedDevice.deviceId).unwrap();
      dispatch(resetDeviceForm());
    } catch (error) {
      console.log(error);
    }
  };

  const locationName = useLocationName(
    parsedDevice?.location?.lat,
    parsedDevice?.location?.lng,
  );

  const [showDevice, setShowDevice] = useState(false);
  const [showHideWifi, setShowHideWifi] = useState(false);
  const [deviceNameValue, setDeviceNameValue] = useState(parsedDevice?.name);
  const [showWifi, setShowWifi] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);

  const [locationValue, setLocationValue] = useState<LocationData | null>(null);

  const [showWater, setShowWater] = useState(false);

  const [waterValue, setWaterValue] = useState(
    parsedDevice?.enginePerformance?.waterConsumption?.value ?? 0,
  );
  const [waterUnit, setWaterUnit] = useState(
    parsedDevice?.enginePerformance?.waterConsumption?.unitOfMeasure ?? "L/h",
  );

  const [showElectric, setShowElectric] = useState(false);
  const [electricUnit, setElectricUnit] = useState(
    parsedDevice?.enginePerformance?.electricity?.unitOfMeasure ?? "kW",
  );
  const [electricValue, setElectricValue] = useState(
    parsedDevice?.enginePerformance?.electricity?.value ?? 0,
  );

  const [showValve, setShowValve] = useState(false);

  const [showSubDevice, setShowSubDevice] = useState(false);

  const [showDeviceDetails, setShowDeviceDetails] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (locationName) {
      setLocationValue({
        name: locationName,
        address: locationName,
        lat: parsedDevice?.location?.lat,
        lng: parsedDevice?.location?.lng,
      });
    }
  }, [locationName]);

  const commonDatas = [
    {
      id: 1,
      title: "Cihaz adı",
      value: deviceNameValue,
      click: () => setShowDevice(true),
    },
    {
      id: 2,
      title: "Wi-Fi bağlantısı",
      value: ssid || "",
      click: () => setShowWifi(true),
    },
    {
      id: 3,
      title: "Məkanı",
      value: locationValue?.name ?? "Yüklənir...",
      click: () => setShowLocationModal(true),
    },
  ];

  const motorDatas = [
    {
      id: 1,
      title: "Su sərfiyyatı",
      value: waterValue,
      click: () => setShowWater(true),
    },
    {
      id: 2,
      title: "Elektrik gücü",
      value: electricValue,
      click: () => setShowElectric(true),
    },
  ];

  const irrigationDatas = [
    {
      id: 1,
      title: "Klapanlar",
      value: parsedDevice.valves,
      click: () => setShowValve(true),
    },
    {
      id: 2,
      title: "Subcihazlar",
      value: parsedDevice?.subDevices,
      click: () => setShowSubDevice(true),
    },
  ];

  const others = [
    {
      id: 1,
      title: "Cihaz haqqında",
      click: () => setShowDeviceDetails(true),
    },
    {
      id: 2,
      title: "Cihazı sil",
      value: "Bu əməliyyatın geri dönüşü yoxdur.",
      click: () => setShowDeleteModal(true),
    },
  ];

  const detailsData = [
    {
      id: 1,
      label: "Model",
      value: "Azirrigation Pro 8k",
    },
    {
      id: 2,
      label: "Məhsul ID",
      value: "AZI-2837465",
    },
    {
      id: 3,
      label: "Seriya nömrəsi",
      value: "SN-00012345",
    },
    {
      id: 4,
      label: "MAC ünvanı",
      value: "A4:C1:38:xx:xx:xx",
    },
    {
      id: 5,
      label: "İstehsalçı",
      value: "Azirrigation Technologies",
    },
    {
      id: 6,
      label: "Hard versiya",
      value: "v3",
    },
    {
      id: 7,
      label: "Soft versiya",
      value: "v2.1.3",
    },
  ];

  // const handleWifiNext = (network: string) => {
  //   setSelectedNetwork(network);
  //   setShowPasswordModal(true);
  // };

  return (
    <ScrollView style={styles.devices}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerText}>{parsedDevice.name}</Text>
        </View>
        <View style={styles.cardsContainer}>
          <Text style={styles.cardHeaderText}>Ümumi</Text>
          <View style={styles.commonCard}>
            {commonDatas.map((data, i) => (
              <TouchableOpacity
                key={data.id}
                onPress={() => data.click()}
                style={[styles.card, i !== 0 && { marginTop: 36 }]}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.titleText}>{data.title}</Text>
                  <Text style={styles.valueText}>{data.value}</Text>
                </View>

                <ProfileArrow />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.cardsContainer}>
          <Text style={styles.cardHeaderText}>Motor göstəriciləri</Text>
          <View style={styles.commonCard}>
            {motorDatas.map((data, i) => (
              <TouchableOpacity
                onPress={() => data.click()}
                key={data.id}
                style={[styles.card, i !== 0 && { marginTop: 36 }]}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.titleText}>{data.title}</Text>
                  <Text style={styles.valueText}>{data.value}</Text>
                </View>

                <ProfileArrow />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={styles.cardHeaderText}>Suvarma nöqtələri</Text>
          <View style={styles.commonCard}>
            {irrigationDatas.map((data, i) => (
              <TouchableOpacity
                key={data.id}
                style={[styles.card, i !== 0 && { marginTop: 36 }]}
                onPress={() => data.click()}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.titleText}>{data.title}</Text>
                  <Text style={styles.valueText}>
                    {Array.isArray(data.value)
                      ? data.value.length > 0
                        ? `${data.value.length}`
                        : "Yoxdur"
                      : (data.value ?? "Yoxdur")}
                  </Text>
                </View>

                <ProfileArrow />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <Text style={styles.cardHeaderText}>Digər</Text>
          <View style={styles.commonCard}>
            {others.map((data, i) => (
              <TouchableOpacity
                key={data.id}
                style={[styles.card, i !== 0 && { marginTop: 36 }]}
                onPress={() => data.click()}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.titleText}>{data.title}</Text>
                  {data.value && (
                    <Text style={styles.valueText}>{data.value}</Text>
                  )}
                </View>

                <ProfileArrow />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <CommonUpdateInput
        visible={showDevice}
        onClose={() => setShowDevice(false)}
        text="Cihaz adı"
        value={deviceNameValue}
        onChange={setDeviceNameValue}
        type="device"
        id={parsedDevice.deviceId}
      />

      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={setLocationValue}
        currentValue={locationValue?.name}
        id={parsedDevice.deviceId}
      />

      <CommonUpdateInput
        visible={showWater}
        onClose={() => setShowWater(false)}
        type="water"
        value={String(waterValue)}
        onChange={setWaterValue}
        text="Su sərfiyyatı"
        unit={waterUnit}
        id={parsedDevice.deviceId}
        currentElectricValue={electricValue}
        currentElectricUnit={electricUnit}
      />
      <CommonUpdateInput
        visible={showElectric}
        onClose={() => setShowElectric(false)}
        type="electric"
        value={String(electricValue)}
        onChange={setElectricValue}
        text="Elektrik gücü"
        unit={electricUnit}
        id={parsedDevice.deviceId}
        currentWaterValue={waterValue}
        currentWaterUnit={waterUnit}
      />

      <Modal
        visible={showWifi}
        animationType="slide"
        presentationStyle="fullScreen"
        // presentationStyle="pageSheet"
      >
        <WifiStep
          type="details"
          onNext={() => setShowWifi(false)}
          onCantSee={() => setShowHideWifi(true)}
        />
      </Modal>

      <Modal
        visible={showValve}
        animationType="slide"
        presentationStyle="fullScreen"
        // presentationStyle="pageSheet"
      >
        <AddValve
          onNext={() => setShowValve(false)}
          type="details"
          valves={mainData?.valves}
          mainDeviceId={parsedDevice._id}
          id={parsedDevice.deviceId}
        />
      </Modal>

      <Modal
        visible={showSubDevice}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddSubDevice onNext={() => setShowSubDevice(false)} type="details" />
      </Modal>

      <HideWifi
        visible={showHideWifi}
        onClose={() => setShowHideWifi(false)}
        onConnect={(ssid, security, password) => {
          console.log("Connecting to:", ssid, security, password);
        }}
      />
      <CommonDetailsModal
        visible={showDeviceDetails}
        onClose={() => setShowDeviceDetails(false)}
        data={detailsData}
        text="Cihaz haqqında"
      />
      <CommonConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        text="Cihazı silmək istədiyinizdən əminsiniz?"
        desc="Bu cihazı sildikdə cihazın özü, ona bağlı sub cihazlar və bütün suvarma planları qalıcı olaraq silinəcək və bu əməliyyatı geri qaytarmaq mümkün olmayacaq."
        type="delete-device"
        onFinish={() => handleDeleteDevice()}
      />
    </ScrollView>
  );
};

export default DeviceDetails;

const styles = StyleSheet.create({
  devices: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 24,
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

  cardsContainer: {
    marginTop: 24,
  },

  cardHeaderText: {
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },
  commonCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },

  valueText: {
    marginTop: 6,
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },
});
