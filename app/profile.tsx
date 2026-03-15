import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import ProfileArrow from "@/assets/icons/menu/profileArrow.svg";

import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import CommonUpdateInput from "@/components/commonComponents/CommonUpdateInput/CommonUpdateInput";
import { useLogoutApiMutation } from "@/services/auth/authApi";
import { logout } from "@/services/auth/authSlice";
import { tokenService } from "@/services/token/tokenServices";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import EditPhone from "../components/Profile/EditPhone";
const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutApiMutation();

  const { fullName, phone } = useLocalSearchParams<{
    fullName?: string;
    phone?: string;
  }>();

  const [isOpenUserNameModal, setIsOpenUserNameModal] = useState(false);
  const [isOpenPhoneModal, setIsOpenPhoneModal] = useState(false);
  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] =
    useState(false);
  const [name, setName] = useState(fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(phone || "");

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      dispatch({ type: "RESET_ALL" });
      router.replace("/auth/login");
    } catch (error) {
      await tokenService.clearTokens();
    }
  };

  // const handleChangeFullName = async () => {
  //   try {
  //      updateProfile({ fullName: name }).unwrap();

  //     setIsOpenUserNameModal(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const profileDatas = useMemo(
    () => [
      {
        id: 1,
        label: "Ad soyad",
        value: name,
        click: () => setIsOpenUserNameModal(true),
      },
      {
        id: 2,
        label: "Telefon nömrəsi",
        value: phoneNumber,
        click: () => setIsOpenPhoneModal(true),
      },
      {
        id: 3,
        label: "Şifrə",
        value: "Son dəyişmə: ",
        click: () => router.push("/changePassword"),
      },
      {
        id: 4,
        label: "Hesabı sil",
        value: "Bu əməliyyatdan geri dönüş yoxdur",
        click: () => setIsOpenDeleteAccountModal(true),
      },
    ],
    [name, phoneNumber],
  );

  return (
    <View style={styles.profile}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profil məlumatları</Text>
        </View>
        <View style={styles.devicesContainer}>
          {profileDatas?.map((device, index) => {
            return (
              <TouchableOpacity
                onPress={device.click}
                key={device.id}
                style={[
                  styles.deviceCard,
                  index === profileDatas.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View style={styles.deviceContent}>
                  <Text style={styles.deviceText}>{device.label}</Text>
                  <Text style={styles.deviceSubText}>{device.value}</Text>
                </View>

                <ProfileArrow />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıxış et</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isOpenUserNameModal && (
        <CommonUpdateInput
          visible={isOpenUserNameModal}
          value={name}
          onChange={setName}
          onClose={() => setIsOpenUserNameModal(false)}
          text="Ad soyad"
          type="profile"
        />
      )}
      {isOpenPhoneModal && (
        <EditPhone
          visible={isOpenPhoneModal}
          value={phoneNumber}
          onChange={setPhoneNumber}
          onClose={() => setIsOpenPhoneModal(false)}
        />
      )}

      <CommonConfirmModal
        visible={isOpenDeleteAccountModal}
        onClose={() => setIsOpenDeleteAccountModal(false)}
        type="profile"
        onFinish={() => setIsOpenDeleteAccountModal(false)}
        text=" Hesabı silmək istədiyinizdən əminsiniz?"
        desc=" Hesabınız və ona bağlı bütün cihazlar, zonalar və suvarma planları
            silinəcək. Bu əməliyyatı geri qaytarmaq mümkün deyil."
      />
      {/* )} */}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profile: {
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
  },
  headerText: {
    width: "100%",
    textAlign: "center",
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 600,
  },

  devicesContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
  },
  deviceContent: {},
  deviceText: {
    fontSize: 16,
    color: "#0E121B",
    fontWeight: 500,
  },
  deviceSubText: {
    marginTop: 6,
    color: "#717784",
    fontSize: 14,
    fontWeight: 400,
  },
  logoutContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 16,
  },
  logoutText: {
    color: "#FE171B",
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
});
