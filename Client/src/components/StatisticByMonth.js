import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import getRole from "../services/RoleService";
import { statisticalTimeFocus } from "../services/Guest/StatiscalService";
import { format } from "date-fns";
import { CircularProgress } from "react-native-circular-progress";
import HourPicker from "./HourPicker";

const StatisticByMonth = () => {
  const [data, setData] = useState({});
  const [goal, setGoal] = useState(2); // in hours
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const daysToCompleteGoal = useMemo(() => {
    if (!data?.listDate) return 0;
    return data.listDate.filter((d) => d.totalValue >= goal * 60).length;
  }, [data, goal]);

  const goalCompletionRate = useMemo(() => {
    if (!data?.listDate) return 0;
    return daysToCompleteGoal / data.listDate.length;
  }, [data.listDate, daysToCompleteGoal]);
  const fetchData = async (startDate, endDate) => {
    let id = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      id = role.id;
    }
    const response = await statisticalTimeFocus(
      startDate.getTime(),
      endDate.getTime(),
      id,
      "DAY"
    );
    if (response.success) {
      setData(response.data);
    } else {
      Alert.alert("Error:", response.message);
    }
  };

  useEffect(() => {
    const startDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    const endDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    );
    fetchData(startDate, endDate);
  }, [selectedMonth]);

  const renderDay = (day) => {
    const date = new Date(day.dateString);
    const entry = data?.listDate?.find(
      (d) => new Date(d.date).toDateString() === date.toDateString()
    );
    const progress = entry ? (entry.totalValue / 60 / goal) * 100 : 0;
    return (
      <View style={styles.dayContainer}>
        <CircularProgress
          size={30}
          width={4}
          fill={progress}
          tintColor="red"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          rotation={0}
          lineCap="round"
        >
          {() => <Text style={styles.dayText}>{day.day}</Text>}
        </CircularProgress>
      </View>
    );
  };

  const handleHourPicker = async () => {
    const role = await getRole();
    if (role && role.role === "PREMIUM") {
      setPickerVisible(true);
    } else {
      Alert.alert("Only premium users can use this feature");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={{ color: "#333" }}>Goal Time Focus:</Text>
          <Text style={styles.text}>
            Focus day count: {data?.totalDataHaveValue || 0}, days count to
            complete the goal: {daysToCompleteGoal}, Ranked goal completion:{" "}
            {Math.round(goalCompletionRate * 100)}%
          </Text>
        </View>
        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => handleHourPicker()}
        >
          <Text style={{ color: "red" }}>Goal: {goal}H</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        current={selectedMonth}
        markingType={"custom"}
        dayComponent={({ date, state }) => renderDay(date)}
        hideExtraDays={true}
        onMonthChange={(month) => {
          setSelectedMonth(new Date(month.year, month.month - 1, 1));
        }}
      />
      {pickerVisible && (
        <HourPicker
          initTime={goal}
          visible={pickerVisible}
          onClose={() => setPickerVisible(false)}
          onSelect={(value) => setGoal(value)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  headerContainer: {
    padding: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  text: {
    fontSize: 12,
    color: "gray",
    width: 200,
  },
  typeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 150,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calendarContainer: {
    justifyContent: "center",
  },
  dayContainer: {},
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  progressBar: {
    position: "absolute",
    width: "100%",
    backgroundColor: "rgba(0, 255, 0, 0.5)",
    zIndex: -1,
  },
});

export default StatisticByMonth;
