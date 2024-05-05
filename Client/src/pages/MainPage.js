import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setFocus } from "../slices/focusSlice";
import Navigator from "../routes";
import { Audio } from "expo-av";
import { CreatePomodoro } from "../services/Guest/PomodoroService";

const MainPage = () => {
  const dispatch = useDispatch();
  const {
    isStop,
    isPause,
    workName,
    secondsLeft,
    mode,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    breakAfter,
    autoStartPo,
    autoStartBreak,
    disableBreakTime,
    type,
    startTime,
    workMode,
    workId,
    extraWorkId,
    countWork,
    extraWorkName,
  } = useSelector((state) => state.focus);

  const soundObjectRef = useRef(null); 
  const playSound = async (uri) => {
    try {
      stopSound(); 
      const newSoundObject = new Audio.Sound();
      await newSoundObject.loadAsync({ uri: uri });
      await newSoundObject.playAsync();
      newSoundObject.setIsLoopingAsync(true);
      soundObjectRef.current = newSoundObject; 
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  };

  const playSoundWithLimit = async (uri, limit) => {
    try {
      stopSound();
      const newSoundObject = new Audio.Sound();
      await newSoundObject.loadAsync({ uri: uri });
      await newSoundObject.playAsync();
      setTimeout(async () => {
        await newSoundObject.stopAsync();
        soundObjectRef.current = null; 
      }, limit * 1000);
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  };

  const stopSound = async () => {
    try {
      if (soundObjectRef.current) {
        await soundObjectRef.current.stopAsync();
        soundObjectRef.current = null; 
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

          console.log(
            isStop,
            isPause,
            workName,
            secondsLeft,
            mode,
            pomodoroTime,
            shortBreakTime,
            longBreakTime,
            breakAfter,
            autoStartPo,
            autoStartBreak,
            disableBreakTime,
            type,
            startTime,
            workMode,
            workId,
            extraWorkId,
            countWork,
            extraWorkName
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettingsFromStorage();
    return () => {
      stopSound(); // Dừng âm thanh khi component unmount
    };
  }, [dispatch]);

  useEffect(() => {
    let interval;
    if (!isPause) {
      interval = setInterval(() => {
        if (workMode === "work") {
          playWorkingSound();
          if (mode === "+") {
            dispatch(setFocus({ secondsLeft: secondsLeft + 1 }));
          } else {
            if (secondsLeft === 1) {
              postPomodoro();
              switchMode();
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
    if (!soundObjectRef.current) {
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
        playSoundWithLimit(parse.url, 5);
      } else {
        playSoundWithLimit(
          "https://res.cloudinary.com/dnj5purhu/video/upload/v1702956713/SmartStudyHub/SOUNDDONE/DEFAULT/DefaultBell_vh2hg0.mp3",
          5
        );
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
      } else {
        if (autoStartBreak) {
          newStop = false;
        }
        if (countWork === 0 || countWork % breakAfter !== 0) {
          newSecondsLeft = shortBreakTime * 60;
        } else {
          newSecondsLeft = longBreakTime * 60;
        }
        newCountWork++;
      }
      newMode = "break";
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
      mode: newMode,
      countWork: newCountWork,
    };

    dispatch(setFocus(focusPayload));
  };

  useEffect(() => {
    if (secondsLeft === 0) {
    }
  }, [secondsLeft]);

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