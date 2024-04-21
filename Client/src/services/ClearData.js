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
    console.log("AsyncStorage items cleared successfully");
  } catch (error) {
    console.error("Error clearing AsyncStorage items:", error.message);
  }
};

export default ClearData;