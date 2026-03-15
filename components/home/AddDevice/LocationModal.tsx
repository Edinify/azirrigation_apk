import CurrentLocationIcon from "@/assets/icons/home/add-device/location-line.svg";
import SearchIcon from "@/assets/icons/home/add-device/search-line.svg";
import CloseIcon from "@/assets/icons/menu/profile/closeIcon.svg";
import { useUpdateMainMutation } from "@/services/devices/deviceApi";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LocationData } from "./AddDeviceName";

interface LocationProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  currentValue?: string;
  id: string;
}

interface WeatherLocation {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const LocationModal = ({
  visible,
  onClose,
  onLocationSelect,
  currentValue,
  id,
}: LocationProps) => {
  const [updateMain] = useUpdateMainMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<WeatherLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const WEATHER_API_KEY = "9f6378993c8050a4d21c24243ced35d3";

  const handleCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "İcazə lazımdır",
          "Cari məkanınızı göstərmək üçün məkan icazəsi lazımdır.",
        );
        return;
      }

      setIsLoading(true);

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`,
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const place = data[0];
        const locationData: LocationData = {
          name: place.name,
          address: `${place.name}, ${place.state || ""}, ${place.country}`,
          lat: latitude,
          lng: longitude,
        };

        if (id) {
          try {
            const data = await updateMain({
              mainDeviceId: id,
              body: {
                location: { lat: latitude, lng: longitude },
              },
            }).unwrap();

            console.log(data, "dataaaaaaaaaaaaa");
          } catch (error) {
            console.log("Location update error:", error);
          }
        }

        onLocationSelect(locationData);
        handleClose();
      }
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("Xəta", "Məkan əldə edilərkən xəta baş verdi.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ OpenWeatherMap Geocoding API - Şəhər axtarışı
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    try {
      // ✅ Direct geocoding by city name
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query,
        )}&limit=10&appid=${WEATHER_API_KEY}`,
      );

      const data: WeatherLocation[] = await response.json();

      if (data && data.length > 0) {
        setPredictions(data);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Xəta", "Axtarış zamanı xəta baş verdi");
    }
  };

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      searchPlaces(text);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handlePlaceSelect = async (place: WeatherLocation) => {
    const locationData: LocationData = {
      name: place.name,
      address: `${place.name}${place.state ? `, ${place.state}` : ""}, ${place.country}`,
      lat: place.lat,
      lng: place.lon,
    };

    if (id) {
      try {
        const data = await updateMain({
          mainDeviceId: id,
          body: {
            location: { lat: place.lat, lng: place.lon },
          },
        }).unwrap();

        console.log(data, " update data");
      } catch (error) {
        console.log("Location update error:", error);
      }
    }

    onLocationSelect(locationData);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setPredictions([]);
    if (searchTimeout) clearTimeout(searchTimeout);
    onClose();
  };

  useEffect(() => {
    if (visible && currentValue) {
      setSearchQuery(currentValue);
    } else if (!visible) {
      setSearchQuery(""); // ✅ bağlananda təmizlə
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeIconContainer}
            >
              <CloseIcon width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchIcon width={20} height={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Şəhər və ya yer axtarın"
              placeholderTextColor="#A0A8B0"
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  setSearchQuery("");
                  setPredictions([]);
                }}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.currentLocationBtn}
            onPress={handleCurrentLocation}
            disabled={isLoading}
          >
            <View style={styles.currentLocationIcon}>
              <CurrentLocationIcon width={24} height={24} />
            </View>
            <Text style={styles.currentLocationText}>
              {isLoading ? "Yüklənir..." : "Cari yerimi istifadə et"}
            </Text>
          </TouchableOpacity>

          <FlatList
            data={predictions}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handlePlaceSelect(item)}
              >
                <Text style={styles.resultMainText}>
                  {item.name} ,{" "}
                  <Text style={styles.resultSecondaryText}>{item.country}</Text>
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Search Results */}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default LocationModal;

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
    paddingBottom: 40,
    height: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4E7EC",
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    position: "relative",
    marginBottom: 20,
  },
  closeIconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 8,
    backgroundColor: "#EEF2F6",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 30,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#0E121B",
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  clearIcon: {
    fontSize: 12,
    color: "white",
  },
  currentLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0069FE",
  },

  countryText: {
    color: "#0E121B",
    fontSize: 16,
    fontWeight: 400,
    marginTop: 20,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    paddingVertical: 12,
  },
  resultMainText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E121B",
    marginBottom: 4,
  },
  resultSecondaryText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#717784",
  },
});
