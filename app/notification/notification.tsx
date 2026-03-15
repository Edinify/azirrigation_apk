import TrashIcon from "@/assets/icons/home/add-device/trash.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import NotStatusIcon from "@/assets/icons/notification/not_status.svg";
import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Interface əlavə et
interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  Icon: any;
  iconBg: string;
}

interface NotificationSection {
  id: number;
  month: string;
  items: NotificationItem[];
}

const Notification = () => {
  const router = useRouter();

  // ✅ State-ə çevir
  const [notificationData, setNotificationData] = useState<
    NotificationSection[]
  >([
    {
      id: 1,
      month: "Aprel",
      items: [
        {
          id: "1-1",
          title: "Yeniləmə alınmadı",
          desc: "Bağ sahəsi cihazı yenilənmədi. Cihaz internetə (Wi-Fi) qoşulan kimi sistem avtomatik yenidən cəhd edəcək.",
          date: "12:43",
          Icon: NotStatusIcon,
          iconBg: "rgba(0, 105, 254, 0.10)",
        },
        {
          id: "1-2",
          title: "Yeniləmə var",
          desc: "Bağ sahəsi cihazı üçün yeniləmə mövcuddur. Cihaz internetə (Wi-Fi) qoşulan kimi yeniləmə avtomatik başlayacaq.",
          date: "Dünən",
          Icon: NotStatusIcon,
          iconBg: "#EEF2F6",
        },
        {
          id: "1-3",
          title: "Yaddaş dolur",
          desc: "Bağ sahəsi cihazında yer azalır. İnternet olduqda məlumatlar avtomatik köçürüləcək və cihazda yer boşalacaq.",
          date: "Dünən",
          Icon: NotStatusIcon,
          iconBg: "#EEF2F6",
        },
      ],
    },
    {
      id: 2,
      month: "Mart",
      items: [
        {
          id: "2-1",
          title: "Sistem xətası",
          desc: "Bağ sahəsi cihazında problem aşkarlandı. Bu səbəbdən suvarma dayandırıla və ya təxirə salına bilər. ERR-478",
          date: "25 mar",
          Icon: NotStatusIcon,
          iconBg: "#EEF2F6",
        },
      ],
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);

  // ✅ Delete modal aç
  const onDeleteNotification = (id: string) => {
    console.log("📌 Delete clicked for:", id);
    setSelectedNotificationId(id);
    setShowDeleteModal(true);
  };

  // ✅ Confirm delete
  const handleConfirmDelete = () => {
    if (!selectedNotificationId) return;

    console.log("🗑️ Deleting notification:", selectedNotificationId);

    // ✅ Notification-u sil
    setNotificationData(
      (prevData) =>
        prevData
          .map((section) => ({
            ...section,
            items: section.items.filter(
              (item) => item.id !== selectedNotificationId,
            ),
          }))
          .filter((section) => section.items.length > 0), // ✅ Boş section-ları da sil
    );

    setShowDeleteModal(false);
    setSelectedNotificationId(null);
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onDeleteNotification(id)}
        activeOpacity={0.8}
      >
        <TrashIcon />
      </TouchableOpacity>
    );
  };

  const renderIcon = (IconComponent: any) => {
    if (!IconComponent) return null;

    return (
      <View style={styles.iconContainer}>
        <IconComponent />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.notificationPage} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BackIcon />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Bildirişlər</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        {/* Notifications */}
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.datasContainer}>
            {notificationData.length === 0 ? (
              // ✅ Empty state
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Bildiriş yoxdur</Text>
              </View>
            ) : (
              notificationData.map((section) => (
                <View key={section.id} style={styles.section}>
                  <Text style={styles.monthText}>{section.month}</Text>
                  {section.items.map((item) => (
                    <Swipeable
                      key={item.id}
                      renderRightActions={() => renderRightActions(item.id)}
                      overshootRight={false}
                      friction={2}
                      rightThreshold={40}
                      containerStyle={styles.swipeableContainer} // ✅ ƏLAVƏ
                    >
                      <View style={styles.itemCard}>
                        <View style={styles.itemLeft}>
                          {renderIcon(item.Icon)}
                          <View style={styles.itemContent}>
                            <View style={styles.titleRow}>
                              <Text style={styles.titleText}>{item.title}</Text>
                              <Text style={styles.dateText}>{item.date}</Text>
                            </View>
                            <Text style={styles.descText}>{item.desc}</Text>
                          </View>
                        </View>
                      </View>
                    </Swipeable>
                  ))}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      {/* ✅ Delete Modal */}
      <CommonConfirmModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedNotificationId(null);
        }}
        text="Bildirişi silmək istədiyinizdən əminsiniz?"
        desc="Bu bildirişi siyahıdan siləcəyik."
        onFinish={handleConfirmDelete} // ✅ Düzgün funksiya
        type="notification"
      />
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notificationPage: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  datasContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  monthText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#717784",
    marginBottom: 12,
  },
  // ✅ Swipeable container
  swipeableContainer: {
    marginTop: 12, // ✅ Card-dan kənara çıxardıq
  },
  itemCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0, 105, 254, 0.10)",
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
  },
  descText: {
    fontSize: 14,
    color: "#717784",
    fontWeight: "400",
    lineHeight: 20,
  },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    marginTop: 12, // ✅ Swipeable ilə eyni margin
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  // ✅ Empty state
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#717784",
  },
});
