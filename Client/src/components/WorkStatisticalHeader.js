import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getDataInApp } from "../services/Guest/getDataService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../services/RoleService";

const WorkStatisticalHeader = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let id = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        id = role.id;
      }
      const response = await getDataInApp(id);
      if (response.success) {
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
            {data?.totalWorksWeekly
              ? data?.totalWorksWeekly
              : "0"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total works completed in this week</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text style={styles.work}>
            {data?.totalWorksToday ? data?.totalWorksToday : "0"}
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

export default WorkStatisticalHeader;
