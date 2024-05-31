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
import { BarChart } from "react-native-gifted-charts";
import getRole from "../services/RoleService";
import { statisticalWorks } from "../services/Guest/StatiscalService";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";

const StatisticWork = () => {
  const [data, setData] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [loading, setLoading] = useState(false);
  const now = new Date();

  const [startDate, setStartDate] = useState(subMonths(now, 5).getTime());
  const [endDate, setEndDate] = useState(now.getTime());
  const [typeDay, setTypeDay] = useState("Every Month");

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const fetchData = async (start, end) => {
    setLoading(true);
    try {
      let id = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        id = role.id;
      }
      let type = "MONTH";
      if (typeDay === "Every Day") {
        type = "DAY";
      }
      if (typeDay === "Every Week") {
        type = "WEEK";
      }
      const response = await statisticalWorks(start, end, id, type);
      if (response.success) {
        setData((prevData) => [...prevData, ...response.data?.listDate]);
      } else {
        console.log("Error fetch data in app:", response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayTypeChange = (text) => {
    setTypeDay(text);
    setData([]);
    let newStartDate, newEndDate;
    if (text === "Every Day") {
      newStartDate = startOfDay(subDays(now, 5)).getTime();
      newEndDate = endOfDay(now).getTime();
    } else if (text === "Every Week") {
      newStartDate = startOfWeek(subWeeks(now, 5)).getTime();
      newEndDate = endOfWeek(now).getTime();
    } else if (text === "Every Month") {
      newStartDate = startOfMonth(subMonths(now, 5)).getTime();
      newEndDate = endOfMonth(now).getTime();
    }
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    fetchData(newStartDate, newEndDate);
  };

  const renderTopLabel = (index) => {
    if (data && data.length > 0) {
      if (selectedBar === index && data[index]) {
        const { totalValue, startDate, endDate } = data[index];
        return (
          <View style={styles.topLabelContainer}>
            <Text style={styles.totalValue}>{totalValue}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.date}>
                {format(new Date(startDate), "MM/dd")}-
              </Text>
              <Text style={styles.date}>
                {format(new Date(endDate), "MM/dd")}
              </Text>
            </View>
          </View>
        );
      }
    }
    return null;
  };

  const chartData =
    data.length > 0
      ? data.map((item, index) => ({
          value: item.totalValue,
          label: format(new Date(item.startDate), "MM/dd"),
          topLabelComponent: () => renderTopLabel(index),
          onPress: () => setSelectedBar(index),
        }))
      : [];

  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      if (!loading) {
        let newStartDate, newEndDate;
        if (typeDay === "Every Day") {
          newStartDate = startOfDay(subDays(new Date(startDate), 5)).getTime();
          newEndDate = startOfDay(new Date(startDate)).getTime();
        } else if (typeDay === "Every Week") {
          newStartDate = startOfWeek(subWeeks(new Date(startDate), 5)).getTime();
          newEndDate = startOfWeek(new Date(startDate)).getTime();
        } else if (typeDay === "Every Month") {
          newStartDate = startOfMonth(subMonths(new Date(startDate), 5)).getTime();
          newEndDate = startOfMonth(new Date(startDate)).getTime();
        }
        setStartDate(newStartDate);
        fetchData(newStartDate, newEndDate);
      }
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={{ color: "#333", fontWeight: "bold", fontSize: 18 }}>
            WORK CHART
          </Text>
          <View style={styles.content}>
            <View>
              <Text style={styles.text}>
                Total: {data.reduce((acc, item) => acc + item.totalValue, 0)}{" "}
                Work
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                Max: {Math.max(...data.map((item) => item.totalValue))} Work
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                Average:{" "}
                {(
                  data.reduce((acc, item) => acc + item.totalValue, 0) /
                  data.length
                ).toFixed(2)}{" "}
                Work
              </Text>
            </View>
          </View>
        </View>
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
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <View style={styles.charts}>
          {chartData.length > 0 ? (
            <BarChart
              width={300}
              data={chartData}
              frontColor="#177AD5"
              barWidth={30}
              noOfSections={5}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisColor={"#ccc"}
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="document-outline" size={24} color="black" />
              <Text> No data here</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    flex: 1,
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
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    width: "100%",
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
    maxHeight: 300,
  },
  topLabelContainer: {
    alignItems: "center",
    marginBottom: 6,
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 3,
  },
  totalValue: {
    color: "white",
    fontSize: 12,
  },
  date: {
    fontSize: 8,
    color: "white",
  },
});

export default StatisticWork;
