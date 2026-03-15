import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import { GuideModal } from "@/components/menu/Guide/Guide";
import { useRouter } from "expo-router";
import React, { ReactNode, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Image1 = require("@/assets/images/guide/Image1.png");
const Image2 = require("@/assets/images/guide/Image2.png");
const Image3 = require("@/assets/images/guide/Image3.png");
const Image4 = require("@/assets/images/guide/Image4.png");
const Image5 = require("@/assets/images/guide/Image5.png");
const Image6 = require("@/assets/images/guide/Image6.png");
const Image7 = require("@/assets/images/guide/Image7.png");
const Image8 = require("@/assets/images/guide/Image8.png");
const Image9 = require("@/assets/images/guide/Image9.png");
const Image10 = require("@/assets/images/guide/Image10.png");

const AddDeviceImage1 = require("@/assets/images/guide/page-1/image-1.png");
const AddDeviceImage2 = require("@/assets/images/guide/page-1/image-2.png");
const AddDeviceImage3 = require("@/assets/images/guide/page-1/image-3.png");
const AddDeviceImage4 = require("@/assets/images/guide/page-1/image-4.png");
const AddDeviceImage5 = require("@/assets/images/guide/page-1/image-5.png");
const AddDeviceImage6 = require("@/assets/images/guide/page-1/image-6.png");
const addSubdeviceImage1 = require("@/assets/images/guide/page-2/image-1.png");
const addSubdeviceImage2 = require("@/assets/images/guide/page-2/image-2.png");
const addSubdeviceImage3 = require("@/assets/images/guide/page-2/image-3.png");
const irrigationImage1 = require("@/assets/images/guide/page-3/image-1.png");
const irrigationImage2 = require("@/assets/images/guide/page-3/image-2.png");
const irrigationImage3 = require("@/assets/images/guide/page-3/image-3.png");
const irrigationImage4 = require("@/assets/images/guide/page-3/image-4.png");
const irrigationImage5 = require("@/assets/images/guide/page-3/image-5.png");
const editDeviceImage1 = require("@/assets/images/guide/page-4/image-1.png");
const editDeviceImage2 = require("@/assets/images/guide/page-4/image-2.png");
const editDeviceImage3 = require("@/assets/images/guide/page-4/image-3.png");
const editDeviceImage4 = require("@/assets/images/guide/page-4/image-4.png");
const editDeviceImage5 = require("@/assets/images/guide/page-4/image-5.png");
const editDeviceImage6 = require("@/assets/images/guide/page-4/image-6.png");

const smartIrrigationImage1 = require("@/assets/images/guide/page-5/image-1.png");
const smartIrrigationImage2 = require("@/assets/images/guide/page-5/image-2.png");
const smartIrrigationImage3 = require("@/assets/images/guide/page-5/image-3.png");
const smartIrrigationImage4 = require("@/assets/images/guide/page-5/image-4.png");
const smartIrrigationImage5 = require("@/assets/images/guide/page-5/image-5.png");

const settingImage1 = require("@/assets/images/guide/page-6/image-1.png");
const settingImage2 = require("@/assets/images/guide/page-6/image-2.png");
const settingImage3 = require("@/assets/images/guide/page-6/image-3.png");

const flowSensorImage1 = require("@/assets/images/guide/page-7/image-1.png");
const flowSensorImage2 = require("@/assets/images/guide/page-7/image-2.png");
const flowSensorImage3 = require("@/assets/images/guide/page-7/image-3.png");
const flowSensorImage4 = require("@/assets/images/guide/page-7/image-4.png");
const flowSensorImage5 = require("@/assets/images/guide/page-7/image-5.png");

const levelSensorImage1 = require("@/assets/images/guide/page-8/image-1.png");
const levelSensorImage2 = require("@/assets/images/guide/page-8/image-2.png");
const levelSensorImage3 = require("@/assets/images/guide/page-8/image-3.png");
const levelSensorImage4 = require("@/assets/images/guide/page-8/image-4.png");
const levelSensorImage5 = require("@/assets/images/guide/page-8/image-5.png");

const pressureSensorImage1 = require("@/assets/images/guide/page-9/image-1.png");
const pressureSensorImage2 = require("@/assets/images/guide/page-9/image-2.png");
const pressureSensorImage3 = require("@/assets/images/guide/page-9/image-3.png");
const pressureSensorImage4 = require("@/assets/images/guide/page-9/image-4.png");
const pressureSensorImage5 = require("@/assets/images/guide/page-9/image-5.png");

const humditySensorImage1 = require("@/assets/images/guide/page-10/image-1.png");
const humditySensorImage2 = require("@/assets/images/guide/page-10/image-2.png");
const humditySensorImage3 = require("@/assets/images/guide/page-10/image-3.png");
const humditySensorImage4 = require("@/assets/images/guide/page-10/image-4.png");
const humditySensorImage5 = require("@/assets/images/guide/page-10/image-5.png");

export interface GuideItem {
  id: number;
  label: string;
  desc: string;
  image: any;
  modalContent?: GuideModalContent;
  subDesc?: GuideSubContent;
}

export interface GuideModalContent {
  title: string;
  desc?: string;
  sections: GuideSection[];
}

export interface GuideSubContent {
  header: string;
  content: string[];
}

export interface GuideSection {
  subtitle?: string;
  type: "paragraph" | "bullet-list" | "numbered-list"; // Section tipi
  content: string[]; // Array - hər element ayrı paragraph və ya list item
  image?: ImageSourcePropType;
  footer?: ReactNode;
  contentHeader?: string;
  aboutContent?: string | ReactNode;
}

const Guide = () => {
  const router = useRouter();
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (guide: GuideItem) => {
    setSelectedGuide(guide);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedGuide(null), 300);
  };

  const guideDatas: GuideItem[] = useMemo(
    () => [
      {
        id: 1,
        label: "Cihazı necə əlavə etməli",
        desc: "Cihazın tətbiqə əlavə olunması və ilkin quraşdırma addımları.",
        image: Image1,
        modalContent: {
          title: "Cihazı necə əlavə etməli",
          desc: "Cihazı əlavə etmək üçün əvvəlcədən tətbiqə Kamera və Bluetooth icazəsi verilməlidir. Cihaz əlavə edilməzdən əvvəl cihaz quraşdırmaya hazır olmalıdır.",
          sections: [
            {
              subtitle: "1. Cihaz əlavə etmə ekranına keçin",
              type: "bullet-list",
              content: [
                'İlk dəfə cihaz qoşursunuzsa, ana səhifədə "Cihaz əlavə et" düyməsinə toxunun.',
                'Əlavə cihaz qoşursunuzsa, sol yuxarıda cihaz adının üzərinə toxunun və açılan pəncərədə "Cihaz əlavə et" seçin.',
              ],
              image: AddDeviceImage1,
            },
            {
              subtitle: "2. QR kodu oxudun",
              type: "paragraph",
              content: [
                "Açılan ekranda kameranı cihazın üzərindəki QR koda yönəldin.",
                'QR kod oxunmursa, aşağıdakı "Kodu əl ilə daxil et" düyməsinə toxunub QR kodun altındakı kodu daxil edin.',
              ],
              image: AddDeviceImage2,
            },

            {
              subtitle: "3. Wi-Fi seçin (istəyə bağlı)",
              type: "paragraph",
              content: [
                "Cihaz telefona qoşulduqdan sonra Wi-Fi seçə bilərsiniz. Cihazın olduğu yerdə Wi-Fi varsa şəbəkəni seçin və şifrəni daxil edin. Wi-Fi yoxdursa, bu mərhələni keçə bilərsiniz.",
              ],
              image: AddDeviceImage3,
            },
            {
              subtitle: "4. Klapanları Valve portlara uyğunlaşdırın",
              type: "paragraph",
              content: [
                "Qoşulu klapanların cihazın platasında hansı Valve 1/2/3… portlara qoşulduğunu seçin və hər klapana ad verin. Bu addım sistemin düzgün işləməsi üçün vacibdir.",
              ],
              image: AddDeviceImage4,
            },
            {
              subtitle: "5. Cihaz məlumatlarını tamamlayın",
              type: "bullet-list",
              content: [
                "Cihazı rahat idarə etmək üçün ad verin.",
                "Hava məlumatı və Günün məsləhətləri həmin əraziyə uyğun göstərilsin deyə cihazın yerləşdiyi yeri qeyd edin.",
                "Statistikaların hesablanması üçün motorla bağlı göstəriciləri daxil edin.",
              ],
              image: AddDeviceImage5,
            },
            {
              subtitle: "6.Sensorları əlavə edin",
              type: "paragraph",
              content: [
                "Sensor əlavə etmək suvarma təcrübənizi daha da yaxşılaşdırır,amma məcburi deyil. İstəsəniz bu mərhələni keçib sensorları  sonradan əlavə edə bilərsiniz.",
              ],
              image: AddDeviceImage6,
              footer: (
                <Text>
                  Sensorların qoşulması ilə bağlı addımlar
                  <Text style={{ color: "#0069FE" }}> Sensor əlavə etmə </Text>
                  bələdçisində izah olunub.
                </Text>
              ),
            },
          ],
        },
      },
      {
        id: 2,
        label: "Subcihazı necə əlavə etməli",
        desc: "Subcihazın qoşulması, adlandırılması və klapanların uyğunlaşdırılması.",
        image: Image2,
        modalContent: {
          title: "Subcihazı necə əlavə etməli",
          desc: "Subcihazı əlavə etməzdən əvvəl onun enerji mənbəyinə qoşulu olduğuna əmin olun. Sonra üzərindəki düyməni işıq yanıb-sönənə qədər basıb saxlayaraq subcihazı aktiv edin.",
          sections: [
            {
              subtitle: "1. Axtarışı başladın",
              type: "paragraph",
              content: [
                "Subcihaz qoşulmağa hazır olduqda “Axtarışı başlat” düyməsinə toxunun.",
              ],
              image: addSubdeviceImage1,
            },
            {
              subtitle: "2. Subcihaza ad verin",
              type: "paragraph",
              content: [
                "Subcihaz tapılıb qoşulduqdan sonra onu rahat tanımaq üçün ad yazın.",
              ],
              image: addSubdeviceImage2,
            },
            {
              subtitle: "3. Klapanları Valve portlara uyğunlaşdırın",
              type: "paragraph",
              content: [
                "Qoşulu klapanların subcihazın platasında hansı Valve 1/2/3… portlara qoşulduğunu seçin və hər klapana ad verin. Bu addım sistemin düzgün işləməsi üçün vacibdir.",
              ],
              image: addSubdeviceImage3,
            },
          ],
        },
      },
      {
        id: 3,
        label: "Suvarmanı necə başlatmalı",
        desc: "Birbaşa suvarma və planla suvarma haqqında qısa izah.",
        image: Image3,
        modalContent: {
          title: "Suvarmanı necə başlatmalı",
          desc: "Suvarmanı iki üsulla idarə edə bilərsiniz: birbaşa başlatmaq və ya plan yaradaraq. Planların 3 növü var: Həftəlik, Periodik və Rütubət üzrə.",
          sections: [
            {
              subtitle: "Birbaşa suvarmanı başlatmaq",
              type: "paragraph",
              content: [
                "“Suvarmanı başlat” düyməsinə toxunun, sonra suvarma üçün müddət seçin.",
              ],
              image: irrigationImage1,
            },
            {
              subtitle: "Planlarla suvarma (Planlar bölümü)",
              type: "paragraph",
              content: [
                "Yuxarıdakı tab-dan “Suvarma planları” bölməsinə keçərək yeni plan yarada və mövcud planları idarə edə bilərsiniz.",
              ],
              image: irrigationImage2,
            },
            {
              subtitle: "Həftəlik plan",
              type: "paragraph",
              content: [
                "Suvarmanın həftənin hansı günlərində olacağını seçin. Daha sonra başlama vaxtını və suvarma müddətini təyin edin.",
              ],
              image: irrigationImage3,
            },
            {
              subtitle: "Periodik plan",
              type: "paragraph",
              content: [
                "Suvarmanın neçə gündən bir təkrarlanacağını (gün aralığı) və başlama tarixini seçin. Daha sonra başlama vaxtını və suvarma müddətini təyin edin.",
              ],
              image: irrigationImage4,
            },
            {
              subtitle: "Rütubət üzrə plan",
              type: "paragraph",
              content: [
                "Rütubət səviyyəsini seçin və suvarma müddətini təyin edin. Rütubət səviyyəsi seçdiyiniz həddən aşağı düşdükdə suvarma avtomatik başlayacaq.",
              ],
              image: irrigationImage5,
            },
          ],
        },
      },
      {
        id: 4,
        label: "Cihaz ayarlarını necə dəyişməli",
        desc: "Cihazın adı, Wi-Fi, məkan, motor və klapan düzəlişləri.",
        image: Image4,
        modalContent: {
          title: "Cihaz ayarlarını necə dəyişməli",
          desc: "Mövcud cihazınız üzərində dəyişiklik etmək üçün menyudan “Cihazlar” bölməsinə keçin.",
          sections: [
            {
              subtitle: "Cihazı seçin",
              type: "paragraph",
              content: [
                "Açılan siyahıda dəyişiklik etmək istədiyiniz cihazın üzərinə toxunun.",
              ],
              image: editDeviceImage1,
            },
            {
              subtitle: "Ümumi ayarlar",
              type: "bullet-list",
              contentHeader: "Ümumi bölməsində cihazın:",
              content: [
                "adını,",
                "Wi-Fi bağlantısını,",
                "məkan (location) məlumatlarını dəyişə bilərsiniz.",
              ],
              image: editDeviceImage2,
            },
            {
              subtitle: "Motor göstəriciləri",
              type: "bullet-list",
              contentHeader:
                "Əgər motoru dəyişmisinizsə, Motor göstəriciləri bölməsində:",
              aboutContent:
                "Bu məlumatlar statistikaların daha düzgün hesablanmasına kömək edir.",
              content: [
                "su sərfiyyatı,",
                "elektrik gücü məlumatlarını redaktə edə bilərsiniz.",
              ],
              image: editDeviceImage3,
            },
            {
              subtitle: "Klapanlar",
              type: "paragraph",
              content: [
                "Cihaza yeni klapan əlavə edilibsə, klapan çıxarılıbsa və ya yerləri dəyişibsə, Klapanlar bölməsinə keçərək düzəliş edin.",
              ],
              image: editDeviceImage4,
              aboutContent:
                "Bu bölmə sistemin düzgün işləməsi üçün vacibdir. Yanlış seçimlər suvarmanın səhv idarə olunmasına səbəb ola bilər.",
            },
            {
              subtitle: "Subcihazlar",
              type: "paragraph",
              content: [
                "Cihaza qoşulu subcihazlar üzərində dəyişiklik etmək üçün Subcihazlar bölməsinə keçin. Buradan subcihazların adını yeniləyə və əlaqəli ayarları idarə edə bilərsiniz.",
              ],
              image: editDeviceImage5,
            },
            {
              subtitle: "Cihazı sil (geri dönüş yoxdur)",
              type: "paragraph",
              content: [
                "Cihazı tamamilə silmək istəyirsinizsə, “Cihazı sil” bölməsinə toxunun.",
                "Bu ciddi əməliyyatdır — silindikdən sonra cihaz və ona bağlı məlumatlar bərpa olunmaya bilər.",
              ],
              image: editDeviceImage6,
            },
          ],
        },
      },
      {
        id: 5,
        label: "Ağıllı suvarma bələdçisi",
        desc: "Hava şəraitinə görə planların avtomatik dəyişməsi qaydaları.",
        subDesc: {
          header: "Nə edir?",

          content: [
            "Suvarmanı dayandıra bilər (məs: güclü yağış, soyuq hava, güclü külək)",
            "Suvarmanı təxirə sala bilər (məs: yağış ehtimalı yüksəkdirsə)",
            "Suvarma müddətini artıra bilər (məs: hava çox istidirsə)",
          ],
        },
        image: Image5,
        modalContent: {
          title: "Ağıllı suvarma bələdçisi",
          desc: "Ağıllı suvarma hava proqnozuna əsasən suvarma planlarını avtomatik tənzimləyir. Bəzən gözlənilməz hava dəyişiklikləri plan üzrə suvarmanı uyğun etməyə bilər. Bu funksiya həmin hallarda suvarmanı dayandırır, təxirə salır və ya müddəti artırır.",
          sections: [
            {
              subtitle: "Güclü yağış",
              type: "paragraph",
              content: [
                "Son 24 saatda yağan yağış miqdarı sizin təyin etdiyiniz həddi keçərsə, suvarma başlamaya bilər.",
              ],
              image: smartIrrigationImage1,
              aboutContent: (
                <Text>
                  <Text style={{ color: "#717784" }}>Məqsəd: </Text>
                  Yağışdan sonra artıq nəm olan torpağı yenidən suvarmamaq.
                </Text>
              ),
            },
            {
              subtitle: "Yağış ehtimalı",
              type: "paragraph",
              content: [
                "Bu gün üçün yağış ehtimalı sizin təyin etdiyiniz həddi keçərsə, suvarma 1 gün sonraya təxirə salına bilər.",
              ],
              aboutContent: (
                <Text>
                  <Text style={{ color: "#717784" }}>Məqsəd: </Text>
                  Yağış gözlənilirsə suvarmanı gecikdirmək və suya qənaət etmək.
                </Text>
              ),
              image: smartIrrigationImage2,
            },
            {
              subtitle: "Yüksək temperatur",
              type: "paragraph",
              content: [
                "Temperatur sizin təyin etdiyiniz həddi keçərsə, suvarma müddəti təxminən +30% artırıla bilər.",
              ],
              aboutContent: (
                <Text>
                  <Text style={{ color: "#717784" }}>Məqsəd: </Text>
                  İstidə bitkilərin daha çox su ehtiyacı ola bilər.
                </Text>
              ),
              image: smartIrrigationImage3,
            },
            {
              subtitle: "Aşağı temperatur",
              type: "paragraph",
              content: [
                "Temperatur sizin təyin etdiyiniz həddən aşağı düşərsə, suvarma başlamaya bilər.",
              ],
              aboutContent: (
                <Text>
                  <Text style={{ color: "#717784" }}>Məqsəd: </Text>
                  Soyuq havada suvarma bitkilərə zərər verə bilər.
                </Text>
              ),
              image: smartIrrigationImage4,
            },
            {
              subtitle: "Güclü külək",
              type: "paragraph",
              content: [
                "Külək sürəti sizin təyiniz etdiyin həddi keçərsə, suvarma başlamaya bilər.",
              ],
              aboutContent: (
                <Text>
                  <Text style={{ color: "#717784" }}>Məqsəd: </Text>
                  Küləkli havada suyun yayılması qeyri-bərabər ola bilər.
                  Xüsusilə damcı suvarmada bu qayda daha faydalıdır.
                </Text>
              ),
              footer: (
                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{ color: "#FE171B", fontSize: 16, fontWeight: 500 }}
                  >
                    Vacib qeyd
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      color: "#0E121B",
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                  >
                    Ağıllı suvarmanın düzgün işləməsi üçün cihazın yerləşdiyi
                    məkanın doğru seçilməsi vacibdir. Məkan düzgün olmasa, hava
                    proqnozu da uyğun çıxmaya bilər.
                  </Text>
                </View>
              ),
              image: smartIrrigationImage5,
            },
          ],
        },
      },
      {
        id: 6,
        label: "Saat qurşağı və ölçü vahidləri",
        desc: "Saat/tarix formatı və hava göstəricilərinin vahid tənzimləmələri.",
        image: Image6,
        modalContent: {
          title: "Saat qurşağı və ölçü vahidləri",
          desc: "Saat qurşağı və ölçü vahidləri Parametrlər bölməsindən tənzimlənir.",
          sections: [
            {
              subtitle: "1. Parametrləri açın",
              type: "paragraph",
              content: ["Menyudan Parametrlər səhifəsinə keçin."],
              image: settingImage1,
            },
            {
              subtitle: "2.Saat qurşağı",
              type: "paragraph",
              content: [
                "Saat qurşağı bölməsində istifadə etdiyiniz bölgəyə uyğun saat qurşağı təyin olunur. Bu ayar planlarda, tarixçədə və bildirişlərdə vaxtın düzgün görünməsi üçün lazımdır.",
              ],
              image: settingImage2,
            },
            {
              subtitle: "Ölçü vahidləri",
              type: "bullet-list",
              contentHeader:
                "Ölçü vahidləri bölməsində aşağıdakı ayarlar istəyə uyğun tənzimlənir:",
              content: [
                "Saat formatı (24 saat / 12 saat)",
                "Tarix formatı (Gün/Ay/İl, Ay/Gün/İl və ya İl-Ay-Gün)",
                "Temperatur (°C / °F)",
                "Yağış miqdarı (mm / inch)",
                "Külək sürəti (km/saat və ya mil/saat)",
              ],
              image: settingImage3,
              footer: (
                <Text>
                  Bu ayarlar tətbiqin bütün bölmələrində avtomatik tətbiq
                  olunur.
                </Text>
              ),
            },
          ],
        },
      },
      {
        id: 7,
        label: "Su axını sensoru",
        desc: "Su axını sensorunun qoşulması və test mərhələsi haqqında.",
        image: Image7,
        modalContent: {
          title: "Su axını sensoru",
          desc: "Bu sensor suyun axıb-axmadığını göstərir və su gəlmədikdə suvarmanı dayandırırır.",
          sections: [
            {
              subtitle: "1. Sensoru qoşun",
              type: "paragraph",
              content: [
                "Sensoru su xəttinə düzgün istiqamətdə qoşun və kabeli platada “Flow” portuna bağlayın.",
              ],
              image: flowSensorImage1,
            },
            {
              subtitle: "2. Cihaza əlavə edin",
              type: "paragraph",
              content: [
                "Tətbiqdə Sensorlar bölməsinə keçin və Su axını sensoru seçin.",
              ],
              image: flowSensorImage2,
            },
            {
              subtitle: "3. Qoşulmanı təsdiqləyin",
              type: "paragraph",
              content: [
                "Sensoru cihaza qoşduqdan sonra ekranda “Bəli, qoşulub” seçin. Seçim etdikdən sonra test olacaq.",
              ],
              image: flowSensorImage3,
            },
            {
              subtitle: "4. Test edin",
              type: "paragraph",
              content: [
                "Sensor qoşulduqdan sonra tətbiq test aparır. Test uğurlu olarsa “Sensor işləyir” mesajı görünəcək.",
              ],
              image: flowSensorImage4,
            },
            {
              subtitle: "5. Bitirin",
              type: "paragraph",
              content: ["Sensor əlavə olunduqdan sonra “Hazırdır” seçin."],
              image: flowSensorImage5,
            },
          ],
        },
      },
      {
        id: 8,
        label: "Su səviyyəsi sensoru",
        desc: "Hovuz/çən səviyyə sensorunun əlavə olunması və test seçimi.",
        image: Image8,
        modalContent: {
          title: "Su səviyyəsi sensoru",
          desc: "Hovuzda su bitəndə suvarmanı dayandırır və sistemi qoruyur.",
          sections: [
            {
              subtitle: "1. Sensoru qoşun",
              type: "paragraph",
              content: [
                "Sensoru hovuzda/çəndə su səviyyəsini görəcək şəkildə yerləşdirin və kabeli platada “Level switch” portuna bağlayın.",
              ],
              image: levelSensorImage1,
            },
            {
              subtitle: "2. Cihaza əlavə edin",
              type: "paragraph",
              content: [
                "Tətbiqdə Sensorlar bölməsinə keçin və Su səviyyəsi sensoru seçin.",
              ],
              image: levelSensorImage2,
            },
            {
              subtitle: "3. Qoşulmanı təsdiqləyin",
              type: "paragraph",
              content: [
                "Sensoru cihaza qoşduqdan sonra ekranda “Bəli, qoşulub” seçin. Seçim etdikdən sonra test olacaq.",
              ],
              image: levelSensorImage3,
            },
            {
              subtitle: "4. Test edin",
              type: "paragraph",
              content: [
                "Sensor hələ quraşdırılmayıbsa, test edin. Test üçün sensoru yuxarı-aşağı hərəkət etdirin ki, top kontakt nöqtəsinə dəyəndə siqnal alınsın.",
              ],
              aboutContent: (
                <Text>
                  Əgər sensor artıq yerinə quraşdırılıbsa və test mümkün
                  deyilsə, birbaşa “Təsdiqlə və əlavə et” seçin.
                </Text>
              ),
              image: levelSensorImage4,
            },
            {
              subtitle: "5. Bitirin",
              type: "paragraph",
              content: [
                "Test mümkün olub və uğurla keçibsə, “Hazırdır” seçin.",
              ],
              image: levelSensorImage5,
            },
          ],
        },
      },
      {
        id: 9,
        label: "Təzyiq sensoru",
        desc: "Təzyiq sensorunun əlavə olunması və yoxlama mərhələsi.",
        image: Image9,
        modalContent: {
          title: "Təzyiq sensoru",
          desc: "Bu sensor suyun axıb-axmadığını göstərir və su gəlmədikdə suvarmanı dayandırırır.",
          sections: [
            {
              subtitle: "1. Sensoru qoşun",
              image: pressureSensorImage1,
              content: [
                "Sensoru su xəttinə düzgün istiqamətdə qoşun və kabeli platada “Pressure” portuna bağlayın.",
              ],
              type: "paragraph",
            },
            {
              subtitle: "2. Cihaza əlavə edin",
              image: pressureSensorImage2,
              content: [
                "Tətbiqdə Sensorlar bölməsinə keçin və Təzyiq sensoru seçin.",
              ],
              type: "paragraph",
            },
            {
              subtitle: "3. Qoşulmanı təsdiqləyin",
              image: pressureSensorImage3,
              content: [
                "Sensoru cihaza qoşduqdan sonra ekranda “Bəli, qoşulub” seçin. Seçim etdikdən sonra test olacaq.",
              ],
              type: "paragraph",
            },
            {
              subtitle: "4. Test edin",
              image: pressureSensorImage4,
              content: [
                "Sensor qoşulduqdan sonra tətbiq test aparır. Test uğurlu olarsa “Sensor işləyir” mesajı görünəcək.",
              ],
              type: "paragraph",
            },
            {
              subtitle: "5. Bitirin",
              image: pressureSensorImage5,
              content: ["Sensor əlavə olunduqdan sonra “Hazırdır” seçin."],
              type: "paragraph",
            },
          ],
        },
      },
      {
        id: 10,
        label: "Rütubət sensoru",
        desc: "Rütubət sensorunun qoşulması və klapanlarla əlaqələndirilməsi.",
        image: Image10,
        modalContent: {
          title: "Rütubət sensoru",
          desc: "Rütubət sensoru 3 növdə ola bilər: 30 sm, 60 sm, 90 sm. Sensor əlavə etmək üçün sensorun aktiv olduğuna və cihazın yaxınlığında saxlanıldığına əmin olun.",
          sections: [
            {
              subtitle: "1. Sensoru aktiv edin",
              content: [
                "Sensorun üzərindəki Power düyməsini 3–5 saniyə basıb saxlayın. Sensor qoşulma rejiminə keçəcək.",
              ],
              type: "paragraph",
              image: humditySensorImage1,
            },
            {
              subtitle: "2. Cihaza əlavə edin",
              content: [
                "Tətbiqdə Sensorlar bölməsinə keçin və Rütubət sensoru seçin.",
              ],
              type: "paragraph",
              image: humditySensorImage2,
            },
            {
              subtitle: "3. Axtarışı başladın",
              content: [
                "Tətbiqdə rütubət sensorunun əlavə edilməsi ekranında “Axtarışı başlat” düyməsinə toxunun. Cihaz sensoru tapdıqda qoşulma avtomatik tamamlanacaq.",
              ],
              type: "paragraph",
              image: humditySensorImage3,
            },
            {
              subtitle: "4. Klapanları seçin",
              contentHeader: "Sensor qoşulduqdan sonra ekranda:",
              content: ["Batareya faizi", "Bağlantı statusu görünəcək."],
              type: "bullet-list",
              image: humditySensorImage4,
              aboutContent: (
                <Text>
                  Bu mərhələdə sensorun hansı klapanlarla əlaqəli olacağını
                  seçin. Seçilən klapanlar üçün rütubət məlumatları istifadə
                  olunacaq.
                </Text>
              ),
            },
            {
              subtitle: "5. Bitirin",
              content: [
                "Seçimləri etdikdən sonra “Tamamla” düyməsinə toxunun.",
              ],
              type: "paragraph",
              image: humditySensorImage5,
            },
          ],
        },
      },
    ],
    [],
  );
  return (
    <SafeAreaView style={styles.guide}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tətbiq bələdçisi</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.contentContainer}>
          <FlatList
            data={guideDatas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              //   const Icon = item.Icon;
              return (
                <TouchableOpacity onPress={() => handleCardPress(item)}>
                  <View
                    style={[
                      styles.guideCard,
                      item.id === 1 && { marginTop: 0 },
                    ]}
                  >
                    <View style={styles.guideIconContainer}>
                      <Image
                        source={item.image}
                        style={{ width: 80, height: 90, resizeMode: "contain" }}
                      />
                      {/* <Icon /> */}
                    </View>
                    <View style={styles.guideContent}>
                      <Text style={styles.labelText}>{item.label}</Text>
                      <Text style={styles.descText}>{item.desc}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <GuideModal
        visible={modalVisible}
        onClose={handleCloseModal}
        guideData={selectedGuide}
      />
    </SafeAreaView>
  );
};

export default Guide;

const styles = StyleSheet.create({
  guide: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 40,
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
    padding: 16,
  },

  guideCard: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingRight: 16,
    paddingVertical: 12,
    paddingLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  guideIconContainer: {
    backgroundColor: "#F5F7FA",
    borderRadius: 16,
    height: 90,
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  guideContent: {
    marginLeft: 8,
    flex: 1,
    flexShrink: 1,
  },

  labelText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 500,
  },
  descText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 400,
    color: "#717784",
  },
});
