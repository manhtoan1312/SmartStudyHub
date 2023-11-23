import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Focus = () => {
  const [minutesLeft, setMinutesLeft] = useState(0);
  let isPlay = true;
  let secondLeft = 0;
  let countPomodoro = 0;
  useEffect(() => {
    const getData = async() => {
        const play = await AsyncStorage.getItem("play");
        const seconds = await AsyncStorage.getItem("secondsLeft");
        const count = await AsyncStorage.getItem("countPomodoro");

        if (seconds) {
            secondLeft = parseInt(seconds);
          }
          if (play) {
            isPlay = play;
          }
          if(count){
            countPomodoro =count
          }
    }
    getData()
    if (isPlay) {
        interval = setInterval(() => {
          if (secondLeft === 0) {
            countPomodoro++;
            secondLeft = 25*60
          }
          secondLeft--;
        }, 1000);
      }

      return (async () => {
        await AsyncStorage.setItem("secondsLeft", String(secondLeft));
        await AsyncStorage.setItem("countPomodoro", String(countPomodoro));

        clearInterval(interval)
      });
  },[])

  useEffect(() => {
    setMinutesLeft(Math.floor(secondLeft / 60));
  }, [secondLeft]);

  return (
    <View>
      <View>
        <ImageBackground
          source={require("../../images/bg_focus_1.jpg")}
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
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 0,
    right: "-50%",
  },
});

export default Focus