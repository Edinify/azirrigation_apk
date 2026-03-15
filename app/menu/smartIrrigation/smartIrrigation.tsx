import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import DropPercentIcon from "@/assets/icons/menu/smart-irrigation/droplet-percent-solid.svg";
import DropIcon from "@/assets/icons/menu/smart-irrigation/droplet-solid.svg";
import SnowIcon from "@/assets/icons/menu/smart-irrigation/snowflake-solid.svg";
import SunIcon from "@/assets/icons/menu/smart-irrigation/sun-solid.svg";
import WindIcon from "@/assets/icons/menu/smart-irrigation/wind-solid.svg";
import SmartIrrigationModal from "@/components/commonComponents/SmartIrrigationModal/SmartIrrigationModal";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SwitchToggle from "react-native-switch-toggle";

interface SmartIrrigationProps {
  id: number;
  title: string;
  desc: string;
  value: number;
  Icon: any;
  unit: string;
  minValue: number;
  maxValue: number;
  recommendedValue: number;
  modalTitle: string;
}

const SmartIrrigation = () => {
  const router = useRouter();

  const [datas, setDatas] = useState<SmartIrrigationProps[]>([
    {
      id: 1,
      title: "Güclü yağışda dayandır",
      desc: "Son 24 saatdakı yağış bu dəyərdən çoxdursa, həmin gün suvarma etmə.",
      Icon: DropIcon,
      value: 5,
      unit: "MM",
      minValue: 2,
      maxValue: 25,
      recommendedValue: 5,
      modalTitle: "Yağış hədddini seçin",
    },
    {
      id: 2,
      title: "Yağış ehtimalında təxirə sal",
      desc: "Bu gün üçün yağış ehtimalı seçdiyin faizdən yuxarıdırsa, sistem suvarmanı bir gün sonraya keçirir.",
      Icon: DropPercentIcon,
      value: 30,
      unit: "%",
      minValue: 30,
      maxValue: 90,
      recommendedValue: 60,
      modalTitle: "Yağış ehtimalını seçin",
    },
    {
      id: 3,
      title: "Çox istidə artır",
      desc: "Günün proqnoz temperaturu həddi keçəndə, suvarma müddəti avtomatik təxminən +30% artırılır.",
      Icon: SunIcon,
      value: 30,
      unit: "°C",
      minValue: 25,
      maxValue: 45,
      recommendedValue: 30,
      modalTitle: "İsti gün həddini seçin",
    },
    {
      id: 4,
      title: "Soyuq havada dayandır",
      desc: "Temperatur həddən aşağı düşdükdə, torpaq donmasın və bitki zədələnməsin deyə həmin gün suvarma işə düşmür.",
      Icon: SnowIcon,
      value: 2,
      unit: "°C",
      minValue: -5,
      maxValue: 10,
      recommendedValue: 2,
      modalTitle: "Soyuq hava həddini seçin",
    },
    {
      id: 5,
      Icon: WindIcon,
      title: "Güclü küləkdə dayandır",
      desc: "Küləyin sürəti həddi keçəndə, suvarma damlalar küləklə sovrulmasın deyə həmin gün işə düşmür.",
      value: 20,
      unit: "km/h",
      minValue: 10,
      maxValue: 50,
      recommendedValue: 20,
      modalTitle: "Külək sürəti həddini seçin",
    },
  ]);

  const [irrigationSwitchStates, setIrrigationSwitchStates] = useState<
    Record<number, boolean>
  >(() =>
    datas.reduce(
      (acc, item) => {
        acc[item.id] = false;
        return acc;
      },
      {} as Record<number, boolean>,
    ),
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SmartIrrigationProps | null>(
    null,
  );

  const toggleIrrigationSwitch = (id: number) => {
    setIrrigationSwitchStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardPress = (item: SmartIrrigationProps) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleSaveValue = (newValue: number) => {
    if (selectedItem) {
      setDatas((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, value: newValue } : item,
        ),
      );
    }
  };

  return (
    <>
      <ScrollView style={styles.devices}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={[styles.headerText]}>Ağıllı suvarma</Text>
          </View>
          <View style={styles.cardsContainer}>
            {datas.map((data) => {
              const Icon = data.Icon;
              return (
                <TouchableOpacity
                  key={data.id}
                  style={styles.cardContainer}
                  onPress={() => handleCardPress(data)}
                  activeOpacity={0.7}
                >
                  <View style={styles.titleContainer}>
                    <Icon />
                    <Text style={styles.titleText}>{data.title}</Text>
                  </View>
                  <Text style={styles.descText}>{data.desc}</Text>
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>
                      {data.value} {data.unit}
                    </Text>
                    <TouchableOpacity
                      style={{ marginLeft: 8 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleIrrigationSwitch(data.id);
                      }}
                    >
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
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {selectedItem && (
        <SmartIrrigationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={selectedItem.modalTitle}
          currentValue={selectedItem.value}
          recommendedValue={selectedItem.recommendedValue}
          minValue={selectedItem.minValue}
          maxValue={selectedItem.maxValue}
          unit={selectedItem.unit}
          onSave={handleSaveValue}
        />
      )}
    </>
  );
};

export default SmartIrrigation;

// styles eyni qalır

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

  cardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 4,
  },

  descText: {
    marginTop: 8,
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },

  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  valueText: {
    fontSize: 28,
    color: "#0E121B",
    fontWeight: 500,
  },
});
