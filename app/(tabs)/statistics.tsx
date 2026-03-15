// app/(tabs)/statistics.tsx
import LeftArrowIcon from "@/assets/icons/back.svg";
import DownArrowIcon from "@/assets/icons/downArrow.svg";
import RightArrowIcon from "@/assets/icons/rightIcon.svg";
import ActiveDropIcon from "@/assets/icons/statistics/activeDrop.svg";
import ActiveLightIcon from "@/assets/icons/statistics/activeLight.svg";
import CalendarIcon from "@/assets/icons/statistics/calendar.svg";
import DropIcon from "@/assets/icons/statistics/drop.svg";
import LightIcon from "@/assets/icons/statistics/light.svg";
import {
  getMonthData,
  getMonthRange,
  getWeekData,
  getWeekRange,
  getYearData,
  getYearRange,
} from "@/utils/dateHelpers";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import DatePickerModal from "../../components/Statistics/DatePickerModal";
import RangeSelectorModal from "../../components/Statistics/RangeSelectorModal";

const screenWidth = Dimensions.get("window").width;

export default function StatisticsScreen() {
  const [selectedTab, setSelectedTab] = useState<
    "weekly" | "monthly" | "yearly" | "select_date"
  >("weekly");
  const [selectedType, setSelectedType] = useState<"water" | "electric">(
    "water",
  );
  const [selectDateRange, setSelectedDateRange] = useState<
    "weekly" | "monthly" | "3 month"
  >("weekly");
  const [currentDate, setCurrentDate] = useState("");
  const [dateOffset, setDateOffset] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRangeSelector, setShowRangeSelector] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calendar mode üçün cari tarixi format et
  const getCalendarDate = () => {
    const monthNamesAz = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avqust",
      "sentyabr",
      "oktyabr",
      "noyabr",
      "dekabr",
    ];
    const day = new Date().getDate().toString().padStart(2, "0");
    const month = monthNamesAz[selectedMonth];
    const year = selectedYear;

    return `${day} ${month} ${year}`;
  };

  const [openCalendar, setOpenCalendar] = useState(false);

  const isWater = selectedType === "water";

  // Tab və offset dəyişəndə tarixi yenilə
  useEffect(() => {
    let dateRange = "";

    switch (selectedTab) {
      case "weekly":
        dateRange = getWeekRange(dateOffset);
        break;
      case "monthly":
        dateRange = getMonthRange(dateOffset);
        break;
      case "yearly":
        dateRange = getYearRange(dateOffset);
        break;
      case "select_date":
        // Custom date picker logic
        dateRange = getWeekRange(dateOffset);
        break;
    }

    setCurrentDate(dateRange);
  }, [selectedTab, dateOffset]);

  // Date picker-dən tarix seçiləndə
  const handleDateSelect = (day: number, month: number, year: number) => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Range seçiləndə
  const handleRangeSelect = (range: "weekly" | "monthly" | "3 month") => {
    setSelectedDateRange(range);
  };

  // Chart data-nı tab-a görə seç
  const getChartData = () => {
    let data;

    switch (selectedTab) {
      case "weekly":
        data = getWeekData(dateOffset);
        break;
      case "monthly":
        data = getMonthData(dateOffset);
        break;
      case "yearly":
        data = getYearData(dateOffset);
        break;
      default:
        data = getWeekData(dateOffset);
    }

    return {
      labels: data.labels,
      datasets: [
        {
          data: isWater ? data.waterData : data.electricData,
        },
      ],
    };
  };

  const chartData = getChartData();

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces:
      selectedTab === "yearly" ? 0 : selectedTab === "weekly" ? 0 : 0,
    color: () => (isWater ? "#0069FE" : "#FE5E14"),
    labelColor: () => "#0E121B",
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#E5E7EB",
    },
    fillShadowGradientOpacity: 1,
  };

  const handlePrevious = () => {
    setDateOffset(dateOffset - 1);
  };

  const handleNext = () => {
    setDateOffset(dateOffset + 1);
  };

  const handleTabChange = (
    tab: "weekly" | "monthly" | "yearly" | "select_date",
  ) => {
    setSelectedTab(tab);
    setDateOffset(0); // Reset to current period
  };

  // Ortalama hesabla
  const calculateAverage = () => {
    const data = chartData.datasets[0].data;
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;

    if (selectedTab === "yearly") {
      return isWater
        ? `${(avg / 1000).toFixed(1)}k L`
        : `${avg.toFixed(1)} kWh`;
    }

    return isWater
      ? `${Math.round(avg).toLocaleString()} L`
      : `${avg.toFixed(2)} kWh`;
  };

  // Ümumi cəm hesabla
  const calculateTotal = () => {
    const data = chartData.datasets[0].data;
    const sum = data.reduce((acc, val) => acc + val, 0);

    if (selectedTab === "yearly") {
      return isWater
        ? `${(sum / 1000).toFixed(1)}k L`
        : `${sum.toFixed(0)} kWh`;
    }

    return isWater
      ? `${Math.round(sum).toLocaleString()} L`
      : `${sum.toFixed(2)} kWh`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistika</Text>
      </View>

      {/* Tab selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "weekly" && styles.tabActive]}
          onPress={() => {
            handleTabChange("weekly");
            setOpenCalendar(false);
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "weekly" && styles.tabTextActive,
            ]}
          >
            Həftəlik
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "monthly" && styles.tabActive]}
          onPress={() => {
            handleTabChange("monthly");
            setOpenCalendar(false);
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "monthly" && styles.tabTextActive,
            ]}
          >
            Aylıq
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "yearly" && styles.tabActive]}
          onPress={() => {
            handleTabChange("yearly");
            setOpenCalendar(false);
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "yearly" && styles.tabTextActive,
            ]}
          >
            İllik
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "select_date" && styles.tabActive,
          ]}
          onPress={() => {
            handleTabChange("select_date");
            setOpenCalendar(true);
          }}
        >
          <CalendarIcon width={20} height={20} />
        </TouchableOpacity>
      </View>

      {openCalendar ? (
        <View style={styles.calendarNavigation}>
          <TouchableOpacity
            style={styles.dateTextContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{currentDate}</Text>
            <View style={{ marginLeft: 8 }}>
              <DownArrowIcon width={16} height={16} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateRange}
            onPress={() => setShowRangeSelector(true)}
          >
            <Text style={styles.rangeText}>
              {selectDateRange === "weekly"
                ? "Həftəlik"
                : selectDateRange === "monthly"
                  ? "Aylıq"
                  : "3 aylıq"}
            </Text>
            <View style={{ marginLeft: 8 }}>
              <DownArrowIcon width={16} height={16} />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            onPress={handlePrevious}
            style={styles.arrowContainer}
          >
            <LeftArrowIcon width={22} height={22} />
          </TouchableOpacity>

          <View style={styles.dateTextContainer}>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>

          <TouchableOpacity onPress={handleNext} style={styles.arrowContainer}>
            <RightArrowIcon width={22} height={22} />
          </TouchableOpacity>
        </View>
      )}

      {/* Type selector and average */}
      <View style={styles.avarageContainer}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, isWater && styles.typeButtonActive]}
            onPress={() => setSelectedType("water")}
          >
            {isWater ? <ActiveDropIcon /> : <DropIcon />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, !isWater && styles.typeButtonActive]}
            onPress={() => setSelectedType("electric")}
          >
            {!isWater ? <ActiveLightIcon /> : <LightIcon />}
          </TouchableOpacity>
        </View>

        <View style={styles.averageContainer}>
          <Text style={styles.averageLabel}>Ortalama</Text>
          <Text style={styles.averageValue}>{calculateAverage()}</Text>
        </View>
      </View>

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={300}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            barPercentage: 0.6,
          }}
          style={styles.chart}
          showValuesOnTopOfBars={false}
          fromZero
        />
      </View>

      {/* Total consumption */}
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {isWater ? "Ümumi su sərfiyyatı" : "Ümumi elektrik sərfiyyatı"}
          </Text>
          <View
            style={[
              styles.percentageBadge,
              isWater ? styles.percentageUp : styles.percentageDown,
            ]}
          >
            <Text
              style={[
                styles.percentageText,
                isWater ? styles.percentageUpText : styles.percentageDownText,
              ]}
            >
              {isWater ? "8.78 %" : "2.69 %"}
            </Text>
          </View>
        </View>
        <Text style={styles.totalValue}>{calculateTotal()}</Text>
      </View>
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelect={handleDateSelect}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {/* Range Selector Modal */}
      <RangeSelectorModal
        visible={showRangeSelector}
        onClose={() => setShowRangeSelector(false)}
        onSelect={handleRangeSelect}
        selectedRange={selectDateRange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0E121B",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#F3F4F6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#0E121B",
    fontWeight: "600",
  },
  dateTextContainer: {
    paddingVertical: 11,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 12,
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },
  arrowContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
  },
  dateNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  calendarNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  dateRange: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 8,
  },

  rangeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E121B",
  },

  avarageContainer: {
    backgroundColor: "white",
    padding: 20,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  typeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  typeButtonActive: {
    borderColor: "#E5E7EB",
  },
  averageContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  averageLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  averageValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0E121B",
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chart: {},
  totalContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  percentageBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  percentageUp: {
    backgroundColor: "#D1FAE5",
  },
  percentageDown: {
    backgroundColor: "#FEE2E2",
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "600",
  },
  percentageUpText: {
    color: "#10B981",
  },
  percentageDownText: {
    color: "#EF4444",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0E121B",
  },
});
