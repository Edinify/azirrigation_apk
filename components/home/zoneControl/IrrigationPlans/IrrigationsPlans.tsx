import TrashIcon from "@/assets/icons/home/add-device/trash.svg";
import ClockIcon from "@/assets/icons/home/zoneControl/plan/clock-line.svg";
import PlusIcon from "@/assets/icons/home/zoneControl/plan/plus-line.svg";
import CommonConfirmModal from "@/components/commonComponents/CommonConfirmModal/CommonConfirmModal";
import CustomAddButton from "@/components/customComponents/CustomButton/CustomAddButton";
import {
  useActivateMainValveHumidityBasedPlanMutation,
  useActivateMainValvePeriodicPlanMutation,
  useActivateMainValveWeeklyPlanMutation,
  useAddMainValveHumidityBasedPlanMutation,
  useAddMainValvePeriodicPlanMutation,
  useAddMainValveWeeklyPlanMutation,
  useDeleteMainValveHumidityBasedPlanMutation,
  useDeleteMainValvePeriodicPlanMutation,
  useDeleteMainValveWeeklyPlanMutation,
  useGetMainByIdQuery,
  useUpdateMainValveHumidityBasedPlanMutation,
  useUpdateMainValvePeriodicPlanMutation,
  useUpdateMainValveWeeklyPlanMutation,
} from "@/services/devices/deviceApi";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import SwitchToggle from "react-native-switch-toggle";
import HumidityPlanModal from "../Plans/HumidityPlanModal";
import PeriodicPlanModal from "../Plans/PeriodicPlanModal";
import WeeklyPlanModal from "../Plans/WeeklyPlanModal";
import SelectPlan from "../SelectPlan/SelectPlan";

interface IrrigationPlansProps {
  mainDeviceId: string;
  valveId: string;
}

const IrrigationPlans = ({ mainDeviceId, valveId }: IrrigationPlansProps) => {
  const { data } = useGetMainByIdQuery(mainDeviceId, {
    skip: !mainDeviceId,
  });

  const valve = data?.valves?.find(
    (v) => String(v.valveId) === String(valveId),
  );
  // WEEKLY PLAN
  const [addMainValveWeeklyPlan] = useAddMainValveWeeklyPlanMutation();
  const [deleteMainValveWeeklyPlan] = useDeleteMainValveWeeklyPlanMutation();
  const [updateMainValveWeeklyPlan] = useUpdateMainValveWeeklyPlanMutation();
  const [activateMainValveWeeklyPlan] =
    useActivateMainValveWeeklyPlanMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [selectedDeleteType, setSelectedDeleteType] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  // PERIODIC PLAN
  const [addMainValvePeriodicPlan] = useAddMainValvePeriodicPlanMutation();
  const [updateMainValvePeriodicPlan] =
    useUpdateMainValvePeriodicPlanMutation();
  const [deleteMainValvePeriodicPlan] =
    useDeleteMainValvePeriodicPlanMutation();
  const [activateMainValvePeriodicPlan] =
    useActivateMainValvePeriodicPlanMutation();

  const [showPeriodicModal, setShowPeriodicModal] = useState(false);
  const [editingPeriodicPlan, setEditingPeriodicPlan] = useState<any>(null);

  // HUMIDITY PLAN

  const [addMainValveHumidityBasedPlan] =
    useAddMainValveHumidityBasedPlanMutation();
  const [deleteMainValveHumidityBasedPlan] =
    useDeleteMainValveHumidityBasedPlanMutation();
  const [updateMainValveHumidityBasedPlan] =
    useUpdateMainValveHumidityBasedPlanMutation();

  const [activateMainValveHumidityBasedPlan] =
    useActivateMainValveHumidityBasedPlanMutation();

  const [showHumidityPlanModal, setShowHumidityPlanModal] = useState(false);
  const [editingHumidityPlan, setEditingHumidityPlan] = useState<any>(null);

  const weeklyPlans = valve?.weeklyPlans ?? [];
  const periodicPlans = valve?.periodicPlans ?? [];
  const humidityBasedPlans = valve?.humidityBasedPlans ?? [];

  const hasAnyPlan =
    weeklyPlans.length > 0 ||
    periodicPlans.length > 0 ||
    humidityBasedPlans.length > 0;

  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});

  const [editingPlan, setEditingPlan] = useState<any>(null);

  const handlePlanPress = (plan: any) => {
    setEditingPlan(plan);
    setShowWeeklyModal(true);
  };

  const handleWeeklyUpdate = async (data: {
    days: number[];
    startTime: string;
    duration: number;
  }) => {
    if (!editingPlan) return;

    try {
      await updateMainValveWeeklyPlan({
        mainDeviceId,
        valveId,
        weeklyPlanId: editingPlan.planId,
        body: {
          days: data.days,
          startTime: data.startTime,
          duration: data.duration,
        },
      }).unwrap();
      setShowWeeklyModal(false);
      setEditingPlan(null);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ modal-dan delete
  const handleWeeklyDeleteFromModal = async () => {
    if (!editingPlan) return;
    try {
      await deleteMainValveWeeklyPlan({
        mainDeviceId,
        valveId,
        weeklyPlanId: editingPlan.planId,
      }).unwrap();
      setShowWeeklyModal(false);
      setEditingPlan(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = async (
    plan: any,
    type: string,
    currentValue: boolean,
  ) => {
    const newValue = !currentValue;
    const key = plan.planId;

    console.log(type, "type");

    setSwitchStates((prev) => ({ ...prev, [key]: newValue }));

    try {
      if (type === "weekly") {
        await activateMainValveWeeklyPlan({
          mainDeviceId,
          valveId,
          weeklyPlanId: plan.planId,
          body: {
            isActive: newValue,
          },
        }).unwrap();
        setSwitchStates((prev) => ({ ...prev, [key]: newValue }));
      } else if (type === "periodic") {
        await activateMainValvePeriodicPlan({
          mainDeviceId,
          valveId,
          periodicPlanId: plan.planId,
          body: {
            isActive: newValue,
          },
        }).unwrap();
        setSwitchStates((prev) => ({ ...prev, [key]: newValue }));
      } else if (type === "humidity") {
        await activateMainValveHumidityBasedPlan({
          mainDeviceId,
          valveId,
          humidityBasedPlanId: plan.planId,
          body: {
            isActive: newValue,
          },
        }).unwrap();
        setSwitchStates((prev) => ({ ...prev, [key]: newValue }));
      }
    } catch (error) {
      setSwitchStates((prev) => ({ ...prev, [key]: currentValue }));
      console.log(error);
    }
  };

  const getSwitchState = (id: string, isActive: boolean) => {
    return switchStates[id] !== undefined ? switchStates[id] : isActive;
  };

  const handleDeletePress = (id: string, type: string) => {
    setSelectedDeleteId(id);
    setSelectedDeleteType(type);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;

    try {
      if (selectedDeleteType === "weekly") {
        await deleteMainValveWeeklyPlan({
          mainDeviceId,
          valveId,
          weeklyPlanId: selectedDeleteId,
        }).unwrap();
      } else if (selectedDeleteType === "periodic") {
        await deleteMainValvePeriodicPlan({
          mainDeviceId,
          valveId,
          periodicPlanId: selectedDeleteId,
        }).unwrap();
      } else if (selectedDeleteType === "humidity") {
        await deleteMainValveHumidityBasedPlan({
          mainDeviceId,
          valveId,
          humidityBasedPlanId: selectedDeleteId,
        }).unwrap();
      }
      setShowDeleteModal(false);
      setSelectedDeleteId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWeeklySave = async (data: {
    days: number[];
    startTime: string;
    duration: number;
  }) => {
    try {
      await addMainValveWeeklyPlan({
        mainDeviceId,
        valveId,
        body: {
          days: data.days,
          startTime: data.startTime,
          duration: data.duration,
        },
      }).unwrap();
      setShowWeeklyModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePeriodicSave = async (data: any) => {
    try {
      await addMainValvePeriodicPlan({
        mainDeviceId,
        valveId,
        body: {
          dayRange: data.dayRange,
          startDate: data.startDate,
          startTime: data.startTime,
          duration: data.duration,
        },
      }).unwrap();
      setShowPeriodicModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePeriodicUpdate = async (data: any) => {
    if (!editingPeriodicPlan) return;

    try {
      await updateMainValvePeriodicPlan({
        mainDeviceId,
        valveId,
        periodicPlanId: editingPeriodicPlan.planId,
        body: {
          dayRange: data.dayRange,
          startDate: data.startDate,
          startTime: data.startTime,
          duration: data.duration,
        },
      }).unwrap();
      setShowPeriodicModal(false);
      setEditingPeriodicPlan(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePeriodicDeleteFromModal = async () => {
    if (!editingPeriodicPlan) return;
    try {
      await deleteMainValvePeriodicPlan({
        mainDeviceId,
        valveId,
        periodicPlanId: editingPeriodicPlan.planId,
      }).unwrap();

      setShowPeriodicModal(false);
      setEditingPeriodicPlan(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHumiditySave = async (data: any) => {
    try {
      await addMainValveHumidityBasedPlan({
        mainDeviceId,
        valveId,
        body: {
          duration: data.duration,
          humidity: data.humidity,
        },
      }).unwrap();
      setShowHumidityPlanModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHumidityUpdate = async (data: any) => {
    if (!editingHumidityPlan) return;
    try {
      await updateMainValveHumidityBasedPlan({
        mainDeviceId,
        valveId,
        humidityBasedPlanId: editingHumidityPlan.planId,
        body: {
          duration: data.duration,
          humidity: data.humidity,
        },
      }).unwrap();
      setShowHumidityPlanModal(false);
      setEditingHumidityPlan(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleHumidityDeleteFromModal = async () => {
    if (!editingHumidityPlan) return;

    try {
      await deleteMainValveHumidityBasedPlan({
        mainDeviceId,
        valveId,
        humidityBasedPlanId: editingHumidityPlan._id,
      }).unwrap();

      setShowHumidityPlanModal(false);
      setEditingHumidityPlan(null);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} s ${m} dəq`;
    return `${m} dəq`;
  };

  const formatDays = (days: number[]) => {
    const DAY_LABELS: Record<number, string> = {
      1: "B.e",
      2: "Ç.a",
      3: "Ç",
      4: "C.a",
      5: "C",
      6: "Ş",
      7: "B",
    };
    return days.map((d) => DAY_LABELS[d]).join(", ");
  };

  useEffect(() => {
    setSwitchStates({});
  }, []);

  const renderPlanCard = (plan: any, type: string) => (
    <Swipeable
      key={plan._id}
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => handleDeletePress(plan.planId, type)}
        >
          <TrashIcon />
        </TouchableOpacity>
      )}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity
        style={styles.planCard}
        onPress={() => {
          if (type === "weekly") handlePlanPress(plan);
          else if (type === "periodic") {
            setEditingPeriodicPlan(plan);
            setShowPeriodicModal(true);
          } else if (type === "humidity") {
            setEditingHumidityPlan(plan);
            setShowHumidityPlanModal(true);
          }
        }}
      >
        <View style={styles.planContent}>
          <Text style={styles.planTime}>
            {type === "humidity" ? `${plan.humidity} %` : plan.startTime}
          </Text>
          <View style={styles.planMeta}>
            <ClockIcon />
            <Text style={styles.planMetaText}>
              {formatDuration(plan.duration)}
            </Text>
            {plan.days?.length > 0 && (
              <>
                <Text style={styles.planMetaDot}>|</Text>
                <Text style={styles.planMetaText}>{formatDays(plan.days)}</Text>
              </>
            )}
            {plan.dayRange && (
              <>
                <Text style={styles.planMetaDot}>|</Text>
                <Text style={styles.planMetaText}>
                  {plan.dayRange} gündən bir
                </Text>
              </>
            )}
          </View>
        </View>
        <SwitchToggle
          switchOn={getSwitchState(plan.planId, plan.isActive)}
          onPress={() => {
            handleToggle(
              plan,
              type,
              getSwitchState(plan.planId, plan.isActive),
            );
            console.log(plan, "plan");
          }}
          circleColorOn="white"
          circleColorOff="white"
          backgroundColorOn="#00AB1C"
          backgroundColorOff="#E5E7EB"
          containerStyle={{
            width: 60,
            height: 32,
            borderRadius: 25,
            padding: 2,
          }}
          circleStyle={{ width: 28, height: 28, borderRadius: 20 }}
        />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {!hasAnyPlan ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Plan yoxdur</Text>
          </View>
        ) : (
          <>
            {weeklyPlans.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Həftəlik planlar</Text>
                {weeklyPlans.map((plan) => renderPlanCard(plan, "weekly"))}
              </View>
            )}

            {periodicPlans.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Periodik planlar</Text>
                {periodicPlans.map((plan) => renderPlanCard(plan, "periodic"))}
              </View>
            )}

            {humidityBasedPlans.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rütubət</Text>
                {humidityBasedPlans.map((plan) =>
                  renderPlanCard(plan, "humidity"),
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={{ marginBottom: 40 }}>
        <CustomAddButton
          icon={<PlusIcon />}
          text="Plan yarat"
          size="m"
          onClick={() => setShowCreateModal(true)}
        />
      </View>

      <CommonConfirmModal
        text="Planı silmək istədiyinizdən əminsiniz?"
        desc="Plan silindikdən sonra bu cədvələ əsasən suvarma aparılmayacaq."
        type="plan"
        onFinish={handleDeleteConfirm}
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

      <SelectPlan
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSelectPlan={(type) => {
          setShowCreateModal(false);
          if (type === "weekly") setShowWeeklyModal(true);
          else if (type === "periodic") setShowPeriodicModal(true);
          else if (type === "humidity") setShowHumidityPlanModal(true);
        }}
      />

      <WeeklyPlanModal
        visible={showWeeklyModal}
        onClose={() => {
          setShowWeeklyModal(false);
          setEditingPlan(null);
        }}
        onSave={editingPlan ? handleWeeklyUpdate : handleWeeklySave} // ✅
        onDelete={handleWeeklyDeleteFromModal} // ✅
        editData={editingPlan}
      />

      <PeriodicPlanModal
        visible={showPeriodicModal}
        onClose={() => {
          setShowPeriodicModal(false);
          setEditingPeriodicPlan(null);
        }}
        onSave={editingPeriodicPlan ? handlePeriodicUpdate : handlePeriodicSave}
        onDelete={handlePeriodicDeleteFromModal}
        editData={editingPeriodicPlan}
      />

      <HumidityPlanModal
        visible={showHumidityPlanModal}
        onClose={() => {
          setShowHumidityPlanModal(false);
          setEditingHumidityPlan(null);
        }}
        onSave={editingHumidityPlan ? handleHumidityUpdate : handleHumiditySave}
        onDelete={handleHumidityDeleteFromModal}
        editData={editingHumidityPlan}
      />
    </View>
  );
};

export default IrrigationPlans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 14,
    color: "#717784",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E121B",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  planCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  planContent: {
    flex: 1,
  },
  planTime: {
    fontSize: 24,
    fontWeight: "600",
    color: "#0E121B",
  },
  planMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  planMetaText: {
    fontSize: 14,
    color: "#717784",
    marginLeft: 4,
    fontWeight: 400,
  },
  planMetaDot: {
    fontSize: 12,
    color: "#B0B5BF",
  },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 8,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0069FE",
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  createBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
