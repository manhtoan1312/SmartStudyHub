// ImageFocus.js
import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useTimerService from "../hooks/useTimerService";

const ImageFocus = ({ navigation }) => {
  const timerService = useTimerService();

  

  const toPomodoro = () => {
    timerService.stopTimer();
    navigation.navigate("Focus");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../images/bg_focus_1.jpg")}
        resizeMode="center"
        style={styles.image}
      >
        <Text
          style={{ color: "white", fontSize: 24 }}
          onPress={() => toPomodoro()}
        >
          {timerService.minutesLeft}
        </Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageFocus;
