import DownArrowIcon from "@/assets/icons/downArrow.svg";
import CheckIcon from "@/assets/icons/history/circle-check.svg";
import StopIcon from "@/assets/icons/history/circle-stop.svg";
import DrizzleIcon from "@/assets/icons/history/drizzle.svg";
import ForwardIcon from "@/assets/icons/history/forward.svg";
import GaugeIcon from "@/assets/icons/history/gauge-low.svg";
import PumpIcon from "@/assets/icons/history/pump-impeller.svg";
import WaterArrowIcon from "@/assets/icons/history/water-arrow-down.svg";
import WifiIcon from "@/assets/icons/history/wireless-solid.svg";
import CommonUnitModal from "@/components/commonComponents/CommonUnitModal/CommonUnitModal";
import AboutHistory from "@/components/history/AboutHistory/AboutHistory";
import { useGetAllValvesQuery } from "@/services/devices/deviceApi";
import { useGetHistoriesByDeviceIdQuery } from "@/services/history/historyApi";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectedDateType =
  | "last_seven_days"
  | "this_month"
  | "previous_month"
  | "last_month"
  | "last_three_months";

export type SelectedValveType = "all_valves";

type RangeType =
  | "last_seven_days"
  | "this_month"
  | "previous_month"
  | "last_month"
  | "last_three_months";

interface Valve {
  _id: string;
  name: string;
  valveId: number;
}

interface DateRangeOption {
  id: number;
  value: RangeType;
  label: string;
}

// ─── Filter options ───────────────────────────────────────────────────────────

const DATE_RANGES: DateRangeOption[] = [
  { id: 1, value: "last_seven_days", label: "Son 7 gün" },
  { id: 2, value: "last_month", label: "Son 30 gün" },
  { id: 3, value: "previous_month", label: "Keçən ay" },
  { id: 4, value: "this_month", label: "Bu ay" },
  { id: 5, value: "last_three_months", label: "Son 3 ay" },
];

// ─── History type config ──────────────────────────────────────────────────────

const MONTHS_AZ = [
  "Yan",
  "Fev",
  "Mart",
  "Apr",
  "May",
  "İyn",
  "İyl",
  "Avg",
  "Sen",
  "Okt",
  "Noy",
  "Dek",
];

const HISTORY_TYPE_CONFIG: Record<
  string,
  {
    title: string;
    Icon: any;
    iconColor: string;
    iconBg: string;
    type?: string;
  }
> = {
  complete_irrigation: {
    title: "Suvarma tamamlandı",
    Icon: CheckIcon,
    iconColor: "#10B981",
    iconBg: "rgba(0, 171, 28, 0.10)",
    type: "completed",
  },
  stopped_plan: {
    title: "Plan dayandırıldı",
    Icon: StopIcon,
    iconColor: "#6B7280",
    iconBg: "#E4E7EC",
    type: "stopped",
  },
  empty_pool: {
    title: "Hovuzda su bitib",
    Icon: WaterArrowIcon,
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
    type: "empty_pool",
  },
  no_water_flow: {
    title: "Su axını aşkarlanmadı",
    Icon: PumpIcon,
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
    type: "no_water_flow",
  },
  low_pressure: {
    title: "Təzyiq aşağıdır",
    Icon: GaugeIcon,
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
    type: "low_pressure",
  },
  no_connection: {
    title: "Bağlantı kəsildi",
    Icon: WifiIcon,
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
    type: "no_connection",
  },
  rain_warning: {
    title: "Güclü yağış var",
    Icon: DrizzleIcon,
    iconColor: "#EF4444",
    iconBg: "#FEE2E2",
    type: "rain_warning",
  },
  rain_delay: {
    title: "Yağış gözlənilir",
    Icon: ForwardIcon,
    iconColor: "#3B82F6",
    iconBg: "#DBEAFE",
    type: "rain_delay",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapHistoryItem = (item: any) => {
  const config = HISTORY_TYPE_CONFIG[item.historyType] ?? {
    title: item.historyType,
    Icon: CheckIcon,
    iconColor: "#717784",
    iconBg: "#F3F4F6",
    type: item.type,
  };

  const date = new Date(item.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_AZ[date.getMonth()].toLowerCase();
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");

  const durationSec = item.irrigationPeriod ?? 0;
  const h = Math.floor(durationSec / 3600);
  const m = Math.floor((durationSec % 3600) / 60);
  const s = durationSec % 60;
  const duration =
    durationSec > 0
      ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : "";

  return {
    id: item._id,
    ...config,
    location: item.valveName ?? "",
    date: `${day} ${month} ${hours}:${mins}`,
    duration,
    waterConsumption: item.waterConsumption,
    electricity: item.electricity,
    plan: item.plan,
    raw: item,
  };
};

const groupByMonth = (items: any[]) => {
  const groups: Record<string, { id: string; month: string; items: any[] }> =
    {};

  items.forEach((item) => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups[key]) {
      groups[key] = {
        id: key,
        month: `${MONTHS_AZ[date.getMonth()]} ${date.getFullYear()}`,
        items: [],
      };
    }
    groups[key].items.push(mapHistoryItem(item));
  });

  return Object.values(groups);
};

const getDateRange = (
  range: SelectedDateType,
): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = now.toISOString(); // ✅ həmişə bugün

  switch (range) {
    case "last_seven_days":
      return {
        startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
        endDate,
      };
    case "last_month":
      return {
        startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
        endDate,
      };
    case "previous_month": {
      // ✅ keçən ayın 1-i → axırı
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
      );
      return {
        startDate: firstDay.toISOString(),
        endDate: lastDay.toISOString(),
      };
    }
    case "this_month":
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        endDate,
      };
    case "last_three_months":
      return {
        startDate: new Date(Date.now() - 90 * 86400000).toISOString(),
        endDate,
      };
  }
};

const getDateFilterLabel = (range: SelectedDateType): string => {
  switch (range) {
    case "last_seven_days":
      return "Son 7 gün";
    case "last_month":
      return "Son 30 gün";
    case "previous_month":
      return "Keçən ay"; // ✅
    case "this_month":
      return "Bu ay";
    case "last_three_months":
      return "Son 3 ay";
  }
};

const LIMIT = 20;

const History = () => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showValveFilter, setShowValveFilter] = useState(false);
  const [selectedHistoryData, setSelectedHistoryData] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);

  const [selectedDateRange, setSelectedDateRange] =
    useState<SelectedDateType>("last_seven_days");
  const [selectedValve, setSelectedValve] = useState<string>("");

  const [allItems, setAllItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { startDate, endDate } = getDateRange(selectedDateRange);

  const { deviceId } = useSelector((state) => state.deviceForm);

  const { data: allValves } = useGetAllValvesQuery(deviceId);

  console.log(allValves, "all valves");

  const valveOptions = [
    { value: "", label: "Bütün sahələr" },
    ...(allValves?.map((v: Valve) => ({
      value: String(v.valveId),
      label: v.name,
    })) ?? []),
  ];

  const getValveLabel = () => {
    if (!selectedValve) return "Bütün sahələr";
    const found = allValves?.find(
      (v: Valve) => String(v.valveId) === selectedValve,
    );
    return found?.name ?? "Bütün sahələr";
  };

  const { data: history, isFetching } = useGetHistoriesByDeviceIdQuery({
    deviceId,
    length: offset,
    limit: LIMIT,
    startDate,
    endDate,
    ...(selectedValve !== "" && { valveId: selectedValve }),
  });

  useEffect(() => {
    if (!history) return;

    const items = Array.isArray(history) ? history : (history?.data ?? []);

    if (offset === 0) {
      setAllItems(items);
    } else {
      setAllItems((prev) => [...prev, ...items]);
    }
    setHasMore(items.length === LIMIT);
    setIsFetchingMore(false);
  }, [history]);

  // ✅ Filter dəyişəndə sıfırla
  useEffect(() => {
    setOffset(0);
    setAllItems([]);
    setHasMore(true);
  }, [selectedDateRange, selectedValve]);

  // ✅ Scroll sona çatanda növbəti batch yüklə
  const handleScroll = (e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isBottom && hasMore && !isFetching && !isFetchingMore) {
      setIsFetchingMore(true);
      setOffset((prev) => prev + LIMIT);
    }
  };

  const renderIcon = (
    IconComponent: any,
    iconColor: string,
    iconBg: string,
  ) => {
    if (!IconComponent) return null;
    return (
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <IconComponent />
      </View>
    );
  };

  const groupedData = groupByMonth(allItems);

  return (
    <ScrollView
      style={styles.historyPage}
      onScroll={handleScroll}
      scrollEventThrottle={400}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tarixçə</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.dateFilterContainer}
            onPress={() => setShowDateFilter(true)}
          >
            <Text style={styles.dateFilterText}>
              {getDateFilterLabel(selectedDateRange)}
            </Text>
            <DownArrowIcon width={12} height={12} style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowValveFilter(true)}
            style={[styles.dateFilterContainer, { marginLeft: 8 }]}
          >
            <Text style={styles.dateFilterText}>{getValveLabel()}</Text>
            <DownArrowIcon width={12} height={12} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.datasContainer}>
          {isFetching && offset === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Yüklənir...</Text>
            </View>
          ) : groupedData?.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Suvarma yoxdur</Text>
            </View>
          ) : (
            groupedData?.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={styles.monthTitle}>{section.month}</Text>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={() => {
                      setSelectedHistoryData(item);
                      setShowHistory(true);
                    }}
                  >
                    <View style={styles.itemLeft}>
                      {renderIcon(item.Icon, item.iconColor, item.iconBg)}
                      <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemLocation}>{item.location}</Text>
                        <Text style={styles.itemDate}>{item.date}</Text>
                      </View>
                    </View>
                    {item?.duration ? (
                      <View style={styles.itemDurationContainer}>
                        <Text style={styles.itemDuration}>{item.duration}</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}

          {/* ─── Pagination indicators ─── */}
          {isFetching && offset > 0 && (
            <View style={styles.paginationLoader}>
              <Text style={styles.loadingText}>Yüklənir...</Text>
            </View>
          )}
          {!hasMore && allItems.length > 0 && (
            <View style={styles.paginationLoader}>
              <Text style={styles.endText}>Bütün məlumatlar yükləndi</Text>
            </View>
          )}
        </View>
      </View>

      {/* ─── Modals ─── */}
      <CommonUnitModal
        visible={showDateFilter}
        onClose={() => setShowDateFilter(false)}
        selectedValue={selectedDateRange}
        onSelect={(v) => setSelectedDateRange(v as SelectedDateType)}
        title="Tarix filterləri"
        options={DATE_RANGES}
      />

      <CommonUnitModal
        visible={showValveFilter}
        onClose={() => setShowValveFilter(false)}
        selectedValue={selectedValve}
        onSelect={(v) => setSelectedValve(v as SelectedValveType)}
        title="Sahə filteri"
        options={valveOptions}
      />

      {selectedHistoryData && (
        <AboutHistory
          visible={showHistory}
          onClose={() => setShowHistory(false)}
          data={selectedHistoryData}
        />
      )}
    </ScrollView>
  );
};

export default History;

const styles = StyleSheet.create({
  historyPage: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    marginVertical: 13,
  },
  headerTitle: {
    color: "#0E121B",
    fontSize: 24,
    fontWeight: "600",
  },
  filterContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  dateFilterContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  dateFilterText: {
    color: "#0E121B",
    fontSize: 14,
    fontWeight: "500",
  },
  datasContainer: {
    marginTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#717784",
    marginBottom: 8,
  },
  historyItem: {
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 100,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },
  itemLocation: {
    fontSize: 14,
    color: "#717784",
    marginVertical: 4,
    fontWeight: "400",
  },
  itemDate: {
    fontSize: 14,
    color: "#717784",
    fontWeight: "400",
  },
  itemDurationContainer: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9,
    height: 30,
    justifyContent: "center",
  },
  itemDuration: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0E121B",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    color: "#717784",
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  emptyText: {
    color: "#717784",
    fontSize: 14,
  },
  paginationLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  endText: {
    color: "#A0A8B0",
    fontSize: 13,
  },
});
