import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
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
  Ionicons,
} from "@expo/vector-icons";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [selectedTask, setSelectedTask] = useState(false);
  const [percentage, setPercentage] = useState(100);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [breakAfter, setBreakAfter] = useState(4);
  const [autoStartPo, setAutoStartPo] = useState(false);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  let secondLeftDefault = 25 * 60; 
  const secondsLeftRef = useRef(secondsLeft);
  const modeRef = useRef(mode);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds === 0) {
            switchMode();
            return calculateTotalSeconds();
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaused, mode, timerMode, secondsLeft]);

  useEffect(() => {
    setMinutes(Math.floor(secondsLeft / 60));
    setSeconds(secondsLeft % 60);
    updateProgress();
  }, [secondsLeft, isPaused]); 
  

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem("settings");
        const secondLeft = await AsyncStorage.getItem("secondsLeft")
        const countWork = await AsyncStorage.getItem("countWork")

        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setMinutes(parsedSettings.pomodoroTime);
          setShortBreakTime(parsedSettings.shortBreakTime);
          setLongBreakTime(parsedSettings.longBreakTime);
          setBreakAfter(parsedSettings.breakAfter);
          setAutoStartPo(parsedSettings.autoStartPo);
          setAutoStartBreak(parsedSettings.autoStartBreak);
          secondLeftDefault = parsedSettings.pomodoroTime * 60;
          setSecondsLeft(secondLeftDefault);
        }
        if(secondLeft && secondLeft !=='0') {
          setSecondsLeft(parseInt(secondLeft))
        }
        if(countWork){
          setCountWork(parseInt(countWork))
        }
      } catch (error) {
        console.log(error);
        Alert.alert(
          "Smart Study Hub Announcement",
          "An error occurred while get settings",
          [
            {
              text: "Cancel",
            },
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
      }
    };

    fetchSettings();
  }, []);

  const calculateTotalSeconds = () => {
    return mode === "work"
      ? secondLeftDefault
      : (mode === "shortBreak" ? shortBreakTime : longBreakTime) * 60;
      
  };

  const updateProgress = () => {
    const totalSeconds = calculateTotalSeconds();

    const percentage = Math.round(
      (secondsLeft / totalSeconds) * 100
    );
    setPercentage(percentage);
  };

  const switchMode = () => {
    const nextMode = modeRef.current === "work" ? "shortBreak" : "work";
    modeRef.current = nextMode;

    if (nextMode === "work") {
      setCountWork((prevCount) => prevCount + 1);
      if (countWork % breakAfter === 0) {
        setMode("longBreak");
        setSecondsLeft(longBreakTime * 60);
      } else {
        setMode("shortBreak");
        setSecondsLeft(shortBreakTime * 60);
      }
    } else {
      setMode("work");
      setSecondsLeft(minutes * 60);
    }

    if ((nextMode === "shortBreak" && autoStartBreak) || (nextMode === "work" && autoStartPo)) {
      startFocus();
    }
  };

  const startFocus = () => {
    setIsPaused(!isPaused);
  };
  const handleCloseTask = () => {
    setSelectedTask({});
  };
  
  
  
  const handleStop = () => {
    setIsPaused(true);
    setSecondsLeft(secondLeftDefault);
    setPercentage(100);
  };
  const backtoHome = async() => {
    try {
      await AsyncStorage.setItem("secondsLeft", String(secondsLeft));
      await AsyncStorage.setItem("countWork", String(countWork));
      
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Smart Study Hub Announcement",
        "An error occurred while saving the settings",
        [
          {
            text: "Cancel",
          },
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        style={styles.imageBg}
        source={require("../../images/bg_focus_1.jpg")}
      />
      <View style={styles.overlay}>
        <View>
          <View style={{ justifyContent: "space-between", flex: 1 }}>
            <TouchableOpacity style={styles.downButton}>
              <AntDesign
                name="down"
                size={24}
                color="white"
                onPress={() => backtoHome()}
              />
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

        <View>
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
              <Text style={styles.progressText}>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </Text>
            )}
          </CircularProgress>
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.startButton} onPress={startFocus}>
              <Entypo
                name={isPaused ? "controller-play" : "controller-paus"}
                style={{ marginBottom: -4, marginRight: 5 }}
                size={20}
                color={isPaused ? "green" : "orange"}
              />
              <Text
                style={{ color: isPaused ? "green" : "orange", fontSize: 16 }}
              >
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
    </ScrollView>
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
    paddingVertical: 20,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  downButton: {
    flex: 1,
    alignItems: "flex-start",
  },
  taskContainer: {
    alignItems: "center",
    marginTop: 20,
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "white",
    opacity: 0.5,
    color: "gray",
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
  circularProgress: {},
  progressText: {
    color: "#fff",
    fontSize: 32,
  },
  // Section 4: Control Buttons
  controlButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 50,
    borderRadius: 20,
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
  // Section 5: Settings Buttons
  settingsButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  settingsIcon: {
    alignItems: "center",
    justifyContent: "space-between",
    width: 50,
  },
});

export default Focus;
