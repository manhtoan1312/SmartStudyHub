import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
import { SafeAreaView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./src/stores";
import { Provider, useSelector } from "react-redux";
import { Audio } from "expo-av";
import MainPage from "./src/pages/MainPage";

const App = () => {
  // const isPlay = useSelector((state) => state.isPlay.value);
  // useEffect(() => {
  //   let isPlayValue = isPlay;
  //   const playSound = async () => {
  //     const focusSound = await AsyncStorage.getItem("focusSound");
  //     const parse = JSON.parse(focusSound);
  //     if (parse && isPlayValue) {
  //       const { sound } = await Audio.Sound.createAsync(
  //         { uri: parse.url },
  //         { isLooping: true }
  //       );
  //       sound.playAsync();
  //     }
  //   };
  //   const stopSound = async () => {
  //     const focusSound = await AsyncStorage.getItem("focusSound");
  //     const parse = JSON.parse(focusSound);
  //     if (parse && !isPlayValue) {
  //       const { sound } = await Audio.Sound.createAsync({ uri: parse.url });
  //       sound.stopAsync();
  //     }
  //   };
  //   playSound();
  //   if (isPlay !== isPlayValue) {
  //     isPlayValue = isPlay;
  //     if (!isPlayValue) {
  //       stopSound();
  //     }
  //   }
  // }, [isPlay]);
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
});

export default App;
