import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Audio } from "expo-av";
import {
  ExtraMarkCompleted,
  RecoverExtraWork,
} from "../services/Guest/ExtraWork";
import { DeleteWork, RecoverWork } from "../services/Guest/WorkService";
import { Swipeable } from "react-native-gesture-handler";
import ExtraActive from "./ExtraActive";
import ExtraDeleted from "./ExtraDeleted";
import ExtraCompleted from "./ExtraCompleted";

const WorkCompletedDL = ({ workItem, reload, navigation }) => {
  const renderDay = () => {
    const dueDate = workItem.statusWork;
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let color = "gray";
    let dateStart = new Date(workItem.endTime);
    dateStart.setDate(dateStart.getDate() - 1);
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

  const renderTime = () => {
    const date = new Date(workItem.endTime);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const handleRecoverWork = async () => {
    const response = await RecoverWork(workItem.id);
    if (response.success) {
      console.log("done");
      reload();
    } else {
      Alert.alert("Recover Extrawork Error!", response.message);
    }
  };
  const updateWork = () => {
    navigation.navigate("UpdateWork", { id: workItem.id });
  };

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

  const handleDelete = async () => {
    const response = await DeleteWork(workItem.id);
    if (response.success) {
      reload();
    } else {
      Alert("Error when delele work", response.message);
    }
  };
  return (
    <View>
      <Swipeable renderRightActions={renderRightActions}>
        <View>
          <TouchableOpacity
            onPress={() => updateWork()}
            style={{ flexDirection: "column", marginVertical: 5 }}
          >
            <View style={styles.container}>
              <TouchableOpacity onPress={() => handleRecoverWork()}>
                <AntDesign
                  name="checkcircle"
                  size={20}
                  color="#00cc00"
                  style={{
                    marginRight: 15,
                  }}
                />
              </TouchableOpacity>
              <View style={styles.content}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.workName,
                      { textDecorationLine: "line-through", color: "#666666" },
                    ]}
                  >
                    {workItem.workName}{" "}
                  </Text>
                  <View>
                    <Text>focus time: {workItem.timePassed}M</Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
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
                  {renderDay()}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 5,
                    }}
                  ></View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity style={styles.playButton}>
                  <Text>{renderTime()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
      {workItem?.extraWorks.length > 0 &&
        workItem.extraWorks?.map((item) => (
          <View key={item.id} style={[styles.container, { paddingLeft: 30, flex:1 }]}>
            {item.status === "ACTIVE" && (
              <ExtraActive extra={item} reload={reload} navigation={navigation} />
            )}
            {item.status === "COMPLETED" && (
              <ExtraCompleted
                extra={item}
                reload={reload}
                navigation={navigation}
              />
            )}
            {item.status === "DELETED" && (
              <ExtraDeleted extra={item} reload={reload} navigation={navigation} />
            )}
          </View>
        ))}
        {workItem?.extraWorksDeleted.length > 0 &&
        workItem.extraWorksDeleted.map((item) => (
          <View key={item.id} style={[styles.container, { paddingLeft: 30, flex:1 }]}>
            {item.status === "ACTIVE" && (
              <ExtraActive extra={item} reload={reload} navigation={navigation} />
            )}
            {item.status === "COMPLETED" && (
              <ExtraCompleted 
                extra={item}
                reload={reload}
                navigation={navigation}
              />
            )}
            {item.status === "DELETED" && (
              <ExtraDeleted extra={item} reload={reload} navigation={navigation} />
            )}
          </View>
        ))}
    </View>
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
  content: {
    flex: 1,
  },
  workName: {
    fontSize: 14,
    fontWeight: "400",
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
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "#ff3232",
    borderWidth: 2,
    marginRight: 15,
  },
  rightActions: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WorkCompletedDL;
