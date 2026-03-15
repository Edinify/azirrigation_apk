// hooks/useLocationName.ts
import { useEffect, useState } from "react";

const WEATHER_API_KEY = "9f6378993c8050a4d21c24243ced35d3";

export const useLocationName = (lat?: number, lng?: number) => {
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    if (!lat || !lng) return;

    fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${WEATHER_API_KEY}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setLocationName(`${data[0].name}, ${data[0].country}`);
        }
      })
      .catch(() => setLocationName(""));
  }, [lat, lng]);

  return locationName;
};
