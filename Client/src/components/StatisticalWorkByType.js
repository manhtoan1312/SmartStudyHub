import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
import {} from "react-native-gifted-charts";
const options = [
  { key: "Show Work", value: "WORK" },
  { key: "Show Project", value: "PROJECT" },
  { key: "Show Tag", value: "TAG" },
];

const Dropdown = ({ visible, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity style={styles.overlay} onPress={onClose}>
      <View style={styles.dropdownContainer}>
        {options.map((item,index) => (
          <Pressable style={styles.option} key={index} onPress={() => onSelect(item.value)}>
            <Text style={styles.optionText}>{item.key}</Text>
          </Pressable>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

const StatisticalWorkByType = () => {
  const [data, setData] = useState({});
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const setEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 0, 0);
    return newDate;
  };

  const [startDate, setStartDate] = useState(firstDayOfMonth.getTime());
  const [endDate, setEndDate] = useState(setEndOfDay(lastDayOfMonth).getTime());
  const [type, setType] = useState("PROJECT");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [typeDay, setTypeDay] = useState("Every Month");

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
          type
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
  }, [startDate, endDate, type]);

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

  const handleSelect = (value) => {
    setType(value);
    setDropdownVisible(false);
  };

  const handleDayTypeChange = (text) => {
    setTypeDay(text);
    if (text === "Every Day") {
      setStartDate(now.getTime());
      setEndDate(setEndOfDay(now).getTime());
    } else if (text === "Every Week") {
      const firstDayOfWeek = now.getDate() - now.getDay();
      const lastDayOfWeek = firstDayOfWeek + 6;
      setStartDate(new Date(now.setDate(firstDayOfWeek)).getTime());
      setEndDate(setEndOfDay(new Date(now.setDate(lastDayOfWeek))).getTime());
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

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={{ color: "#333" }}>Time focus</Text>
          <Text style={styles.text}>
            Total Time focus: {renderTime(data?.totalValue)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => setDropdownVisible(true)}
        >
          <AntDesign
            name="swap"
            size={24}
            color="red"
            style={styles.rotatedIcon}
          />
          <Text style={{ color: "red" }}>Show {type.toLowerCase()}</Text>
        </TouchableOpacity>
      </View>
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
        {data && data?.listDataStatisticalByUnit ? (
          <ScrollView>
            <View style={{ paddingTop: 20 }}>
              {data.listDataStatisticalByUnit.map((item, index) => (
                <View key={index} style={styles.line}>
                  <Text
                    style={{ color: item?.unitId === -1 ? "#ccc" : "#333" }}
                  >
                    {item?.unitName}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={[
                        {
                          backgroundColor:
                            item?.unitId === 0
                              ? "#006DFF"
                              : item?.unitColor ? (item?.unitColor == "None"
                              ? "#e27602"
                              : item.unitColor) : '#e27602',
                          width: item.totalTimeFocusInUnit,
                          maxWidth: 300,
                          minWidth: 20,
                          height: 5,
                          borderRadius: 5,
                          marginRight: 10,
                        },
                      ]}
                    ></View>
                    <Text style={{ color: "#ccc" }}>
                      {renderTime(item?.totalTimeFocusInUnit)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
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

      <Dropdown
        visible={dropdownVisible}
        onSelect={handleSelect}
        onClose={() => setDropdownVisible(false)}
      />
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
  rotatedIcon: {
    transform: [{ rotate: "90deg" }],
    marginRight: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  dropdownContainer: {
    width: 150,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginRight: 40,
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
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
    maxHeight: 300,
  },
  line: {
    marginVertical: 10,
  },
});

export default StatisticalWorkByType;