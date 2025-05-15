import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

const ControlButtons = ({ isPaused, handleStop, startFocus, mode }) => {
  if (mode === "work") {
    return (
      <View style={styles.controlButtons}>
        <TouchableOpacity style={styles.startButton} onPress={startFocus}>
          <Entypo
            name={isPaused ? "controller-play" : "controller-paus"}
            style={{ marginBottom: -4, marginRight: 5 }}
            size={20}
            color={isPaused ? "green" : "orange"}
          />
          <Text style={{ color: isPaused ? "green" : "orange", fontSize: 16 }}>
            {isPaused ? "Start Focus Mode" : "Pause"}
          </Text>
        </TouchableOpacity>
        {!isPaused && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={() => handleStop()}
          >
            <MaterialIcons
              name="stop"
              style={{ marginBottom: -4, marginRight: 5 }}
              size={20}
              color="red"
            />
            <Text style={{ color: "red", fontSize: 16 }}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.controlButtons}>
        {isPaused ? (
          <TouchableOpacity style={styles.startButton} onPress={startFocus}>
            <Entypo
              name="controller-play"
              style={{ marginBottom: -4, marginRight: 5 }}
              size={20}
              color="orange"
            />
            <Text style={{ color: "orange", fontSize: 16 }}>
              Start {mode === "shortBreak" ? "Short" : "Long"} Break
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={() => handleStop()}
          >
            <MaterialIcons
              name="stop"
              style={{ marginBottom: -4, marginRight: 5 }}
              size={20}
              color="red"
            />
            <Text style={{ color: "red", fontSize: 16 }}>Skip Break Time</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  controlButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 50,
    borderRadius: 20,
    alignSelf: "stretch",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default ControlButtons;
