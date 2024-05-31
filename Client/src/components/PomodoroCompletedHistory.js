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

const PomodoroCompletedHistory = ({ item, reload }) => {


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
    <View style={{ }}>
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
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        styles.workName,
                        {
                          textDecorationLine: item?.isEndPomo
                            ? "line-through"
                            : "none",
                        },
                        { color: item.mode === "SPECIFIED" ? "black" : "red" },
                      ]}
                    >
                      {item.pomodoroName}
                    </Text>
                  </View>
                  {item?.timeOfPomodoro && (
                    <View>
                      <Text>{`${item?.timeOfPomodoro} minute`}</Text>
                    </View>
                  )}
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

export default PomodoroCompletedHistory;
