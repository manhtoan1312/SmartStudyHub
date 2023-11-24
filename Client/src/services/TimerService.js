// TimerService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const useTimerService = () => {
  let minutesLeft = 0;
  let isPlay = 0;
  let secondLeftRef = 25 * 60;
  let countPomodoro = 0;
  let intervalRef = null;

  const navigation = useNavigation();

  const setFocusStatus = (focusStatus) => {};

  const startTimer = async () => {
    const seconds = await AsyncStorage.getItem("secondsLeft");
    const play = await AsyncStorage.getItem("play");

    if (seconds) {
      secondLeftRef = parseInt(seconds);
      minutesLeft = Math.floor(secondLeftRef / 60);
    }

    if (play) {
      isPlay = parseInt(play);
    }

    if (isPlay === 1) {
      intervalRef = setInterval(() => {
        if (secondLeftRef === 0) {
          countPomodoro++;
          secondLeftRef = 25 * 60;
        } else {
          console.log(secondLeftRef);
          minutesLeft = Math.floor(secondLeftRef / 60);
          secondLeftRef -= 1;
        }
      }, 1000);
    }
  };

  const stopTimer = async () => {
    if (isPlay === 1) {
      clearInterval(intervalRef);
      await AsyncStorage.setItem("secondsLeft", String(secondLeftRef));
      await AsyncStorage.setItem("countPomodoro", String(countPomodoro));
    }
  };

  const toggleTimer = () => {
    if (isPlay === 1) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  useEffect(() => {
    if (!navigation) {
      console.error("Navigation object is not available yet");
      return;
    }

  }, [navigation]);

  return {
    startTimer,
    stopTimer,
    toggleTimer,
    setFocusStatus,
    get minutesLeft() {
      return minutesLeft;
    },
  };
};

export default useTimerService;
