import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
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
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import ControlButtons from "../../components/ControlButton";
import { Audio } from "expo-av";
import { CreatePomodoro } from "../../services/Guest/PomodoroService";
const { width, height } = Dimensions.get("screen");

const red = "#f54e4e";
const green = "#4aec8c";

const Focus = () => {
  const navigation = useNavigation();
  const [checkedTask, setCheckedTask] = useState(false);
  const [choose, setChoose] = useState(false);
  const [countWork, setCountWork] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [selectedTask, setSelectedTask] = useState(false);
  const [percentage, setPercentage] = useState(100);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [breakAfter, setBreakAfter] = useState(4);
  const [autoStartPo, setAutoStartPo] = useState(false);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [type, setType] = useState("-");
  const [isModalVisible, setModalVisible] = useState(false);
  const [disableBreakTime, setDisableBreakTime] = useState(false);
  const [stop, setStop] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [initialPomodoroTime, setInitialPomodoroTime] = useState(25);
  const [secondLeftDefault, setSecondsLeftDefault] = useState(25 * 60);
  const [timerModeOptions, setTimerModeOptions] = useState([]);
  const [selectedTimerModeOption, setSelectedTimerModeOption] = useState("+");
  let countPo = 0;

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../sound/DefaultBell.mp3")
    );
    await sound.playAsync();
  }

  useFocusEffect(
    React.useCallback(() => {
      if (!isPaused) {
        const interval = setInterval(() => {
          setSecondsLeft((prevSeconds) => {
            if (type === "-" || mode !== "work") {
              if (prevSeconds === 0) {
                postPomodoro();
                setStop(true);
                setIsPaused(true);
                switchMode();
                playSound();
                return calculateTotalSeconds();
              }
              return prevSeconds - 1;
            } else {
              return prevSeconds + 1;
            }
          });
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [isPaused, mode, secondsLeft, type])
  );

  const postPomodoro = async () => {
    const endTime = new Date().getTime();
    const id = await AsyncStorage.getItem("id");
    const response = await CreatePomodoro(
      id,
      null,
      null,
      initialPomodoroTime,
      startTime,
      endTime
    );
    if (!response.success) {
      Alert.alert("Error!!", response.message);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setMinutes(parseInt(secondsLeft / 60));
      setSeconds(secondsLeft % 60);
      updateProgress();
    }, [secondsLeft])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchSettings = async () => {
        try {
          const storedSettings = await AsyncStorage.getItem("settings");
          const secondLeft = await AsyncStorage.getItem("secondsLeft");
          const countWork = await AsyncStorage.getItem("countWork");
          const pause = await AsyncStorage.getItem("play");
          const mode = await AsyncStorage.getItem("mode");
          const storedStop = await AsyncStorage.getItem("stop");
          const storedStartTime = await AsyncStorage.getItem("startTime");
          const storedInitialPomodoroTime = await AsyncStorage.getItem(
            "initialPomodoroTime"
          );
          if (storedStop === "false") {
            setStop(false);
            setMinutes(storedInitialPomodoroTime);
            setSecondsLeftDefault(parseInt(storedInitialPomodoroTime) * 60);
          }
          if (secondLeft) {
            setSecondsLeft(secondLeft);
          }
          if (storedStartTime) {
            setStartTime(parseInt(storedStartTime));
          }
          if (initialPomodoroTime) {
            setInitialPomodoroTime(initialPomodoroTime);
          }
          if (storedSettings) {
            const parsedSettings = JSON.parse(storedSettings);
            setShortBreakTime(parsedSettings.shortBreakTime);
            setLongBreakTime(parsedSettings.longBreakTime);
            setBreakAfter(parsedSettings.breakAfter);
            setAutoStartPo(parsedSettings.autoStartPo);
            setAutoStartBreak(parsedSettings.autoStartBreak);
            setDisableBreakTime(parsedSettings.disableBreakTime);
            setTimerModeOptions([
              {
                key: "-",
                label: `Count down from ${parsedSettings.pomodoroTime.padStart(2, "0")}:00 to 00:00`,
              },
              { key: "+", label: "Start the timer until I turn it off" },
            ]);
            if (storedStop === "true") {
              setSecondsLeftDefault(parsedSettings.pomodoroTime * 60);
              setMinutes(parsedSettings.pomodoroTime);
            }
          }
          if (countWork) {
            setCountWork(parseInt(countWork));
          }
          if (pause) {
            setIsPaused(pause === "1" ? false : true);
          }
          if (mode) {
            setType(mode);
            setSelectedTimerModeOption(mode);
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
    }, [])
  );

  const calculateTotalSeconds = () => {
    if (type === "-") {
      return mode === "work"
        ? secondLeftDefault
        : (mode === "shortBreak" ? shortBreakTime : longBreakTime) * 60;
    } else if (type === "+") {
      setMode("work");
      return 10000000000;
    }
    return secondLeftDefault;
  };

  const updateProgress = () => {
    const totalSeconds = calculateTotalSeconds();
    const calculatedPercentage = Math.round((secondsLeft / totalSeconds) * 100);
    setPercentage(calculatedPercentage);
  };

  const switchMode = async () => {
    if (mode === "work") {
      setCountWork((pre) => pre + 1);
    }
    if (disableBreakTime) {
      setSecondsLeft(secondLeftDefault);
    } else {
      if (mode === "work") {
        if (countWork % breakAfter === 0) {
          setMode("longBreak");
          setSecondsLeft(longBreakTime * 60);
        } else {
          setMode("shortBreak");
          setSecondsLeft(shortBreakTime * 60);
        }
      } else {
        setMode("work");
        setSecondsLeft(secondLeftDefault);
      }
    }
    if (
      (mode === "work" && autoStartPo) ||
      (mode !== "work" && autoStartBreak)
    ) {
      setInitialPomodoroTime(minutes);
      setStartTime(new Date().getTime());
      setStop(false);
      setIsPaused(false);
    }
  };

  const startFocus = () => {
    if (stop && secondsLeft === secondLeftDefault) {
      setInitialPomodoroTime(minutes);
      setStartTime(new Date().getTime());
      setStop(!stop);
      saveToAsyncStorage("initialPomodoroTime", minutes);
      saveToAsyncStorage("startTime", startTime);
    }
    setIsPaused(!isPaused);
  };

  const saveToAsyncStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  const handleCloseTask = () => {
    setSelectedTask({});
  };
  const getNewSetting = async () => {
    const storedSettings = await AsyncStorage.getItem("settings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setShortBreakTime(parsedSettings.shortBreakTime);
      setLongBreakTime(parsedSettings.longBreakTime);
      setBreakAfter(parsedSettings.breakAfter);
      setAutoStartPo(parsedSettings.autoStartPo);
      setAutoStartBreak(parsedSettings.autoStartBreak);
      setDisableBreakTime(parsedSettings.disableBreakTime);
      setSecondsLeftDefault(parsedSettings.pomodoroTime * 60);
      setMinutes(parsedSettings.pomodoroTime);
      setSecondsLeft(parsedSettings.pomodoroTime * 60);
    }
    if (type === "+") {
      setMinutes(0);
      setSecondsLeft(0);
      setSecondsLeftDefault(0);
    }
  };

  const handleStop = async () => {
    if (mode === "work") {
      Alert.alert(
        "Smart Study Hub Announcement",
        "Do you want to stop this Pomodoro?",
        [
          {
            text: "Cancel",
          },
          {
            text: "OK",
            onPress: () => {
              getNewSetting();
              countPo = 0;
              setPercentage(100);
              setStop(true);
              setIsPaused(true);
            },
          },
        ]
      );
    } else {
      setStop(true);
      setIsPaused(true);
      switchMode();
    }
  };

  const openTimerModeModal = () => {
    if (!isPaused) {
      Alert.alert(
        "Smart Study Hub Announcement",
        "Please stop the timer before changing the timer mode.",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    } else {
      setModalVisible(true);
    }
  };

  const handleTimerModeSelection = () => {
    if (selectedTimerModeOption !== type) {
      setType(selectedTimerModeOption);
    }
    setModalVisible(false);
  };

  useEffect(() => {
    getNewSetting();
    updateProgress();
  }, [type]);
  const backtoHome = async () => {
    try {
      await AsyncStorage.setItem("secondsLeft", String(secondsLeft));
      await AsyncStorage.setItem("countWork", String(countWork));
      if (isPaused) {
        await AsyncStorage.setItem("play", "0");
      } else {
        await AsyncStorage.setItem("play", "1");
      }
      await AsyncStorage.setItem("countPomodoro", String(countPo));
      await AsyncStorage.setItem("mode", type);
      saveToAsyncStorage("stop", stop);

      navigation.navigate("Home");
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
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.imageBg}
        source={require("../../images/bg_focus_1.jpg")}
      />
      <View style={styles.overlay}>
        {/* Section 1: Back Button */}
        <TouchableOpacity style={styles.downButton}>
          <AntDesign
            name="down"
            size={24}
            color="white"
            onPress={() => backtoHome()}
          />
        </TouchableOpacity>

        {/* Section 2: Choose Task */}
        <View style={styles.taskContainer}>
          {!selectedTask && (
            <Text onPress={() => setChoose(true)}>Please Choose a Task</Text>
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

        {/* Section 3: Progress and Control Buttons */}
        <View>
          <CircularProgress
            style={styles.circularProgress}
            size={200}
            width={15}
            fill={percentage}
            tintColor={mode === "work" ? "red" : "green"}
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
          <ControlButtons
            isPaused={isPaused}
            handleStop={handleStop}
            startFocus={startFocus}
            mode={mode}
          />
        </View>

        {/* Section 4: Options */}
        <View style={styles.settingsButtons}>
          <View style={styles.settingsIcon}>
            <MaterialCommunityIcons name="meditation" size={20} color="white" />
            <View style={styles.textMode}>
              <Text style={{ color: "white", fontSize: 10 }}>
                Strict Regime
              </Text>
            </View>
          </View>
          <View style={styles.settingsIcon} onTouchEnd={openTimerModeModal}>
            {type === null && (
              <MaterialIcons name="timer" size={20} color="white" />
            )}
            {type === "-" && (
              <Ionicons name="hourglass-outline" size={20} color="white" />
            )}
            {type === "+" && (
              <FontAwesome5 name="hourglass-start" size={20} color="white" />
            )}
            <View style={styles.textMode}>
              <Text style={{ color: "white", fontSize: 10 }}>Timer Mode</Text>
            </View>
          </View>
          <View style={styles.settingsIcon}>
            <Octicons name="screen-full" size={20} color="white" />
            <View style={styles.textMode}>
              <Text style={{ color: "white", fontSize: 10 }}>Full Screen</Text>
            </View>
          </View>
          <View style={styles.settingsIcon}>
            <FontAwesome5 name="itunes-note" size={20} color="white" />
            <View style={{ marginTop: 5 }}>
              <Text style={{ color: "white", fontSize: 10 }}>Sound</Text>
            </View>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Timer Mode</Text>
              {timerModeOptions.map((option) => (
                <Pressable
                  key={option.key}
                  style={[
                    styles.timerModeOption,
                    option.key === selectedTimerModeOption && {
                      backgroundColor: "#FFC0CB",
                    },
                  ]}
                  onPress={() => setSelectedTimerModeOption(option.key)}
                >
                  <Text style={styles.timerModeText}>{option.label}</Text>
                  {option.key === selectedTimerModeOption && (
                    <AntDesign
                      name="checkcircle"
                      size={20}
                      color="red"
                      style={styles.checkIcon}
                    />
                  )}
                </Pressable>
              ))}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.okButton]}
                  onPress={() => handleTimerModeSelection()}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
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
    flex: 1,
    paddingVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },

  downButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 20,
  },

  taskContainer: {
    alignItems: "center",
    height: 50,
    marginTop: 80,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "white",
    opacity: 0.5,
    color: "gray",
    alignSelf: "center",
    position: "absolute",
    zIndex: 1,
  },

  progressText: {
    color: "#fff",
    fontSize: 32,
  },

  settingsButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "stretch",
  },

  settingsIcon: {
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  timerModeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
  },
  timerModeText: {
    fontSize: 16,
  },
  checkIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  okButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },

  textMode: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignSelf: "center",
    flex: 0,
  },
});

export default Focus;
