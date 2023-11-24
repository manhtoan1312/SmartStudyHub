// TimerService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

class TimerService {
  constructor() {
    this.minutesLeft = 0;
    this.isPlay = 0;
    this.secondLeftRef = 25 * 60;
    this.countPomodoro = 0;
    this.intervalRef = null;
    this.navigation = null;
  }

  setFocusStatus() {
    this.stopTimer();
  }

  async startTimer() {
    const seconds = await AsyncStorage.getItem("secondsLeft");
    const play = await AsyncStorage.getItem("play");

    if (seconds) {
      this.secondLeftRef = parseInt(seconds);
      this.minutesLeft = Math.floor(this.secondLeftRef / 60);
    }

    if (play) {
      this.isPlay = parseInt(play);
    }

    if (this.isPlay === 1) {
      this.intervalRef = setInterval(() => {
        if (this.secondLeftRef === 0) {
          this.countPomodoro++;
          this.secondLeftRef = 25 * 60;
        } else {
          console.log(this.secondLeftRef);
          this.minutesLeft = Math.floor(this.secondLeftRef / 60);
          this.secondLeftRef -= 1;
        }
      }, 1000);
    }
  }

  async stopTimer() {
    if (this.isPlay === 1) {
      clearInterval(this.intervalRef);
      await AsyncStorage.setItem("secondsLeft", String(this.secondLeftRef));
      await AsyncStorage.setItem("countPomodoro", String(this.countPomodoro));
      this.isPlay = 0; 
    }
  }

  toggleTimer() {
    if (this.isPlay === 1) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  setNavigation(navigation) {
    this.navigation = navigation;

    useEffect(() => {
      if (!this.navigation) {
        console.error("Navigation object is not available yet");
        return;
      }
    }, [this.navigation]);
  }
}

export default TimerService;
