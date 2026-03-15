import FlowImg from "@/assets/images/sensors/Plata_Flow.svg";
import LevelImg from "@/assets/images/sensors/Plata_Level.svg";
import PressureImg from "@/assets/images/sensors/Plata_Pressure.svg";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface SensorProps {
  visible: boolean;
  onClose: () => void;
  type: string;
}

const CommonSensorModal = ({ visible, type, onClose }: SensorProps) => {
  const flow_datas = [
    "Sensoru suyun axdığı xəttə yerləşdirin və üzərindəki ox işarəsinin suyun axın istiqaməti ilə eyni olduğuna əmin olun.",
    "Sensor kabelini platada sensor “Flow” portuna qoşun (şəkildə yeri göstərilib).",
    "“Testi başlat” düyməsinə klikləyin. Test zamanı motor qısa müddət işləyəcək. Su axını varsa sensorun fırlanması aşkar ediləcək və sensor əlavə ediləcək.",
  ];

  const level_datas = [
    "Sensoru hovuzda su səviyyəsini ölçəcək yerə yerləşdirin və düzgün mövqedə olduğuna əmin olun.",
    "Sensor kabelini platada sensor “Level switch” portuna qoşun (şəkildə yeri göstərilib).",
    "“Testi başlat” düyməsinə klikləyin. Test zamanı sensoru yuxarı-aşağı hərəkət etdirin. Top kontakt nöqtəsinə dəyəndə siqnal alınacaq və sensor əlavə ediləcək.",
  ];

  const pressure_datas = [
    "Təzyiq sensorunu su xəttində təzyiqin ölçüləcəyi nöqtəyə quraşdırın və möhkəm bağlandığına əmin olun.",
    "Sensor kabelini platada sensor “Pressure” portuna qoşun (şəkildə yeri göstərilib).",
    "“Testi başlat” düyməsinə klikləyin. Test zamanı motor qısa müddət işləyəcək. Təzyiq varsa sensor bunu aşkar edəcək və sensor əlavə ediləcək.",
  ];

  const humidity_datas = [
    "Sensoru torpağa batırın və ölçən hissənin torpağa tam daxil olduğuna əmin olun.",
    "Sensor kabelini subcihazın platasında sensor “Humidity” portuna qoşun (şəkildə yeri göstərilib).",
    "Tətbiqdə qoşulduğu subcihazı siyahıdan seçin. Sistem sensorun həmin subcihaza qoşulduğunu yoxlayacaq və təsdiqlənərsə sensor əlavə ediləcək.",
  ];

  const sensorContent = {
    flow_sensor: {
      title: "Su axını sensoru qoşulması",
      image: <FlowImg />,
      data: flow_datas,
    },
    level_sensor: {
      title: "Səviyyə sensoru qoşulması",
      image: <LevelImg />,
      data: level_datas,
    },
    pressure_sensor: {
      title: "Təzyiq sensoru qoşulması",
      image: <PressureImg />,
      data: pressure_datas,
    },
    humidity_sensor: {
      title: "Rütubət sensoru qoşulması",
      image: null,
      data: humidity_datas,
    },
  };

  const currentSensor = sensorContent[type as keyof typeof sensorContent];
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
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.headerText}>{currentSensor.title}</Text>
            <View style={styles.imgContainer}>{currentSensor?.image}</View>
            <View style={styles.list}>
              {currentSensor?.data.map((item, i) => (
                <Text style={styles.listText} key={i}>
                  {i + 1}. {item}
                </Text>
              ))}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <CustomAddButton size="l" text="Başa düşdüm" onClick={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CommonSensorModal;

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
    paddingBottom: 24, // ✅ Azaldıldı
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 20,
  },

  scrollContent: {
    paddingBottom: 20, // ✅ Button ilə arasında boşluq
  },
  headerText: {
    fontSize: 24,
    color: "#0E121B",
    fontWeight: 600,
    textAlign: "center",
  },

  imgContainer: {
    marginVertical: 24,
  },

  listText: {
    color: "#0E121B",
    fontSize: 14,
    fontWeight: 400,
  },

  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
});
