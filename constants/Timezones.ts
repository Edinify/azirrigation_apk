// constants/Timezones.ts
export interface Timezone {
  id: string;
  label: string;
  offset: string;
  value: string;
}

export const TIMEZONES: Timezone[] = [
  { id: "1", label: "Bakı vaxtı", offset: "GMT+4", value: "Asia/Baku" },
  {
    id: "2",
    label: "İstanbul vaxtı",
    offset: "GMT+3",
    value: "Europe/Istanbul",
  },
  { id: "3", label: "Tbilisi vaxtı", offset: "GMT+4", value: "Asia/Tbilisi" },
  { id: "4", label: "Moskva vaxtı", offset: "GMT+3", value: "Europe/Moscow" },
  { id: "5", label: "London vaxtı", offset: "GMT+0", value: "Europe/London" },
  { id: "6", label: "Berlin vaxtı", offset: "GMT+1", value: "Europe/Berlin" },
  { id: "7", label: "Paris vaxtı", offset: "GMT+1", value: "Europe/Paris" },
  { id: "8", label: "Roma vaxtı", offset: "GMT+1", value: "Europe/Rome" },
  { id: "9", label: "Madrid vaxtı", offset: "GMT+1", value: "Europe/Madrid" },
  { id: "10", label: "Varşava vaxtı", offset: "GMT+1", value: "Europe/Warsaw" },
  { id: "11", label: "Kiyev vaxtı", offset: "GMT+2", value: "Europe/Kiev" },
  { id: "12", label: "Afina vaxtı", offset: "GMT+2", value: "Europe/Athens" },
  {
    id: "13",
    label: "Nyu York vaxtı",
    offset: "GMT-5",
    value: "America/New_York",
  },
  {
    id: "14",
    label: "Los Anceles vaxtı",
    offset: "GMT-8",
    value: "America/Los_Angeles",
  },
  { id: "15", label: "Tokio vaxtı", offset: "GMT+9", value: "Asia/Tokyo" },
  { id: "16", label: "Dubay vaxtı", offset: "GMT+4", value: "Asia/Dubai" },
];
