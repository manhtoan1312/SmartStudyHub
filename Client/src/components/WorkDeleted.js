import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,Feather
} from "@expo/vector-icons";
import { RecoverWork, RecoverExtraWork } from "../services/Guest/WorkService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkDeleted = ({ workItem, reload, navigation }) => {
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <TouchableOpacity
        style={styles.rightActions}
        onPress={() => handleDelete()}
      >
        <TouchableOpacity onPress={() => handleDelete()}>
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  async function confirmDelete() {
    const response = await DeleteCompletelyProject(projectItem.id);
    if (response.success) {
      reload();
    }
  }

  const handleDelete = () => {
    Alert.alert(
      "Warning",
      "Are you sure you want to permanently delete this item?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => confirmDelete(),
        },
      ]
    );
  };

  const handleRecover = async () => {
    const response = await RecoverWork(workItem.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Error when recover work", response.message);
    }
  };

  const renderDay = () => {
    const dueDate = workItem.statusWork;
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let color = "gray";
    let dateStart = new Date(workItem.dueDate);
    dateStart.setDate(dateStart.getDate()-1)
    let date = dateStart.toLocaleDateString("en-US", options);

    if (dueDate === "TODAY") {
      color = "green";
      date = "Today";
    } else if (dueDate === "TOMORROW") {
      color = "orange";
      date = "Tomorrow";
    } else if (dueDate === "OUTOFDATE") {
      color = "red";
    }

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="calendar-alt" size={14} color={color} />
        <Text style={{ color: color, paddingLeft: 5 }}>{date}</Text>
      </View>
    );
  };

  const handleRecoverExtraWork = async (id) => {
    const response = await RecoverExtraWork(id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Error when recover extra work", response.message);
    }
  };

  const handlePlay = async () => {
    try {
      navigation.navigate("UpdateWork", {id:workItem.id});
    } catch (e) {
      Alert.alert("Error when save work", e);
    }
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        onPress={() => handlePlay()}
        style={{ flexDirection: "column", marginVertical: 5 }}
      >
        <View style={styles.container}>
          <AntDesign name="closecircle" size={24} color="red" />
          <View style={styles.content}>
            <Text
              style={[
                styles.workName,
                workItem.status === "DELETED" && styles.deletedText,
              ]}
            >
              {workItem.workName}
            </Text>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              {workItem.numberOfPomodoros !== 0 && (
                <View style={styles.pomodoroContainer}>
                  <MaterialCommunityIcons
                    name="clock-check"
                    size={14}
                    color="#ff3232"
                  />
                  <Text style={styles.pomodoroText}>
                    {workItem.numberOfPomodorosDone}/
                  </Text>
                  <MaterialCommunityIcons
                    name="clock"
                    size={14}
                    color="#ff9999"
                  />
                  <Text style={[styles.pomodoroText, { marginRight: 5 }]}>
                    {workItem.numberOfPomodoros}
                  </Text>
                </View>
              )}
              {workItem.statusWork !== "SOMEDAY" && renderDay()}
            </View>
          </View>
          <TouchableOpacity onPress={() => handleRecover()} style={styles.recoverButton}>
          <Feather name="refresh-ccw" size={24} color="gray" />
      </TouchableOpacity>
        </View>
        
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    height: 55,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "#ff3232",
    borderWidth: 2,
    marginRight: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingLeft:10
  },
  workName: {
    fontSize: 14,
    fontWeight: "400",
  },
  extraContainer: {
    marginLeft: 20,
    borderLeftColor: "lightgray",
    borderLeftWidth: 2,
    marginVertical: 10,
  },
  extraWorkItem: {
    paddingLeft: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginRight: 10,
  },
  deletedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  rightActions: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pomodoroContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pomodoroText: {
    marginLeft: 2,
    fontSize: 12,
  },
  playButton: {
    marginLeft: 10,
  },
  recoverButton:{
    marginRight:10
  }
});

export default WorkDeleted;
