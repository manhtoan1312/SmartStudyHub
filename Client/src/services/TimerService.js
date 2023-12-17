import AsyncStorage from "@react-native-async-storage/async-storage";

class TimerService {
  constructor() {
    this.minutesLeft = 25;
    this.isPlay = 0;
    this.secondLeftRef = 25 * 60;
    this.countPomodoro = 0;
    this.intervalRef = null;
    this.navigation = null;
    this.mode = "-";
  }

  setFocusStatus() {
    this.stopTimer();
  }

  async startTimer() {
    const seconds = await AsyncStorage.getItem("secondsLeft");
    const play = await AsyncStorage.getItem("play");
    const mode = await AsyncStorage.getItem("mode");
    const settings = await AsyncStorage.getItem('settings')
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

    if (this.isPlay === 1) {
      this.intervalRef = setInterval(() => {
        if (this.secondLeftRef === 0) {
          this.countPomodoro =
            this.countPomodoro + 1;
          this.secondLeftRef =
            this.mode === "-" ? settings.timePomodoro * 60 : 0;
        } else {
          this.minutesLeft = Math.floor(this.secondLeftRef / 60);
          this.secondLeftRef =
            this.mode === "+" ? this.secondLeftRef + 1 : this.secondLeftRef - 1;
        }
      }, 1000);
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

  async loadFromAsyncStorage() {
    try {
      const minutesLeft = await AsyncStorage.getItem("minutesLeft");
      const countPomodoro = await AsyncStorage.getItem("countPomodoro");
      const mode = await AsyncStorage.getItem("mode");

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
