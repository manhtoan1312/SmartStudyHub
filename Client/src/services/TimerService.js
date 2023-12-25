import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreatePomodoro } from "./Guest/PomodoroService";
import { Audio } from "expo-av";

class TimerService {
  constructor() {
    this.minutesLeft = 25;
    this.isPlay = 0;
    this.secondLeftRef = 25 * 60;
    this.countPomodoro = 0;
    this.intervalRef = null;
    this.navigation = null;
    this.mode = "-";
    this.pomodorotime = 25;
  }

  setFocusStatus() {
    this.stopTimer();
  }

  async startTimer() {
    const seconds = await AsyncStorage.getItem("secondsLeft");
    const play = await AsyncStorage.getItem("play");
    const mode = await AsyncStorage.getItem("mode");
    const settings = await this.getSettings();

    if (seconds) {
      this.secondLeftRef = parseInt(seconds);
      this.minutesLeft = Math.floor(this.secondLeftRef / 60);
    }

    if (mode) {
      this.mode = mode;
    }

    if (play) {
      this.isPlay = parseInt(play);
    }
    if (settings) {
      this.pomodorotime = settings.pomodoroTime;
    }
    if (this.isPlay === 1) {
      this.intervalRef = setInterval(() => {
        if (this.secondLeftRef === 0 && this.mode === "-") {
          this.postPomodoro();
          this.countPomodoro = this.countPomodoro + 1;
          this.secondLeftRef = this.pomodorotime * 60;
        } else {
          this.minutesLeft = Math.floor(this.secondLeftRef / 60);
          this.secondLeftRef =
            this.mode === "+" ? this.secondLeftRef + 1 : this.secondLeftRef - 1;
        }
        console.log(this.secondLeftRef);
      }, 1000);
    }
  }

  async postPomodoro() {
    const work = await AsyncStorage.getItem("work");
    const type = await AsyncStorage.getItem("workType");
    const id = await AsyncStorage.getItem("id");
    const startTime = await AsyncStorage.getItem("startTime");
    const endTime = new Date().getTime();

    let workid = null;
    let timePo = this.pomodorotime;
    let extraId = null;
    if (work) {
      const parseWork = JSON.parse(work);
      if (type === "WORK") {
        workid = parseWork.id;
        timePo = parseWork.timeOfPomodoro;
      } else {
        extraId = parseWork.id;
      }
    }
    const response = await CreatePomodoro(
      id,
      workid,
      extraId,
      timePo,
      startTime,
      endTime
    );
    console.log(id, workid, extraId, timePo, parseInt(startTime), endTime);
    if (!response.success) {
      Alert.alert("Error!!", response.message);
    } else {
      this.playSound();
      console.log(response.data);
      await AsyncStorage.setItem("startTime", new Date().getTime().toString());
    }
  }
  async getSettings() {
    try {
      const storedSettings = await AsyncStorage.getItem("settings");
      return storedSettings ? JSON.parse(storedSettings) : null;
    } catch (error) {
      console.error("Error fetching settings from AsyncStorage:", error);
      return null;
    }
  }
  async playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../sound/DefaultBell.mp3")
    );
    await sound.playAsync();
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
    this.loadFromAsyncStorage();
    if (this.isPlay === 1) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  async loadFromAsyncStorage() {
    try {
      const minutesLeft = await AsyncStorage.getItem("minutesLeft");
      const countPomodoro = await AsyncStorage.getItem("countPomodoro");
      const mode = await AsyncStorage.getItem("mode");
      const storedSettings = await AsyncStorage.getItem("settings");
      if (storedSettings) {
        const setting = JSON.parse(storedSettings);
        this.timeOfPomodoro = setting.pomodoroTime;
      }
      if (minutesLeft) {
        this.minutesLeft = parseInt(minutesLeft);
        this.secondLeftRef = this.minutesLeft * 60;
      }

      if (countPomodoro) {
        this.countPomodoro = parseInt(countPomodoro);
      }

      if (mode) {
        this.mode = mode;
      }
    } catch (error) {
      console.error("Error loading data from AsyncStorage:", error);
    }
  }

  async saveToAsyncStorage() {
    try {
      await AsyncStorage.setItem("minutesLeft", String(this.minutesLeft));
      await AsyncStorage.setItem("countPomodoro", String(this.countPomodoro));
      await AsyncStorage.setItem("mode", this.mode);
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  }
}

export default TimerService;
