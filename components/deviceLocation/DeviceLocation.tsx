// components/DeviceLocationText.tsx
import { useLocationName } from "@/hooks/useLocationName";
import { Text } from "react-native";

interface Props {
  lat?: number;
  lng?: number;
  style?: any;
}

export const DeviceLocationText = ({ lat, lng, style }: Props) => {
  const locationName = useLocationName(lat, lng);
  if (!locationName) return null;
  return <Text style={style}>{locationName}</Text>;
};
