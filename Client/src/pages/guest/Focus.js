import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { CircularProgress } from "react-native-circular-progress";
import {
  AntDesign,
  MaterialCommunityIcons,
  Octicons,
  FontAwesome5,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "react-native";

const { width, height } = Dimensions.get("screen");

const red = "#f54e4e";
const green = "#4aec8c";

const Focus = ({ navigation }) => {
  const [checkedTask, setCheckedTask] = useState(false);
  const [choose, setChoose] = useState(false);
  const [countWork, setCountWork] = useState(1);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerMode, setTimerMode] = useState(0);
  const [selectedTask, setSelectedTask] = useState({});
  const [percentage, setPercentage] = useState(100); 
  const settingsInfo = {
    workMinutes: 25,
    breakMinutes: 5,
  };
  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  useEffect(() => {
    secondsLeftRef.current = calculateTotalSeconds();
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        switchMode();
        return;
      }

      tick();
      updateProgress();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, mode, timerMode]);

  const calculateTotalSeconds = () => {
    return mode === "work"
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;
  };

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  };

  const updateProgress = () => {
    const totalSeconds = calculateTotalSeconds();
    const percentage = Math.round(
      (secondsLeftRef.current / totalSeconds) * 100
    );
    setPercentage(percentage);
  };

  const switchMode = () => {
    const nextMode = modeRef.current === "work" ? "break" : "work";
    modeRef.current = nextMode;

    setMode(nextMode);
    setSecondsLeft(calculateTotalSeconds());
    secondsLeftRef.current = calculateTotalSeconds();
  };

  const handleCloseTask = () => {
    setSelectedTask({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.imageBg}
        source={require("../../images/bg_focus_1.jpg")}
      />
      <View style={styles.overlay}>
        <View>
          <View style={{ justifyContent: "space-around", flex: 1 }}>
            <TouchableOpacity style={styles.downButton}>
              <AntDesign name="down" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.taskContainer}>
              {!selectedTask && (
                <Text onPress={() => setChoose(true)}>
                  Please Choose a Task
                </Text>
              )}
              {selectedTask && (
                <View style={styles.selectedTask}>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      value={checkedTask}
                      onValueChange={() => setCheckedTask(!checkedTask)}
                      style={styles.checkbox}
                    />
                  </View>
                  <View style={styles.taskDetails}>
                    <Text>{selectedTask.name}</Text>
                    <View style={styles.timerIcons}>
                      {[...Array(selectedTask.Procount)].map((_, index) => (
                        <MaterialCommunityIcons
                          key={index}
                          name="timer"
                          size={14}
                          color="pink"
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.closeButton}>
                    <AntDesign
                      onPress={() => handleCloseTask()}
                      name="closecircleo"
                      size={24}
                      color="gray"
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        <CircularProgress
          style={styles.circularProgress}
          size={200}
          width={15}
          fill={percentage}
          tintColor={mode === "work" ? red : green}
          backgroundColor="rgba(255, 255, 255, 0.2)"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <Text style={styles.progressText}>{minutes + ":" + seconds}</Text>
          )}
        </CircularProgress>

        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.startButton}>
            <Entypo name="controller-play" size={20} color="green" />
            <Text style={{ color: "green", fontSize: 16 }}>
              Start Focus Mode
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsButtons}>
          <View style={styles.settingsIcon}>
            <MaterialCommunityIcons name="meditation" size={20} color="white" />
            <Text style={{ color: "white", fontSize: 10 }}>Strict Regime</Text>
          </View>
          <View style={styles.settingsIcon}>
            {timerMode === 0 && (
              <MaterialIcons name="timer" size={20} color="white" />
            )}
            {timerMode === 1 && (
              <Ionicons name="hourglass-outline" size={20} color="white" />
            )}
            <Text style={{ color: "white", fontSize: 10 }}>Timer Mode</Text>
          </View>
          <View style={styles.settingsIcon}>
            <Octicons name="screen-full" size={20} color="white" />
            <Text style={{ color: "white", fontSize: 10 }}>Full Screen</Text>
          </View>
          <View style={styles.settingsIcon}>
            <FontAwesome5 name="itunes-note" size={20} color="white" />
            <Text style={{ color: "white", fontSize: 10 }}>
              Noise Helps Concentration
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBg: {
    width: width,
    height: height,
    position: "absolute",
  },
  overlay: {
    flex: 2,
    justifyContent: "space-around",
    alignItems: "center",
  },
  downButton: {
    flex: 1,
    alignItems: "flex-start",
  },
  taskContainer: {
    alignItems: "center",
    marginBottom: 20,
    flex: 1,
    flexDirection: "row",
  },
  selectedTask: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    flex: 1,
  },
  checkbox: {
    alignSelf: "center",
    borderWidth: 0,
    color: "gray",
  },
  taskDetails: {
    flex: 4,
    marginLeft: 10,
  },
  timerIcons: {
    flexDirection: "row",
    marginTop: 5,
  },
  closeButton: {
    flex: 1,
  },
  // Add spacing between sections
  sectionSpacing: {
    height: 20,
  },
  // Section 3: Process (Circular Progress)
  circularProgress: {
    flex: 1,
    marginTop: 20,
  },
  progressText: {
    color: "#fff",
  },
  // Section 4: Control Buttons
  controlButtons: {
    marginTop: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Section 5: Settings Buttons
  settingsButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  settingsIcon: {
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
    width: 50,
  },
});

export default Focus;
