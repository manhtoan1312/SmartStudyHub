import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-gifted-charts";
import getRole from "../services/RoleService";
import { statisticalWorks } from "../services/Guest/StatiscalService";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
} from "date-fns";

const StatisticWork = () => {
  const [data, setData] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [loading, setLoading] = useState(false);
  const now = new Date();

  const [typeDay, setTypeDay] = useState("Every Month");
  const [startDate, setStartDate] = useState(subMonths(now, 4).getTime());
  const [endDate, setEndDate] = useState(now.getTime());

  useEffect(() => {
    setInitialDateRange();
  }, [typeDay]);

  const setInitialDateRange = () => {
    let initialStartDate, initialEndDate;
    if (typeDay === "Every Day") {
      initialStartDate = startOfDay(subDays(now, 15)).getTime(); // 15 days
      initialEndDate = endOfDay(now).getTime();
    } else if (typeDay === "Every Week") {
      initialStartDate = startOfWeek(subWeeks(now, 4)).getTime(); // 4 weeks
      initialEndDate = endOfWeek(now).getTime();
    } else if (typeDay === "Every Month") {
      initialStartDate = startOfMonth(subMonths(now, 4)).getTime(); // 4 months
      initialEndDate = endOfMonth(now).getTime();
    }
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    fetchData(initialStartDate, initialEndDate);
  };

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
      } else if (typeDay === "Every Week") {
        type = "WEEK";
      }

      const formattedStart = new Date(start).toISOString();
      const formattedEnd = new Date(end).toISOString();
      console.log(
        `Fetching data from ${formattedStart} to ${formattedEnd} with type ${type}`
      );
      const response = await statisticalWorks(start, end, id, type);
      let fetchedData = response.success ? response.data?.listDate || [] : [];
      console.log(fetchedData)
      let completeData = generateCompleteData(start, end, fetchedData, type);

      setData(completeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCompleteData = (start, end, fetchedData, type) => {
    let date = new Date(start);
    let endDate = new Date(end);
    let completeData = [];

    while (date <= endDate) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const existingData = fetchedData.find(
        (item) =>
          format(new Date(item.startDate), "yyyy-MM-dd") === formattedDate ||
          format(new Date(item.endDate), "yyyy-MM-dd") === formattedDate
      );

      if (existingData) {
        completeData.push(existingData);
      } else {
        completeData.push({
          totalValue: 0,
          startDate: date.getTime(),
          endDate: date.getTime(),
        });
      }

      if (type === "DAY") {
        date = addDays(date, 1);
      } else if (type === "WEEK") {
        date = addWeeks(date, 1);
      } else if (type === "MONTH") {
        date = addMonths(date, 1);
      }
    }

    return completeData;
  };

  const generateChartData = () => {
    const screenWidth = Dimensions.get("window").width;
    const barWidth = screenWidth / (data.length || 1);

    return data.map((item, index) => ({
      value: item.totalValue,
      label: `${format(new Date(item?.endDate), "dd/MM")}`,
      topLabelComponent: () => renderTopLabel(index),
      onPress: () => setSelectedBar(index),
    }));
  };

  const renderTopLabel = (index) => {
    if (data && data.length > 0) {
      if (selectedBar === index && data[index]) {
        const { totalValue, startDate, endDate } = data[index];
        try {
          return (
            <View style={styles.topLabelContainer}>
              <Text style={styles.totalValue}>{totalValue}</Text>
              <Text style={styles.date}>{format(new Date(startDate), "MM/dd")}</Text>
              <Text style={styles.date}>{format(new Date(endDate), "MM/dd")}</Text>
            </View>
          );
        } catch (error) {
          console.error("Error formatting date:", startDate, endDate, error);
        }
      }
    }
    return null;
  };

  const handleDayTypeChange = (text) => {
    setTypeDay(text);
    setData([]);
    setInitialDateRange();
  };

  const handleScroll = (direction) => {
    setData([])
    let newStartDate, newEndDate;
    if (typeDay === "Every Day") {
      if (direction === "left") {
        newStartDate = subDays(new Date(startDate), 15).getTime();
        newEndDate = subDays(new Date(endDate), 15).getTime();
      } else {
        newStartDate = addDays(new Date(startDate), 15).getTime();
        newEndDate = addDays(new Date(endDate), 15).getTime();
      }
    } else if (typeDay === "Every Week") {
      if (direction === "left") {
        newStartDate = subWeeks(new Date(startDate), 4).getTime();
        newEndDate = subWeeks(new Date(endDate), 4).getTime();
      } else {
        newStartDate = addWeeks(new Date(startDate), 4).getTime();
        newEndDate = addWeeks(new Date(endDate), 4).getTime();
      }
    } else if (direction === "left") {
      newStartDate = subMonths(new Date(startDate), 4).getTime();
      newEndDate = subMonths(new Date(endDate), 4).getTime();
    } else {
      newStartDate = addMonths(new Date(startDate), 4).getTime();
      newEndDate = addMonths(new Date(endDate), 4).getTime();
    }
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    fetchData(newStartDate, newEndDate);
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
                Total:{" "}
                {data.length > 0
                  ? data.reduce((acc, item) => acc + item.totalValue, 0)
                  : 0}{" "}
                Work
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                Max:{" "}
                {data.length > 0
                  ? Math.max(...data.map((item) => item.totalValue))
                  : 0}{" "}
                Work
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                Average:{" "}
                {data.length > 0
                  ? (
                      data.reduce((acc, item) => acc + item.totalValue, 0) /
                      data.length
                    ).toFixed(2)
                  : 0}{" "}
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

      <ScrollView horizontal>
        <View style={styles.charts}>
          {data.length > 0 ? (
            <BarChart
              data={generateChartData()}
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
      <View style={styles.navigationContainer}>
        <Pressable
          style={styles.navButton}
          onPress={() => handleScroll("left")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.navButton}
          onPress={() => handleScroll("right")}
        >
          <Ionicons name="arrow-forward" size={24} color="black" />
        </Pressable>
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
    width: Dimensions.get("window").width,
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
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    paddingBottom:20
  },
  navButton: {
    marginHorizontal: 10,
  },
});

export default StatisticWork;
