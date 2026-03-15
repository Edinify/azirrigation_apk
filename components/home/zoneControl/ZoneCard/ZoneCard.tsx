import PowerIcon from "@/assets/icons/home/devices/power-off-line.svg";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// HomeScreen-də, component-dən kənarda
export const ZoneCard = ({
  valve,
  onPress,
}: {
  valve: any;
  onPress: () => void;
}) => {
  const [remaining, setRemaining] = useState<number>(0);
  const [status, setStatus] = useState<"running" | "upcoming" | "off">("off");
  const [nextTime, setNextTime] = useState<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // HomeScreen-də, component-dən kənarda

  const getValveStatus = (
    valve: any,
  ): {
    status: "running" | "upcoming" | "off";
    remaining?: number; // running üçün — saniyə
    nextTime?: string; // upcoming üçün — "Bu gün 18:30" və ya "24 dek 12:00"
  } => {
    const now = new Date();

    // ─── 1. currentPlan yoxla ───────────────────────────────
    const cp = valve.currentPlan;
    if (cp && !cp.isPaused && cp.startDate) {
      const planStart = new Date(cp.startDate);
      const planEnd = new Date(
        planStart.getTime() + cp.duration * 1000 + (cp.extraTime ?? 0) * 1000,
      );
      const remainingSec = Math.round(
        (planEnd.getTime() - now.getTime()) / 1000,
      );
      if (remainingSec > 0) {
        return { status: "running", remaining: remainingSec };
      }
    }

    // ─── 2. weeklyPlans yoxla ──────────────────────────────
    for (const plan of valve.weeklyPlans ?? []) {
      if (!plan.isActive || !plan.startTime || !plan.days) continue;
      const [h, m] = plan.startTime.split(":").map(Number);
      const todayDay = new Date().getDay() === 0 ? 7 : new Date().getDay();

      // İndi işləyirmi?
      if (plan.days.includes(todayDay)) {
        const planStart = new Date();
        planStart.setHours(h, m, 0, 0);
        const planEnd = new Date(planStart.getTime() + plan.duration * 1000);
        if (now >= planStart && now <= planEnd) {
          const remainingSec = Math.round(
            (planEnd.getTime() - now.getTime()) / 1000,
          );
          return { status: "running", remaining: remainingSec };
        }
      }

      // Növbəti vaxtı tap
      const upcomingDay = plan.days
        .map((d: number) => {
          let diff = d - todayDay;
          if (diff < 0) diff += 7;
          return { day: d, diff };
        })
        .sort((a: any, b: any) => a.diff - b.diff)[0];

      if (upcomingDay) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + upcomingDay.diff);
        nextDate.setHours(h, m, 0, 0);
        return { status: "upcoming", nextTime: formatNextTime(nextDate) };
      }
    }

    // ─── 3. periodicPlans yoxla ────────────────────────────
    for (const plan of valve.periodicPlans ?? []) {
      if (!plan.isActive || !plan.startTime || !plan.startDate) continue;
      const [h, m] = plan.startTime.split(":").map(Number);
      const start = new Date(plan.startDate);
      const diffDays = Math.floor((now.getTime() - start.getTime()) / 86400000);

      if (
        diffDays >= 0 &&
        plan.dayRange > 0 &&
        diffDays % plan.dayRange === 0
      ) {
        const planStart = new Date();
        planStart.setHours(h, m, 0, 0);
        const planEnd = new Date(planStart.getTime() + plan.duration * 1000);
        if (now >= planStart && now <= planEnd) {
          const remainingSec = Math.round(
            (planEnd.getTime() - now.getTime()) / 1000,
          );
          return { status: "running", remaining: remainingSec };
        }
      }

      // Növbəti dövrü tap
      const daysUntilNext = plan.dayRange - (diffDays % plan.dayRange);
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysUntilNext);
      nextDate.setHours(h, m, 0, 0);
      return { status: "upcoming", nextTime: formatNextTime(nextDate) };
    }

    return { status: "off" };
  };

  const MONTHS_AZ = [
    "yan",
    "fev",
    "mart",
    "apr",
    "may",
    "iyn",
    "iyl",
    "avg",
    "sen",
    "okt",
    "noy",
    "dek",
  ];

  const formatNextTime = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const diffDays = Math.round(
      (target.getTime() - today.getTime()) / 86400000,
    );
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");

    if (diffDays === 0) return `Bu gün ${h}:${m}`;
    if (diffDays === 1) return `Sabah ${h}:${m}`;
    return `${date.getDate()} ${MONTHS_AZ[date.getMonth()]} ${h}:${m}`;
  };

  const formatRemaining = (sec: number): string => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  useEffect(() => {
    const update = () => {
      const result = getValveStatus(valve);
      setStatus(result.status);
      if (result.status === "running" && result.remaining !== undefined) {
        setRemaining(result.remaining);
      }
      if (result.status === "upcoming" && result.nextTime) {
        setNextTime(result.nextTime);
      }
    };

    update();

    // ✅ Hər saniyə yenilə
    intervalRef.current = setInterval(update, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [valve]);

  const isRunning = status === "running";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.zoneCard, isRunning && styles.zoneCardActive]}
    >
      <View style={styles.zoneCardHeader}>
        <Text style={styles.zoneText}>{valve.name}</Text>
        {isRunning && (
          <View style={styles.zoneCardIcons}>
            {/* Power icon */}
            <View style={styles.powerIcon}>
              <PowerIcon />
              {/* <Text style={{ color: "#22C55E", fontSize: 14 }}>⏻</Text> */}
            </View>
          </View>
        )}
      </View>

      {status === "running" && (
        <Text style={styles.zoneRunningText}>{formatRemaining(remaining)}</Text>
      )}
      {status === "upcoming" && (
        <Text style={styles.zoneUpcomingText}>{nextTime}</Text>
      )}
      {status === "off" && <Text style={styles.zoneOffText}>OFF</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  zoneCardActive: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "rgba(0, 171, 28, 0.00)",
  },
  zoneCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  zoneCardIcons: {
    alignItems: "flex-end",
    gap: 4,
  },

  zoneRunningText: {
    color: "#00AB1C",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 6,
  },
  zoneUpcomingText: {
    color: "#717784",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 6,
  },
  zoneOffText: {
    color: "#A0A8B0",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 6,
  },

  zoneCard: {
    width: "48%",
    backgroundColor: "#F5F7FA",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  zoneText: {
    color: "#0E121B",
    fontSize: 14,
    fontWeight: 500,
  },
});
