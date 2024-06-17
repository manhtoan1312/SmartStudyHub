import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Provider } from "react-redux";
import { registerRootComponent } from "expo";
import MainPage from "./src/pages/MainPage";
import store from "./src/stores";
import * as Linking from "expo-linking"
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  // const url = Linking.makeUrl('/')
  // const linking={
  //   prefixes:[url]
  // }
  return (
    <Provider store={store}>
      <MainPage />
    </Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (!Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
  },
});

export default App;

registerRootComponent(App);
