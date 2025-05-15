import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { DeletePomodoro } from "../services/Guest/PomodoroService";

const PomodoroCompleted = ({ pomoItem, reload, navigation }) => {
  const renderDay = () => {
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let dateStart = new Date(pomoItem.date);
    let date = dateStart.toLocaleDateString("en-US", options);

    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", paddingBottom: 5 }}
      >
        <Text style={{ color: "black", fontSize: 20 }}>{date}</Text>
      </View>
    );
  };

  const renderRightActions = (itemId) => (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <TouchableOpacity
        style={styles.rightActions}
        onPress={() => handleDelete(itemId)}
      >
        <TouchableOpacity onPress={() => handleDelete(itemId)}>
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleDelete = async (id) => {
    console.log(id);
    const response = await DeletePomodoro(id);
    if (response.success) {
      reload();
    } else {
      Alert("Error when delele work", response.message);
    }
  };

  const renderTime = (time) => {
    const date = new Date(time);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <View style={{ padding: 10 }}>
      <View style={{ flex: 1, flexDirection: "column", paddingLeft: 10 }}>
        {renderDay()}
        <View style={styles.time}>
          <Text style={{ color: "gray" }}>
            Focus time: {pomoItem?.timeFocus} Minute
          </Text>
          <Text style={{ color: "gray" }}>
            Work Completed: {pomoItem.totalWorkCompleted} {pomoItem.totalWorkCompleted> 1? 'Missions': 'Mission' }
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 5,
          }}
        ></View>
      </View>
      {pomoItem?.pomodoros && pomoItem?.pomodoros.map((item) => (
        <Swipeable
          renderRightActions={renderRightActions(item.id)}
          key={item.id}
        >
          <TouchableOpacity
            style={{ flexDirection: "column", marginVertical: 5 }}
          >
            <View style={styles.container}>
              <TouchableOpacity>
                {item.isEndPomo ? (
                  <AntDesign
                    name="checkcircle"
                    size={20}
                    color="#00cc00"
                    style={{
                      marginRight: 15,
                    }}
                  />
                ) : (
                  <AntDesign
                    name="clockcircle"
                    size={20}
                    color="#ff3232"
                    style={{
                      marginRight: 15,
                    }}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.content}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.workName,
                      {textDecorationLine: item?.isEndPomo? 'line-through': 'none'},
                      { color: item.mode === "SPECIFIED" ? "black" : "red" },
                    ]}
                  >
                    {item.pomodoroName}
                  </Text>
                  
                </View>
                {item?.timeOfPomodoro && <View>
                <Text>{`${item?.timeOfPomodoro} minute`}</Text>
                </View>}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity style={styles.playButton}>
                  {item?.isEndPomo ? (
                    <View>
                      <Text>{renderTime(item.endTime)}</Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <Text>
                        {item.startTime
                          ? renderTime(item.startTime)
                          : renderTime(item.endTime)}
                      </Text>
                      <Text>|</Text>
                      <Text>{renderTime(item.endTime)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
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
  playButton: {
    marginRight: 10,
    alignItems: "center",
  },
  rightActions: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
});

export default PomodoroCompleted;
