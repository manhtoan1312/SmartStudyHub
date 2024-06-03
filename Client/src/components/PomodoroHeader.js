import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getDataInApp } from "../services/Guest/getDataService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../services/RoleService";

const PomodoroHeader = ({ id }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const response = await getDataInApp(id);
        if (response.success) {
          setData(response.data);
        } else {
          console.log("Error fetch data in app:", response.message);
        }
      } else {
        let userId = await AsyncStorage.getItem("id");
        const role = await getRole();
        if (role) {
          userId = role.id;
        }
        const response = await getDataInApp(userId);
        if (response.success) {
          setData(response.data);
        } else {
          console.log("Error fetch data in app:", response.message);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.work}>
            {data?.totalTimeFocus
              ? (data?.totalTimeFocus / 60).toFixed(1)
              : "0"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total focus time (hours)</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.work}>
            {data?.totalTimeFocusWeekly
              ? (data?.totalTimeFocusWeekly / 60).toFixed(1)
              : "0"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total time focus in this week (hours)</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.work}>
            {data?.totalTimeFocusToday
              ? (data?.totalTimeFocusToday / 60).toFixed(1)
              : "0"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total time focus today (hours)</Text>
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

export default PomodoroHeader;
