import EditIcon from "@/assets/icons/home/zoneControl/pen-to-square-line.svg";
import BackIcon from "@/assets/icons/menu/profile/backIcon.svg";
import PauseIcon from "@/assets/icons/menu/sensors/pause-solid.svg";
import PlayIcon from "@/assets/icons/menu/sensors/play-solid.svg";
import CircularTimer from "@/components/home/zoneControl/CircularTimer/CircularTimer";
import { useLocalSearchParams, useRouter } from "expo-router";

import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import AddValveModal from "@/components/home/AddDevice/AddValveModal";
import IrrigationPlans from "@/components/home/zoneControl/IrrigationPlans/IrrigationsPlans";
import TimePickerModal from "@/components/home/zoneControl/TimePicker/TimePicker";
import {
  useAddMainValveCurrentPlanMutation,
  useDeleteMainValveCurrentPlanMutation,
  usePauseMainValveCurrentPlanMutation,
  usePauseMainValveHumidityBasedPlanMutation,
  usePauseMainValvePeriodicPlanMutation,
  usePauseMainValveWeeklyPlanMutation,
  useUpdateMainValveMutation,
} from "@/services/devices/deviceApi";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ZoneControlType = "current" | "plan";
type TimerState = "idle" | "running" | "paused";

const DAY_LABELS: Record<number, string> = {
  1: "B.e",
  2: "Ç.a",
  3: "Ç",
  4: "C.a",
  5: "C",
  6: "Ş",
  7: "B",
};

const getTodayIndex = () => {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
};

const isWeeklyPlanActiveNow = (plan: any): boolean => {
  if (!plan?.startTime || !plan?.days) return false;
  const ourDay = getTodayIndex();
  if (!plan.days.includes(ourDay)) return false;

  const parts = plan.startTime.split(":");
  if (parts.length < 2) return false;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (isNaN(h) || isNaN(m)) return false;

  const now = new Date();
  const planStart = new Date();
  planStart.setHours(h, m, 0, 0);
  const planEnd = new Date(planStart.getTime() + plan.duration * 1000);
  return now >= planStart && now <= planEnd;
};

const isPeriodicPlanActiveNow = (plan: any): boolean => {
  if (!plan?.startTime || !plan?.startDate) return false;

  const now = new Date();
  const start = new Date(plan.startDate);
  if (isNaN(start.getTime())) return false;

  const diffDays = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0 || plan.dayRange <= 0) return false;
  if (diffDays % plan.dayRange !== 0) return false;

  const parts = plan.startTime.split(":");
  if (parts.length < 2) return false;
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (isNaN(h) || isNaN(m)) return false;

  const planStart = new Date();
  planStart.setHours(h, m, 0, 0);
  const planEnd = new Date(planStart.getTime() + plan.duration * 1000);
  return now >= planStart && now <= planEnd;
};

const ZoneControl = () => {
  const router = useRouter();
  const { valve, deviceId, valvePortCount, usedValvePorts } =
    useLocalSearchParams<{
      valve: string;
      deviceId: string;
      valvePortCount: string;
      usedValvePorts: string;
    }>();
  const parsedValve = JSON.parse(valve as string);

  const parsedUsedValves = usedValvePorts ? JSON.parse(usedValvePorts) : [];

  const [addMainValveCurrentPlan] = useAddMainValveCurrentPlanMutation();
  const [deleteMainValveCurrentPlan] = useDeleteMainValveCurrentPlanMutation();
  const [pauseMainValveCurrentPlan] = usePauseMainValveCurrentPlanMutation();

  const [selectedControl, setSelectedControl] =
    useState<ZoneControlType>("current");

  const [showPicker, setShowPicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [updateValveModal, setUpdateValveModal] = useState(false);

  const [pauseMainValveWeeklyPlan] = usePauseMainValveWeeklyPlanMutation();
  const [pauseMainValvePeriodicPlan] = usePauseMainValvePeriodicPlanMutation();
  const [pauseMainValveHumidityBasedPlan] =
    usePauseMainValveHumidityBasedPlanMutation();

  //  valve

  const [updateMainValve] = useUpdateMainValveMutation();

  const [valveName, setValveName] = useState(parsedValve?.name || "");
  const [selectedValve, setSelectedValve] = useState("");

  const getActivePlan = () => {
    const allPlans = [
      ...(parsedValve.weeklyPlans ?? []).map((p: any) => ({
        ...p,
        planType: "weekly",
      })),
      ...(parsedValve.periodicPlans ?? []).map((p: any) => ({
        ...p,
        planType: "periodic",
      })),
      ...(parsedValve.humidityBasedPlans ?? []).map((p: any) => ({
        ...p,
        planType: "humidity",
      })),
    ];

    return (
      allPlans.find((plan) => {
        if (!plan.isActive) return false;
        if (plan.planType === "weekly")
          return isWeeklyPlanActiveNow(plan) || plan.isPaused;
        if (plan.planType === "periodic")
          return isPeriodicPlanActiveNow(plan) || plan.isPaused;
        if (plan.planType === "humidity") return true;
        return false;
      }) ?? null
    );
  };

  const activePlan = getActivePlan();

  useEffect(() => {
    if (timerState !== "idle") return;

    const currentPlan = parsedValve.currentPlan;

    console.log(currentPlan, "current plan");

    // ─── Current plan yoxlanması ───────────────────────────────────────────
    if (currentPlan && !activePlan) {
      if (currentPlan.isPaused) {
        console.log(currentPlan.isPaused, "is paused");
        const planStart = new Date(currentPlan.startDate);
        const pauseDate = new Date(currentPlan.pauseDate); // ✅ ISO parse
        const elapsedSinceStart = Math.floor(
          (pauseDate.getTime() - planStart.getTime()) / 1000,
        );
        const remainingSec = Math.max(
          0,
          currentPlan.duration -
            elapsedSinceStart +
            (Math.round(currentPlan.extraTime) ?? 0),
        );

        if (remainingSec > 0) {
          setTotalSeconds(currentPlan.duration);
          setRemaining(remainingSec);
          setTimerState("paused");
        }
        return;
      }

      if (currentPlan.startDate) {
        const planStart = new Date(currentPlan.startDate); // ✅ ISO parse
        const planEnd = new Date(
          planStart.getTime() + currentPlan.duration * 1000,
        );
        const remainingSec = Math.max(
          0,
          Math.round(
            (planEnd.getTime() + currentPlan.extraTime * 1000 - Date.now()) /
              1000,
          ),
        );

        if (remainingSec > 0) {
          setTotalSeconds(currentPlan.duration);
          setRemaining(remainingSec);
          setTimerState("running");
        }
      }
      return;
    }

    if (!activePlan) return;
    if (activePlan.planType === "humidity") return;
    if (!activePlan.startTime) return;

    if (activePlan.isPaused) {
      const parts = activePlan.startTime.split(":");
      const h = Number(parts[0]);
      const m = Number(parts[1]);
      const planStart = new Date();
      planStart.setHours(h, m, 0, 0);
      const elapsedSinceStart = Math.floor(
        (Date.now() - planStart.getTime()) / 1000,
      );
      const remainingSec = Math.max(
        0,
        activePlan.duration -
          elapsedSinceStart +
          (Math.round(activePlan.extraTime) ?? 0),
      );
      if (remainingSec > 0) {
        setTotalSeconds(activePlan.duration);
        setRemaining(remainingSec);
        setTimerState("paused");
      }
      return;
    }

    const parts = activePlan.startTime.split(":");
    if (parts.length < 2) return;
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    if (isNaN(h) || isNaN(m)) return;

    const planStart = new Date();
    planStart.setHours(h, m, 0, 0);
    const planEnd = new Date(planStart.getTime() + activePlan.duration * 1000);
    const remainingSec = Math.max(
      0,
      Math.round((planEnd.getTime() - Date.now()) / 1000),
    );

    if (remainingSec > 0) {
      setTotalSeconds(activePlan.duration);
      setRemaining(remainingSec);
      setTimerState("running");
    }
  }, []);

  // // ─── Timer interval ────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerState("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleStart = async (seconds: number) => {
    try {
      await addMainValveCurrentPlan({
        mainDeviceId: deviceId,
        valveId: parsedValve.valveId,
        body: { duration: seconds, isPaused: false },
      }).unwrap();
      setTotalSeconds(seconds);
      setRemaining(seconds);
      setTimerState("running");
      setShowPicker(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePause = async () => {
    try {
      if (activePlan?.planType === "weekly") {
        await pauseMainValveWeeklyPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          weeklyPlanId: activePlan.planId,
          body: { isPaused: true },
        }).unwrap();
      } else if (activePlan?.planType === "periodic") {
        await pauseMainValvePeriodicPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          periodicPlanId: activePlan.planId,
          body: { isPaused: true },
        }).unwrap();
      } else if (activePlan?.planType === "humidity") {
        await pauseMainValveHumidityBasedPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          humidityBasedPlanId: activePlan.planId,
          body: { isPaused: true },
        }).unwrap();
      } else {
        const data = await pauseMainValveCurrentPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          body: { isPaused: true },
        }).unwrap();
        console.log(data.valves[0].currentPlan.isPaused, "pause current data");
      }
      setTimerState("paused");
    } catch (error) {
      console.log("Pause error:", error);
    }
  };

  const handleResume = async () => {
    try {
      if (activePlan?.planType === "weekly") {
        await pauseMainValveWeeklyPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          weeklyPlanId: activePlan.planId,
          body: { isPaused: false },
        }).unwrap();
      } else if (activePlan?.planType === "periodic") {
        await pauseMainValvePeriodicPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          periodicPlanId: activePlan.planId,
          body: { isPaused: false },
        }).unwrap();
      } else if (activePlan?.planType === "humidity") {
        await pauseMainValveHumidityBasedPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          humidityBasedPlanId: activePlan.planId,
          body: { isPaused: false },
        }).unwrap();
      } else {
        const data = await pauseMainValveCurrentPlan({
          mainDeviceId: deviceId,
          valveId: parsedValve.valveId,
          body: { isPaused: false },
        }).unwrap();
        console.log(data.valves[0].currentPlan.isPaused, "resume current data");
      }
      setTimerState("running");
    } catch (error) {
      console.log("Resume error:", error);
    }
  };

  const handleStop = async () => {
    try {
      await deleteMainValveCurrentPlan({
        mainDeviceId: deviceId,
        valveId: parsedValve.valveId,
      }).unwrap();
      setTimerState("idle");
      setRemaining(0);
      setTotalSeconds(0);
    } catch (error) {
      console.log(error);
    }
  };

  //  VALVE

  const updateValve = async () => {
    if (!valveName || !selectedValve) return;

    try {
      await updateMainValve({
        mainDeviceId: deviceId,
        valveId: parsedValve.valveId,
        body: {
          name: valveName,
          valveId: Number(selectedValve.replace("valve ", "")),
        },
      }).unwrap();

      setValveName("");
      setSelectedValve("");
      setUpdateValveModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenUpdateModal = () => {
    setValveName(parsedValve.name);
    setSelectedValve(`valve ${parsedValve.valveId}`); // ✅ mövcud port seçili
    setUpdateValveModal(true);
  };

  // ─── Plan info render ──────────────────────────────────────────────────────
  const renderActivePlanInfo = () => {
    if (!activePlan) return null;
    const todayIndex = getTodayIndex();
    const durationMin = Math.round(activePlan.duration / 60);

    return (
      <View style={styles.planInfoContainer}>
        {activePlan.startTime ? (
          <Text style={styles.planInfoTime}>{activePlan.startTime}</Text>
        ) : null}

        <View style={styles.planInfoRow}>
          <Text style={styles.planInfoText}>{durationMin} dəq</Text>

          {activePlan.planType === "weekly" && activePlan.days?.length > 0 && (
            <>
              <Text style={styles.planInfoDot}>|</Text>
              <View style={styles.daysRow}>
                {activePlan.days.map((d: number, index: number) => (
                  <React.Fragment key={d}>
                    <Text
                      style={[
                        styles.planInfoText,
                        d === todayIndex && styles.planInfoDayActive,
                      ]}
                    >
                      {DAY_LABELS[d]}
                    </Text>
                    {index < activePlan.days.length - 1 && (
                      <Text style={styles.planInfoText}>,</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
            </>
          )}

          {activePlan.planType === "periodic" && (
            <>
              <Text style={styles.planInfoDot}>|</Text>
              <Text style={styles.planInfoText}>
                {activePlan.dayRange} gündən bir
              </Text>
            </>
          )}

          {activePlan.planType === "humidity" && (
            <>
              <Text style={styles.planInfoDot}>|</Text>
              <Text style={styles.planInfoText}>
                {activePlan.humidity}% rütubət
              </Text>
            </>
          )}
        </View>

        {/* <View style={styles.waterBadge}>
          <Text style={styles.waterBadgeText}>💧 Su axını var</Text>
        </View> */}
      </View>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.homePage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/(tabs)")}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerText}>{parsedValve.name}</Text>
          <TouchableOpacity
            style={styles.editIconContainer}
            onPress={handleOpenUpdateModal}
          >
            <EditIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.controlContainer}>
          <TouchableOpacity
            style={[
              styles.controlCard,
              selectedControl === "current" && styles.activeZone,
            ]}
            onPress={() => setSelectedControl("current")}
          >
            <Text
              style={[
                styles.controlText,
                selectedControl === "current" && styles.activeZoneText,
              ]}
            >
              Cari suvarma
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlCard,
              selectedControl === "plan" && styles.activeZone,
            ]}
            onPress={() => setSelectedControl("plan")}
          >
            <Text
              style={[
                styles.controlText,
                selectedControl === "plan" && styles.activeZoneText,
              ]}
            >
              Suvarma planları
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Plan tab */}
      {selectedControl === "plan" && (
        <IrrigationPlans
          mainDeviceId={deviceId as string}
          valveId={parsedValve.valveId}
        />
      )}

      {/* ✅ Cari suvarma tab - yalnız bir dəfə render */}
      {selectedControl === "current" && (
        <>
          <View style={styles.timerContainer}>
            <TouchableOpacity
              onPress={() => timerState === "idle" && setShowPicker(true)}
              activeOpacity={timerState === "idle" ? 0.7 : 1}
            >
              <CircularTimer
                remaining={remaining}
                total={totalSeconds}
                isPaused={timerState === "paused"}
              />
            </TouchableOpacity>

            {timerState === "running" && renderActivePlanInfo()}
          </View>

          <View style={styles.bottomBtn}>
            {timerState === "idle" && (
              <CustomAddButton
                text="Suvarmanı başlat"
                icon={<PlayIcon />}
                onClick={() => setShowPicker(true)}
                size="l"
              />
            )}
            {timerState === "running" && (
              <View style={styles.actionRow}>
                <CustomAddButton
                  onClick={() => setShowDeleteModal(true)}
                  text="Suvarmanı bitir"
                  type="secondary"
                  size="m"
                />
                <CustomAddButton
                  onClick={handlePause}
                  text="Dayandır"
                  type="delete"
                  size="m"
                  icon={<PauseIcon />}
                />
              </View>
            )}
            {timerState === "paused" && (
              <View style={styles.actionRow}>
                <CustomAddButton
                  onClick={() => setShowDeleteModal(true)}
                  text="Suvarmanı bitir"
                  type="secondary"
                  size="m"
                />
                <CustomAddButton
                  onClick={handleResume}
                  text="Davam et"
                  size="m"
                  icon={<PlayIcon />}
                />
              </View>
            )}
          </View>
        </>
      )}

      <TimePickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onStart={handleStart}
        mode="duration"
      />
      <CommonConfirmModal
        text="Suvarmanı bitirmək istədiyinizdən əminsiniz?"
        desc="Bu zonada suvarma vaxtından əvvəl dayandırılacaq."
        visible={showDeleteModal}
        onFinish={handleStop}
        type="zone"
        onClose={() => setShowDeleteModal(false)}
      />
      <AddValveModal
        visible={updateValveModal}
        onClose={() => setUpdateValveModal(false)}
        isEdit={true}
        onAdd={updateValve}
        valveName={valveName}
        setValveName={setValveName}
        selectedValve={selectedValve}
        setSelectedValve={setSelectedValve}
        valvePortCount={Number(valvePortCount)}
        usedValves={parsedUsedValves}
        type="zone"
      />
    </View>
  );
};

export default ZoneControl;

const styles = StyleSheet.create({
  homePage: { flex: 1, backgroundColor: "#F5F7FA" },
  container: { paddingTop: 32, paddingHorizontal: 16, paddingBottom: 24 },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: { color: "#0E121B", fontSize: 16, fontWeight: "600" },
  editIconContainer: {},
  controlContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 5,
    flexDirection: "row",
    marginTop: 10,
  },
  controlCard: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
  },
  activeZone: { backgroundColor: "#EEF2F6", borderRadius: 12 },
  controlText: { color: "#717784", fontSize: 14, fontWeight: "500" },
  activeZoneText: { color: "#0E121B" },
  timerContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  bottomBtn: {
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  actionRow: { flexDirection: "row", gap: 12 },
  // Plan info
  planInfoContainer: { alignItems: "center", marginTop: 16, gap: 4 },
  planInfoTime: { fontSize: 28, fontWeight: "700", color: "#0E121B" },
  planInfoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  planInfoText: { fontSize: 14, color: "#717784", fontWeight: 400 },
  planInfoDot: { fontSize: 12, color: "#B0B5BF" },
  planInfoDayActive: { color: "#0069FE", fontWeight: "500" },
  daysRow: { flexDirection: "row", gap: 4 },
  waterBadge: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  waterBadgeText: { fontSize: 14, color: "#0E121B", fontWeight: "500" },
});
