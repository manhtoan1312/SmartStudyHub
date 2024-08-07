import AsyncStorage from "@react-native-async-storage/async-storage";

const ClearData = async () => {
  try {
    await AsyncStorage.removeItem("secondsLeft");
    await AsyncStorage.removeItem("countWork");
    await AsyncStorage.removeItem("play");
    await AsyncStorage.removeItem("mode");
    await AsyncStorage.removeItem("stop");
    await AsyncStorage.removeItem("startTime");
    await AsyncStorage.removeItem("initialPomodoroTime");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("accountName");
    await AsyncStorage.removeItem("theme");
    await AsyncStorage.removeItem("focusSound");
    await AsyncStorage.removeItem("soundDone");
    await AsyncStorage.removeItem("img");
    await AsyncStorage.removeItem("workType");
    await AsyncStorage.removeItem("settings");
    await AsyncStorage.removeItem("work");

    console.log("AsyncStorage items cleared successfully");
  } catch (error) {
    console.error("Error clearing AsyncStorage items:", error.message);
  }
};

export default ClearData;
