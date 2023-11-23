import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ImageFocus = ({ navigation }) => {
  const [minutesLeft, setMinutesLeft] = useState(0);
  const secondLeftRef = useRef(25 * 60);
  let isPlay = true;
  
  let countPomodoro = 0;
  let interval;
  useEffect(() => {
    const getData = async () => {
      const play = await AsyncStorage.getItem("play");
      const seconds = await AsyncStorage.getItem("secondsLeft");
      const count = await AsyncStorage.getItem("countPomodoro");

      if (seconds) {
        secondLeftRef.current = parseInt(seconds);
        setMinutesLeft(Math.floor(secondLeftRef.current / 60));
      }
      if (play) {
        isPlay = play;
      }
      if (count) {
        countPomodoro = count;
      }
    };
    getData();

    if (isPlay) {
      interval = setInterval(() => {
        if (secondLeftRef.current === 0) {
          countPomodoro++;
          secondLeftRef.current = 25 * 60;
        } else {
          setMinutesLeft(Math.floor(secondLeftRef.current / 60));
          secondLeftRef.current -= 1;
        }
      }, 1000);

      return async () => {
        await AsyncStorage.setItem("secondsLeft", String(secondLeftRef.current));
        await AsyncStorage.setItem("countPomodoro", String(countPomodoro));

        clearInterval(interval);
      };
    }
  }, []);



  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../images/bg_focus_1.jpg")}
        resizeMode="center"
        style={styles.image}
      >
        <Text
          style={{ color: "white", fontSize: 24 }}
          onPress={() => navigation.navigate("Focus")}
        >
          {minutesLeft}
        </Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
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
