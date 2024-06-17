import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setFocus } from "../slices/focusSlice";
import Navigator from "../routes";
import { Audio } from "expo-av";
import { CreatePomodoro } from "../services/Guest/PomodoroService";
import getRole from "../services/RoleService";
import { UpdateTimeLastUse } from "../services/GuestService";
import { CheckStatusDevice, CreateOrUpdateDevice } from "../services/PREMIUM/DevicesService";
import ClearData from "../services/ClearData";

const MainPage = () => {
  const dispatch = useDispatch();
  const {
    isStop,
    isPause,
    secondsLeft,
    mode,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    breakAfter,
    autoStartPo,
    autoStartBreak,
    disableBreakTime,
    startTime,
    workMode,
    workId,
    extraWorkId,
    countWork,
    defaultTimePomodoro,
    numberOfPomodoro,
    numberOfPomodorosDone,
  } = useSelector((state) => state.focus);

  const soundObjectRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async (uri) => {
    if (isPlaying) return;

    try {
      setIsPlaying(true);
      await stopSound();
      const newSoundObject = new Audio.Sound();
      await newSoundObject.loadAsync({ uri: uri });
      await newSoundObject.playAsync();
      newSoundObject.setIsLoopingAsync(true);
      soundObjectRef.current = newSoundObject;
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  };

  const playSoundWithLimit = async (uri, limit, isLocal = true) => {
    try {
      await stopSound();
      setIsPlaying(true);
      const newSoundObject = new Audio.Sound();
      if (isLocal) {
        await newSoundObject.loadAsync(require("../sound/Done.mp3"));
      } else {
        await newSoundObject.loadAsync({ uri: uri });
      }
      await newSoundObject.playAsync();
      setTimeout(async () => {
        await newSoundObject.stopAsync();
        await newSoundObject.unloadAsync();
        soundObjectRef.current = null;
        setIsPlaying(false);
      }, limit * 1000);
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  };

  const stopSound = async () => {
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync();
        await soundObjectRef.current.unloadAsync();
        soundObjectRef.current = null;
        setIsPlaying(false);
      }
    } catch (error) {
      console.log("Error stopping sound: ", error);
    }
  };

  useEffect(() => {
    const fetchSettingsFromStorage = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem("settings");
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          dispatch(setFocus(parsedSettings));
          dispatch(
            setFocus({
              defaultTimePomodoro: parsedSettings.pomodoroTime,
              secondsLeft: parsedSettings.pomodoroTime * 60,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettingsFromStorage();
    return () => {
      stopSound();
    };
  }, [dispatch]);

  useEffect(() => {
    let interval;
    if (!isPause) {
      interval = setInterval(async () => {
        if (workMode === "work") {
          await playWorkingSound();
          if (mode === "+") {
            dispatch(setFocus({ secondsLeft: secondsLeft + 1 }));
            if (
              secondsLeft ===
              (workId ? pomodoroTime * 60 : defaultTimePomodoro * 60)
            ) {
              postPomodoro();
              dispatch(
                setFocus({ numberOfPomodorosDone: numberOfPomodorosDone + 1 })
              );
              if (!workId && extraWorkId) {
                dispatch(setFocus({ numberOfPomodoro: numberOfPomodoro + 1 }));
              }
            }
          } else {
            if (secondsLeft === 1) {
              postPomodoro();
              switchMode();
              dispatch(
                setFocus({ numberOfPomodorosDone: numberOfPomodorosDone + 1 })
              );
              if (!workId && extraWorkId) {
                dispatch(setFocus({ numberOfPomodoro: numberOfPomodoro + 1 }));
              }
            } else {
              dispatch(setFocus({ secondsLeft: secondsLeft - 1 }));
            }
          }
        } else {
          if (secondsLeft === 1) {
            switchMode();
          } else {
            dispatch(setFocus({ secondsLeft: secondsLeft - 1 }));
          }
        }
      }, 1000);
    } else {
      stopSound();
    }

    return () => clearInterval(interval);
  }, [isPause, isStop, secondsLeft, mode, dispatch]);

  const playWorkingSound = async () => {
    if (!soundObjectRef.current && !isPlaying) {
      const sound = await AsyncStorage.getItem("focusSound");
      if (sound) {
        const parse = JSON.parse(sound);
        playSound(parse.url);
      }
    }
  };

  const postPomodoro = async () => {
    const endTime = new Date().getTime();
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const response = await CreatePomodoro(
      id,
      workId,
      extraWorkId,
      workId ? pomodoroTime : defaultTimePomodoro,
      startTime,
      endTime
    );
    if (response.success) {
      const sound = await AsyncStorage.getItem("soundDone");
      if (sound) {
        const parse = JSON.parse(sound);
        playSoundWithLimit(parse.url, 2);
      } else {
        playSoundWithLimit(null, 2, false);
      }
    } else {
      Alert.alert("Create Pomodoro fail!", response.message);
    }
  };

  const switchMode = () => {
    let newSecondsLeft = null;
    let newMode = null;
    let newCountWork = countWork;
    let newStop = true;
    if (workMode === "work") {
      if (disableBreakTime) {
        newSecondsLeft = workId ? pomodoroTime * 60 : defaultTimePomodoro * 60;
        if (autoStartPo) {
          newStop = false;
        }
        newMode = "work";
      } else {
        if (autoStartBreak) {
          newStop = false;
        }
        if (countWork === 0 || countWork % breakAfter !== 0) {
          newSecondsLeft = shortBreakTime * 60;
          newMode = "shortBreak";
        } else {
          newSecondsLeft = longBreakTime * 60;
          newMode = "longBreak";
        }
        newCountWork++;
      }
    } else {
      if (autoStartPo) {
        newStop = false;
      }
      newSecondsLeft = workId ? pomodoroTime * 60 : defaultTimePomodoro * 60;
      newMode = "work";
    }
    const focusPayload = {
      isPause: newStop,
      isStop: newStop,
      secondsLeft: newSecondsLeft,
      workMode: newMode,
      countWork: newCountWork,
    };
    dispatch(setFocus(focusPayload));
  };

  useEffect(() => {
    const updateTime = async () => {
      const role = await getRole();
      const id = await AsyncStorage.getItem("id");
      if (!role && id) {
        const response = await UpdateTimeLastUse();
        if (!response.success) {
          console.log("Error update time last use, message:", response.message);
        }
      }
      if (role && role.role === "PREMIUM") {
        const response = await CheckStatusDevice();
        console.log(response)
        if (!response.success) {
          ClearData()
        }else{

        }
      }
    };
    updateTime();
  }, []);
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Navigator />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainPage;
