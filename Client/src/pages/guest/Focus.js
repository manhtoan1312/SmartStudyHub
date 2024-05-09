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
import { useNavigation } from "@react-navigation/native";
import ControlButtons from "../../components/ControlButton";
import ModalSelectWork from "../../components/ModalSelectWork";
import { ExtraMarkCompleted } from "../../services/Guest/ExtraWork";
import { MarkCompleted } from "../../services/Guest/WorkService";
import { useDispatch, useSelector } from "react-redux";
import { setFocus } from "../../slices/focusSlice";
import ModalSelectSound from "../../components/ModalSelectSound";
const { width, height } = Dimensions.get("screen");

const Focus = () => {
  const navigation = useNavigation();
  const [choose, setChoose] = useState(false);
  const [percentage, setPercentage] = useState(100);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSoundVisible, setSoundVisible] = useState(false)
  const dispatch = useDispatch();
  const {
    isStop,
    isPause,
    workName,
    secondsLeft,
    mode,
    pomodoroTime,
    workMode,
    workId,
    extraWorkId,
    extraWorkName,
    defaultTimePomodoro,
    numberOfPomodoro,
    numberOfPomodorosDone,
  } = useSelector((state) => state.focus);
  const [selectedMode, setSelectedMode] = useState(mode);
  const [theme, setTheme] = useState(null);

  const timerModeOptions = [
    {
      key: "-",
      label: `countdown from ${String(
        workId ? pomodoroTime : defaultTimePomodoro
      ).padStart(2, "0")}:00 until the end.`,
    },
    {
      key: "+",
      label: `start timing from 00:00 until I turn it off (manually turn it off).`,
    },
  ];
  useEffect(() => {
    const fetchTheme = async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (theme) {
        const parse = JSON.parse(theme);
        setTheme(parse);
      }
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    if (mode === "-") {
      const percent =
        (secondsLeft / ((workId ? pomodoroTime : defaultTimePomodoro) * 60)) *
        100;
      setPercentage(percent);
    }
  }, [secondsLeft]);

  const startFocus = () => {
    if (isStop) {
      dispatch(setFocus({ isPause: false, isStop: false }));
    } else {
      dispatch(setFocus({ isPause: !isPause }));
    }
  };

  const handleCloseTask = async () => {
    dispatch(
      setFocus({
        workId: null,
        workName: null,
        extraWorkId: null,
        extraWorkName: null,
        numberOfPomodoro: null,
        numberOfPomodorosDone: null,
        secondsLeft: defaultTimePomodoro * 60,
        pomodoroTime: defaultTimePomodoro,
      })
    );
  };

  const handleStop = async () => {
    if (workMode === "work") {
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
      dispatch(
        setFocus({
          isPause: true,
          isStop: true,
          secondsLeft: (workId ? pomodoroTime : defaultTimePomodoro) * 60,
          workMode: "work",
        })
      );
    }
  };

  const stopPo = async () => {
    dispatch(
      setFocus({
        isPause: true,
        isStop: true,
        secondsLeft: (workId ? pomodoroTime : defaultTimePomodoro) * 60,
      })
    );
  };
  const openTimerModeModal = () => {
    if (!isPause || !isStop) {
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

  const backtoHome = async () => {
    navigation.goBack();
  };

  const handleDoneExtra = async () => {
    const response = await ExtraMarkCompleted(extraWorkId);
    if (response.success) {
      dispatch(
        setFocus({
          extraWorkId: null,
          extraWorkName: null,
        })
      );
    } else {
      Alert.alert("Error when complete extra work", response.message);
    }
  };
  const handleDoneWork = async () => {
    if (workId) {
      const response = await MarkCompleted(workId);
      if (response.success) {
        dispatch(
          setFocus({
            workId: null,
            workName: null,
            pomodoroTime: defaultTimePomodoro,
          })
        );
      } else {
        Alert.alert("Error when complete work", response.message);
      }
    } else {
      const response = await ExtraMarkCompleted(extraWorkId);
      if (response.success) {
        dispatch(setFocus({ extraWorkId: null, extraWorkName: null }));
      } else {
        Alert.alert("Error when complete extra work", response.message);
      }
    }
  };
  const handleClose = async () => {
    setChoose(false);
  };

  const handleSelectMode = (key) => {
    setSelectedMode(key);
  };

  const handleSubmitMode = () => {
    setModalVisible(false);
    const second =
      selectedMode === "+"
        ? 0
        : (workId ? pomodoroTime : defaultTimePomodoro) * 60;
    setPercentage(100);
    dispatch(setFocus({ mode: selectedMode, secondsLeft: second }));
  };
  const handleOpenSound = () => {
    if(!isPause) {
      Alert.alert('Waring!!', 'You must pause pomodoro before change sound')
    }
    else{
      setSoundVisible(true)
    }
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.imageBg}
        source={
          theme ? { uri: theme.url } : require("../../images/bg_focus_1.jpg")
        }
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
          {!extraWorkId && !workId && <Text>Please Choose a Task</Text>}
          {workId && (
            <View
              style={{ width: 280, flexDirection: "row", alignItems: "center" }}
            >
              <TouchableOpacity style={styles.selectedTask} onPress={() => setChoose(true)}>
                <TouchableOpacity
                  style={{flexDirection: "row"}}
                  onPress={() => handleDoneWork()}
                >
                  <TouchableOpacity
                    onPress={() => {}}
                    style={styles.circleContainer}
                  ></TouchableOpacity>
                  <View style={styles.taskDetailsContainer}>
                    <View style={styles.taskDetails}>
                      <Text style={styles.workName}>{workName}</Text>
                      <View style={styles.timerIcons}>
                        {numberOfPomodoro !== 0 && (
                          <View style={styles.pomodoroContainer}>
                            <MaterialCommunityIcons
                              name="clock-check"
                              size={14}
                              color="#ff3232"
                            />
                            <Text style={styles.pomodoroText}>
                              {numberOfPomodorosDone}/
                            </Text>
                            <MaterialCommunityIcons
                              name="clock"
                              size={14}
                              color="#ff9999"
                            />
                            <Text
                              style={[styles.pomodoroText, { marginRight: 5 }]}
                            >
                              {numberOfPomodoro}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleCloseTask()}
              >
                <AntDesign name="closecircleo" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          )}
          {extraWorkId && !workId && (
            <View
              style={{ width: 280, flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.selectedTask} onPress={() => setChoose(true)}>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => handleDoneExtra()}
                >
                  <TouchableOpacity
                    onPress={() => {}}
                    style={styles.circleContainer}
                  ></TouchableOpacity>
                  <View style={styles.taskDetailsContainer}>
                    <View style={styles.taskDetails}>
                      <Text style={styles.workName}>{extraWorkName}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleCloseTask()}
              >
                <AntDesign name="closecircleo" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* Section 3: Progress and Control Buttons */}
        <View>
          <CircularProgress
            style={styles.circularProgress}
            size={200}
            width={15}
            fill={percentage}
            tintColor={workMode === "work" ? "red" : "green"}
            backgroundColor="rgba(255, 255, 255, 0.2)"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <Text style={styles.progressText}>
                {String(parseInt(secondsLeft / 60)).padStart(2, "0")}:
                {String(parseInt(secondsLeft % 60)).padStart(2, "0")}
              </Text>
            )}
          </CircularProgress>
          <ControlButtons
            isPaused={isPause}
            handleStop={handleStop}
            startFocus={startFocus}
            mode={workMode}
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
            {mode === null && (
              <MaterialIcons name="timer" size={20} color="white" />
            )}
            {mode === "-" && (
              <Ionicons name="hourglass-outline" size={20} color="white" />
            )}
            {mode === "+" && (
              <FontAwesome5 name="hourglass-start" size={20} color="white" />
            )}
            <View style={styles.textMode}>
              <Text style={{ color: "white", fontSize: 10 }}>Timer Mode</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('FullScreen')} style={styles.settingsIcon}>
            <Octicons name="screen-full" size={20} color="white" />
            <View style={styles.textMode}>
              <Text style={{ color: "white", fontSize: 10 }}>Full Screen</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenSound} style={styles.settingsIcon}>
            <FontAwesome5 name="itunes-note" size={20} color="white" />
            <View style={{ marginTop: 5 }}>
              <Text style={{ color: "white", fontSize: 10 }}>Sound</Text>
            </View>
          </TouchableOpacity>
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
                    option.key === selectedMode && {
                      backgroundColor: "#FFC0CB",
                    },
                  ]}
                  onPress={() => handleSelectMode(option.key)}
                >
                  <Text style={styles.timerModeText}>{option.label}</Text>
                  {option.key === selectedMode && (
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
                  onPress={() => handleSubmitMode(false)}
                >
                  <Text style={styles.buttonText}>Ok</Text>
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
      <ModalSelectSound 
      visible={isSoundVisible}
      onClose={() => setSoundVisible(false)}
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
    paddingHorizontal: 35,
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
    marginLeft: 40,
  },
});

export default Focus;
