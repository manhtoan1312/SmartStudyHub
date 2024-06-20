import React, { useEffect } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { registerRootComponent } from "expo";
import MainPage from "./src/pages/MainPage";
import store from "./src/stores";
import * as Link from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfor } from "./src/services/UserService";

const App = () => {
  

  return (
    <Provider store={store}>
      <MainPage />
    </Provider>
  );
};

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
