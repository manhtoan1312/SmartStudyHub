import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { registerRootComponent } from "expo";
import MainPage from "./src/pages/MainPage";
import store from "./src/stores";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  // useEffect(() => {
  //   const handleDeepLink = async (event) => {
  //     const { url } = event;
  //     const parsedUrl = Linking.parse(url);
  //     const { hostname, queryParams } = parsedUrl;
  //     const excludeUrl = {
  //       hostname: "smartstudyhub-manhtoan1312-8081.exp.direct",
  //       queryParams: {
  //         status: "SUCCESS",
  //         transactionPaymentId: "5",
  //       },
  //     };
  //     const isExcludedUrl = (parsedUrl, excludeUrl) => {
  //       return (
  //         parsedUrl.hostname === excludeUrl.hostname &&
  //         parsedUrl.queryParams.status === excludeUrl.queryParams.status &&
  //         parsedUrl.queryParams.transactionPaymentId ===
  //           excludeUrl.queryParams.transactionPaymentId
  //       );
  //     };
  //     if (queryParams.token && !isExcludedUrl(parsedUrl, excludeUrl)) {
  //       try {
  //         await AsyncStorage.setItem("token", queryParams.token);
  //         console.log("Token saved to AsyncStorage:", queryParams.token);
  //       } catch (error) {
  //         console.error("Failed to save token to AsyncStorage:", error);
  //       }
  //     } else {
  //       console.log("Token not found or URL is excluded.");
  //     }
  //   };

  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       handleDeepLink({ url });
  //     }
  //   });
  //   const subscription = Linking.addEventListener("url", handleDeepLink);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

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
