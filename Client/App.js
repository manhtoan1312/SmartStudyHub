import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { registerRootComponent } from "expo";
import MainPage from "./src/pages/MainPage";
import store from "./src/stores";
import * as Linking from "expo-linking";

const App = () => {
  useEffect(() => {
    const handleDeepLink =async (event) => {
      const { url } = event;
      const parsedUrl = Linking.parse(url);
      console.log(parsedUrl);
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

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
