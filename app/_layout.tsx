import { tokenService } from "@/services/token/tokenServices";
import { store } from "@/store/store";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "SF-Pro-Display-Italic": require("../assets/fonts/SF-Pro-Italic.ttf"),
    "SF-Pro-Display": require("../assets/fonts/SF-Pro.ttf"),
  });

  const router = useRouter();

  const checkAuth = async () => {
    const token = await tokenService.getAccessToken();
    const refresh = await tokenService.getRefreshToken();
    console.log("🔍 checkAuth - access:", token);
    console.log("🔍 checkAuth - refresh:", refresh);

    if (!token) {
      router.replace("/auth/login");
    } else {
      router.replace("/(tabs)");
    }
  };

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    checkAuth();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar style="dark" backgroundColor="#fff" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#fff" },
              // ✅ Android üçün
              animation:
                Platform.OS === "android" ? "slide_from_right" : "default",
              // ✅ Modal prezentasiyası
              presentation: "card",
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="changePassword" />
            <Stack.Screen name="fag" />
            <Stack.Screen name="about" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="notification" />
          </Stack>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
