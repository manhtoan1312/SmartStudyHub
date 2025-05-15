import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import getRole from "../services/RoleService";
import { statisticalWorksByUnit } from "../services/Guest/StatiscalService";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns";
import { PieChart } from "react-native-gifted-charts";

const StatisticalWorkByProject = () => {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [typeDay, setTypeDay] = useState("Every Month");

  const setEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 0, 0);
    return newDate;
  };

  const [startDate, setStartDate] = useState(firstDayOfMonth.getTime());
  const [endDate, setEndDate] = useState(setEndOfDay(lastDayOfMonth).getTime());

  useEffect(() => {
    const fetchData = async () => {
      try {
        let id = await AsyncStorage.getItem("id");
        const role = await getRole();
        if (role) {
          id = role.id;
        }
        const response = await statisticalWorksByUnit(
          startDate,
          endDate,
          id,
          "PROJECT"
        );
        if (response.success) {
          setData(response.data);
        } else {
          console.log("Error fetch data in app:", response.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (data && data.listDataStatisticalByUnit) {
      const listData = data.listDataStatisticalByUnit.map((item) => ({
        value: item.totalTimeFocusInUnit,
        color:
          item?.unitId === 0
            ? "#006DFF"
            : item.unitColor == "None"
            ? "#e27602"
            : item.unitColor,
        name: item.unitName,
      }));
      setChartData(listData);
    }
  }, [data]);

  const renderDot = (color) => (
    <View style={[styles.dot, { backgroundColor: color }]} />
  );

  const renderLegendComponent = () => (
    <View
      style={{
        paddingTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {chartData.map((item, index) => (
        <View key={index} style={styles.legendRow}>
          {renderDot(item.color)}
          <View>
            <Text style={styles.legendText}>{item.name}:</Text>
            <Text style={{ color: "#aaa" }}>
              {renderTime(item.value)}-
              {Math.floor((item.value / data.totalValue) * 100)}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const handleDayTypeChange = (text) => {
    setTypeDay(text);
    const now = new Date(); 
    if (text === "Every Day") {
      setStartDate(now.getTime());
      setEndDate(setEndOfDay(now).getTime());
    } else if (text === "Every Week") {
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const lastDayOfWeek = new Date(now.setDate(firstDayOfWeek.getDate() + 6));
      setStartDate(new Date(firstDayOfWeek.getTime()).getTime());
      setEndDate(setEndOfDay(new Date(lastDayOfWeek.getTime())).getTime());
    } else if (text === "Every Month") {
      setStartDate(firstDayOfMonth.getTime());
      setEndDate(setEndOfDay(lastDayOfMonth).getTime());
    }
  };

  const handlePrev = () => {
    if (typeDay === "Every Day") {
      const newStartDate = subDays(startDate, 1).getTime();
      setStartDate(newStartDate);
      setEndDate(setEndOfDay(newStartDate).getTime());
    } else if (typeDay === "Every Week") {
      const newStartDate = subWeeks(startDate, 1).getTime();
      const newEndDate = subWeeks(endDate, 1).getTime();
      setStartDate(newStartDate);
      setEndDate(setEndOfDay(newEndDate).getTime());
    } else if (typeDay === "Every Month") {
      const newStartDate = subMonths(startDate, 1).getTime();
      const newEndDate = subMonths(endDate, 1).getTime();
      setStartDate(newStartDate);
      setEndDate(setEndOfDay(newEndDate).getTime());
    }
  };

  const handleNext = () => {
    if (typeDay === "Every Day") {
      const newStartDate = addDays(startDate, 1).getTime();
      setStartDate(newStartDate);
      setEndDate(setEndOfDay(newStartDate).getTime());
    } else if (typeDay === "Every Week") {
      const newStartDate = addWeeks(startDate, 1).getTime();
      const newEndDate = addWeeks(endDate, 1).getTime();
      setStartDate(newStartDate);
      setEndDate(setEndOfDay(newEndDate).getTime());
    } else if (typeDay === "Every Month") {
      const newStartDate = addMonths(startDate, 1).getTime();
      const newEndDate = addMonths(endDate, 1).getTime();
      setStartDate(newStartDate);
      setEndDate(setEndOfDay(newEndDate).getTime());
    }
  };

  const formatDate = (date, formatStr) => format(new Date(date), formatStr);

  const renderTime = (time) => {
    if (!time) {
      return "0m";
    }
    const min = time % 60;
    if (time > 60) {
      const hours = Math.floor(time / 60);
      return `${hours}h ${min}m`;
    } else {
      return `${min}m`;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePrev}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {typeDay === "Every Day"
            ? formatDate(startDate, "MMMM d, yyyy")
            : typeDay === "Every Week"
            ? `${formatDate(startDate, "MMMM d, yyyy")} - ${formatDate(
                endDate,
                "MMMM d, yyyy"
              )}`
            : formatDate(startDate, "MMMM yyyy")}
        </Text>
        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.typeContainer}>
        <Pressable
          style={[
            styles.button,
            typeDay === "Every Day" && styles.chooseButton,
          ]}
          onPress={() => handleDayTypeChange("Every Day")}
        >
          <Text>Every Day</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            typeDay === "Every Week" && styles.chooseButton,
          ]}
          onPress={() => handleDayTypeChange("Every Week")}
        >
          <Text>Every Week</Text>
        </Pressable>
        <Pressable
          style={[
            styles.buttonEnd,
            typeDay === "Every Month" && styles.chooseButton,
          ]}
          onPress={() => handleDayTypeChange("Every Month")}
        >
          <Text>Every Month</Text>
        </Pressable>
      </View>
      <View style={styles.charts}>
        {data && chartData.length > 0 ? (
          <View>
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                donut
                showGradient
                sectionAutoFocus
                radius={90}
                innerRadius={60}
                focusOnPress
                strokeWidth={2}
                strokeColor="white"
                innerCircleColor={"#232B5D"}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <Text style={styles.centerLabelSubText}>Total</Text>
                    <Text style={styles.centerLabelText}>
                      {renderTime(data?.totalValue)}
                    </Text>
                  </View>
                )}
              />
            </View>
            {renderLegendComponent()}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="document-outline" size={24} color="black" />
            <Text>No data here</Text>
          </View>
        )}
      </View>
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
  typeContainer: {
    backgroundColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    borderRightWidth: 2,
    borderColor: "#ccc",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  buttonEnd: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  chooseButton: {
    margin: 2,
    backgroundColor: "white",
    borderRadius: 8,
    borderRightWidth: 0,
  },
  charts: {
    paddingLeft: 10,
    minHeight: 150,
    justifyContent: "center",
    marginBottom: 50,
  },
  chartContainer: {
    alignItems: "center",
  },
  centerLabel: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabelText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  centerLabelSubText: {
    fontSize: 14,
    color: "white",
  },
  noDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "48%",
  },
  legendText: {
    color: "black",
  },
});

export default StatisticalWorkByProject;
