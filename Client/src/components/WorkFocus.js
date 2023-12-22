import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkItem = ({ workItem, onSelect }) => {
  const handleSelect = () => {
    onSelect(workItem, "WORK");
  };
  const handleSelectExtra = (item) => {
    onSelect(item, "EXTRA");
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleSelect()}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{workItem.workName}</Text>
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
              <MaterialCommunityIcons name="clock" size={14} color="#ff9999" />
              <Text style={[styles.pomodoroText, { marginRight: 5 }]}>
                {workItem.numberOfPomodoros}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="ios-play-circle-sharp" size={26} color="#ff3232" />
        </TouchableOpacity>
      </TouchableOpacity>
      {workItem.extraWorks.length > 0 &&
        workItem.extraWorks
          .filter((item) => item.status === "ACTIVE")
          .map((extraWork, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.itemContainer, styles.extraItemContainer]}
              onPress={() => handleSelectExtra(extraWork)}
            >
              <View style={styles.itemContent}>
                <Text style={styles.extraItemName}>
                  {extraWork.extraWorkName}
                </Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons
                  name="ios-play-circle-sharp"
                  size={26}
                  color="#ff3232"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    paddingVertical: 10,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    marginRight: 10,
  },
  pomodoroContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pomodoroText: {
    fontSize: 14,
    marginRight: 10,
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  extraItemContainer: {
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderColor: "#333",
    justifyContent: "space-between", 
    alignItems: "center", 
  },

  extraItemName: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default WorkItem;
