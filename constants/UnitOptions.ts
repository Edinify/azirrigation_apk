// constants/UnitsOptions.ts

import { OptionItem } from "@/components/settings/OptionPicker";

// Saat formatı
export const HOUR_FORMAT_OPTIONS: OptionItem[] = [
  { id: "1", label: "24 saat", value: "24h" },
  { id: "2", label: "12 saat (AM/PM)", value: "12h" },
];

// Tarix formatı
export const DATE_FORMAT_OPTIONS: OptionItem[] = [
  { id: "1", label: "Gün/Ay/İl", value: "DD/MM/YYYY" },
  { id: "2", label: "Ay/Gün/İl", value: "MM/DD/YYYY" },
  { id: "3", label: "İl-Ay-Gün", value: "YYYY-MM-DD" },
];

// Temperatur
export const TEMPERATURE_OPTIONS: OptionItem[] = [
  { id: "1", label: "Selsi (°C)", value: "celsius" },
  { id: "2", label: "Farenhayt (°F)", value: "fahrenheit" },
];

// Yağış miqdarı
export const PRECIPITATION_OPTIONS: OptionItem[] = [
  { id: "1", label: "Milimetr (mm)", value: "mm" },
  { id: "2", label: "Düym (inch)", value: "inch" },
];

// Külək sürəti
export const WIND_SPEED_OPTIONS: OptionItem[] = [
  { id: "1", label: "km/saat", value: "kmh" },
  { id: "3", label: "mil/saat (mph) ", value: "mph" },
];
