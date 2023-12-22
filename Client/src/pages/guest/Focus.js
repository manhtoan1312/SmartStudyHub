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
import ModalSelectWork from "../../components/ModalSelectWork";
import { ExtraMarkCompleted } from "../../services/Guest/ExtraWork";
import { MarkCompleted } from "../../services/Guest/WorkService";
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
  const [selectedTask, setSelectedTask] = useState(null);
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
  const [selectedTimerModeOption, setSelectedTimerModeOption] = useState("-");
  const [typeWorkSelect, setTypeWork] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);
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
    const sTime = await AsyncStorage.getItem("startTime");
    console.log(sTime);
    let workid = null;
    let extraId = null;
    if (selectedTask) {
      workid = selectedTask.id;
    }
    if (selectedExtra) {
      extraId = selectedExtra.id;
    }
    const response = await CreatePomodoro(
      id,
      workid,
      extraId,
      selectedTask ? selectedTask.timeOfPomodoro : secondLeftDefault / 60,
      parseInt(sTime),
      endTime
    );
    console.log(response);
    if (!response.success) {
      Alert.alert("Error!!", response.message);
    } else {
      await AsyncStorage.removeItem("startTime");
      setStartTime(null);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setMinutes(parseInt(secondsLeft / 60));
      setSeconds(secondsLeft % 60);
      updateProgress();
    }, [secondsLeft])
  );

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
      } else {
        setMinutes(parseInt(secondLeft) / 60);
      }
      if (secondLeft) {
        setSecondsLeft(parseInt(secondLeft));
      }
      if (storedStartTime) {
        setStartTime(parseInt(storedStartTime));
      }
      if (initialPomodoroTime) {
        setInitialPomodoroTime(initialPomodoroTime);
      }
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        console.log(parsedSettings)
        setShortBreakTime(parsedSettings.shortBreakTime);
        setLongBreakTime(parsedSettings.longBreakTime);
        setBreakAfter(parsedSettings.breakAfter);
        setAutoStartPo(parsedSettings.autoStartPo);
        setAutoStartBreak(parsedSettings.autoStartBreak);
        setDisableBreakTime(parsedSettings.disableBreakTime);
        const pomodoroTimeString = String(parsedSettings.pomodoroTime);
        setTimerModeOptions([
          {
            key: "-",
            label: `Count down from ${
              (pomodoroTimeString).padStart(2, "0")
                ? (pomodoroTimeString).padStart(2, "0")
                : "25"
            }:00 to 00:00`,
          },
          { key: "+", label: "Start the timer until I turn it off" },
        ]);
        if (storedStop === "true" && parsedSettings) {
          setSecondsLeftDefault(parsedSettings.pomodoroTime * 60);
          setSecondsLeft(parsedSettings.pomodoroTime * 60);
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

  useFocusEffect(
    React.useCallback(() => {
      fetchAll();
    }, [])
  );
  const fetchAll = async () => {
    await fetchSettings();
    fetchWork();
  };
  const fetchWork = async () => {
    const work = await AsyncStorage.getItem("work");
    const typeWork = await AsyncStorage.getItem("workType");
    const stop = await AsyncStorage.getItem("stop");

    if (work && typeWork) {
      const parse = JSON.parse(work);
      setTypeWork(typeWork);
      if (typeWork === "WORK") {
        setSelectedTask(parse);
        setSecondsLeftDefault(parseInt(parse.timeOfPomodoro) * 60);
        setMinutes(parseInt(parse.timeOfPomodoro));
        setSecondsLeft(parseInt(parse.timeOfPomodoro) * 60);
        if (stop === "true") {
          setSecondsLeft(parseInt(parse.timeOfPomodoro) * 60);
        }
      } else {
        setSelectedExtra(parse);
      }
    }
  };

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
      saveToAsyncStorage("initialPomodoroTime", minutes);
      saveToAsyncStorage("startTime", new Date().getTime().toString());
    }
  };

  const startFocus = () => {
    if (stop && secondsLeft === secondLeftDefault) {
      if (selectedTask) {
        saveToAsyncStorage("initialPomodoroTime", selectedTask.timeOfPomodoro);
      } else {
        saveToAsyncStorage("initialPomodoroTime", secondLeftDefault / 60);
      }
      setStartTime(new Date().getTime());
      setStop(!stop);
      saveToAsyncStorage("startTime", new Date().getTime().toString());
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

  const handleCloseTask = async () => {
    setSelectedTask(null);
    setSelectedExtra(null);
    setStop(true);
    setIsPaused(true);
    if (type === "+") {
      setSecondsLeft(0);
    }
    await AsyncStorage.removeItem("work");
    await AsyncStorage.removeItem("workType");
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
      setSeconds(0);
      if (type === "+") {
        setMinutes(0);
        setSecondsLeft(0);
      } else {
        console.log(parsedSettings.pomodoroTime * 60);
        setSecondsLeft(parsedSettings.pomodoroTime * 60);
      }
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
            onPress: () => stopPo(),
          },
        ]
      );
    } else {
      setStop(true);
      setIsPaused(true);
      switchMode();
    }
  };

  const getSetting = async () => {
    const setting = await AsyncStorage.getItem("settings");
    if (setting) {
      return JSON.parse(setting);
    }
    return null;
  };
  const resetData = async () => {
    const setting = await getSetting();
    if (setting) {
      setSecondsLeft(setting.pomodoroTime * 60);
      setSecondsLeftDefault(setting.pomodoroTime * 60);
      setMinutes(parseInt(setting.pomodoroTime));
      setSeconds(0);
      setPercentage(100);
    }
  };
  const stopPo = async () => {
    if (selectedTask) {
      setSecondsLeft(selectedTask.timeOfPomodoro * 60);
      setMinutes(selectedTask.timeOfPomodoro);
    } else {
      resetData();
    }
    setStop(true);
    setIsPaused(true);
    if (type == "+") {
      setSecondsLeft(0);
      countPo = 0;
      setPercentage(100);
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

  const handleTimerModeSelection = async () => {
    if (selectedTimerModeOption !== type) {
      if (selectedTimerModeOption === "+") {
        setSecondsLeft(0);
        setMinutes(0);
      } else {
        getNewSetting();
        setSecondsLeft(secondLeftDefault);
      }
      setType(selectedTimerModeOption);
    }
    setModalVisible(false);
  };

  useEffect(() => {
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
  };

  const handleDoneExtra = async (id) => {
    const response = await ExtraMarkCompleted(id);
    if (response.success) {
      await AsyncStorage.removeItem("work");
      await AsyncStorage.removeItem("workType");
      await AsyncStorage.setItem("stop", "true");
      fetchSettings();
      setSecondsLeft(secondLeftDefault);
      setMinutes(secondLeftDefault / 60);
      setSelectedExtra(null);
      setSeconds(0);
      setPercentage(100);
    } else {
      Alert.alert("Error when complete extra work", response.message);
    }
  };
  const handleDoneWork = async (id) => {
    console.log(typeWorkSelect);
    if (typeWorkSelect === "WORK") {
      const response = await MarkCompleted(id);
      console.log(response);
      if (response.success) {
        await AsyncStorage.removeItem("work");
        await AsyncStorage.removeItem("workType");
        setSelectedTask(null);
      } else {
        Alert.alert("Error when complete work", response.message);
      }
    } else {
      const response = await ExtraMarkCompleted(id);
      console.log(response);
      if (response.success) {
        await AsyncStorage.removeItem("work");
        await AsyncStorage.removeItem("workType");
        setSelectedTask(null);
      } else {
        Alert.alert("Error when complete extra work", response.message);
      }
    }
  };
  const handleClose = async () => {
    setChoose(false);
    setStop(true);
    await fetchWork();
    if (selectedTask) {
      setSecondsLeft(selectedTask?.timeOfPomodoro * 60);
      setMinutes(selectedTask?.timeOfPomodoro);
    }
    setStop(true);
    setIsPaused(true);
    setPercentage(100);
  };
  useEffect(() => {
    setIsPaused(true);
    if (stop && selectedTask && type === "-") {
      setSecondsLeftDefault(selectedTask.timeOfPomodoro * 60);
      setSecondsLeft(selectedTask.timeOfPomodoro * 60);
      setPercentage(100);
    }
    if (type === "+") {
      setSecondsLeft(0);
    }
    if (!selectedTask) {
      resetData();
    }
  }, [selectedTask]);
  return (
    <View style={styles.container}>
      <Image
        style={styles.imageBg}
        source={require("../../images/bg_focus_1.jpg")}
      />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.downButton}>
          <AntDesign
            name="down"
            size={24}
            color="white"
            onPress={() => backtoHome()}
          />
        </TouchableOpacity>

        {/* Section 2: Choose Task */}
        <TouchableOpacity
          onPress={() => setChoose(true)}
          style={styles.taskContainer}
        >
          {!selectedTask && !selectedExtra && <Text>Please Choose a Task</Text>}
          {selectedTask && (
            <TouchableOpacity
              onPress={() => handleDoneWork(selectedTask.id)}
              style={styles.selectedTask}
            >
              <TouchableOpacity
                onPress={() => {}}
                style={styles.circleContainer}
              ></TouchableOpacity>
              <View style={styles.taskDetailsContainer}>
                <View style={styles.taskDetails}>
                  <Text style={styles.workName}>{selectedTask.workName}</Text>
                  <View style={styles.timerIcons}>
                    {selectedTask.numberOfPomodoros !== 0 && (
                      <View style={styles.pomodoroContainer}>
                        <MaterialCommunityIcons
                          name="clock-check"
                          size={14}
                          color="#ff3232"
                        />
                        <Text style={styles.pomodoroText}>
                          {selectedTask.numberOfPomodorosDone}/
                        </Text>
                        <MaterialCommunityIcons
                          name="clock"
                          size={14}
                          color="#ff9999"
                        />
                        <Text style={[styles.pomodoroText, { marginRight: 5 }]}>
                          {selectedTask.numberOfPomodoros}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton}>
                <AntDesign
                  onPress={() => handleCloseTask()}
                  name="closecircleo"
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          {selectedExtra && (
            <TouchableOpacity
              onPress={() => handleDoneExtra(selectedExtra.id)}
              style={styles.selectedTask}
            >
              <TouchableOpacity
                onPress={() => {}}
                style={styles.circleContainer}
              ></TouchableOpacity>
              <View style={styles.taskDetailsContainer}>
                <View style={styles.taskDetails}>
                  <Text style={styles.workName}>
                    {selectedExtra.extraWorkName}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton}>
                <AntDesign
                  onPress={() => handleCloseTask()}
                  name="closecircleo"
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

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
      <ModalSelectWork
        isVisible={choose}
        play={() => {
          handleClose();
        }}
        onClose={() => {
          handleClose();
        }}
      />
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
    alignSelf: "center",
    flex: 0,
  },
  selectedTask: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "75%",
    alignSelf: "center",
    borderRadius: 10,
  },
  circleContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "black",
    alignSelf: "center",
    marginRight: 10,
  },
  taskDetailsContainer: {
    flexDirection: "column",
  },
  taskDetails: {
    flexDirection: "colunm",
    alignItems: "center",
    justifyContent: "space-between",
  },
  workName: {
    fontSize: 18,
    fontWeight: 500,
  },
  timerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  pomodoroContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  pomodoroText: {
    fontSize: 14,
    marginRight: 5,
  },
  closeButton: {
    position: "absolute",
    right: -70,
    top: 5,
  },
});

export default Focus;
