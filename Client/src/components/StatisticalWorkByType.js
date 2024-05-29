import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getDataInApp } from "../services/Guest/getDataService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../services/RoleService";
import { statisticalWorksByUnit } from "../services/Guest/StatiscalService";

const StatisticalWorkByType = () => {
  const [data, setData] = useState({});
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const [startDate, setStartDate] = useState(firstDayOfMonth.getTime());
  const [endDate, setEndDate] = useState(lastDayOfMonth.getTime());
  const [type, setType] = useState("PROJECT");
  useEffect(() => {
    const fetchData = async () => {
      let id = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        id = role.id;
      }
      console.log(startDate,
        endDate)
      const response = await statisticalWorksByUnit(
        startDate,
        endDate,
        id,
        type
      );
      if (response.success) {
        console.log(response);
        setData(response.data);
      } else {
        console.log("Error fetch data in app:", response.message);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.work}>
            {data?.totalWorks ? data?.totalWorks : "0"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total works completed</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.work}>
            {data?.totalWorksToday ? data?.totalWorksToday : "0"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total works completed in this week</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.work}>
            {data?.totalWorksWeekly ? data?.totalWorksWeekly : "0"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total works completed today</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 10,
    width: 100,
    marginTop: 10,
    alignItems: "center",
  },
  work: {
    fontSize: 28,
    color: "red",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  countContainer: {
    alignItems: "center",
  },
  mainContainer: {
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
});

export default StatisticalWorkByType;
