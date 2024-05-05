import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useTimerService from "../hooks/useTimerService";
import { useSelector } from "react-redux";
const { width: screenWidth } = Dimensions.get("window");
const ImageFocus = () => {
  const navigation = useNavigation();
  // const timerService = useTimerService();
const time = useSelector((state) => state.isPlay.value)
  const toPomodoro = () => {
    // timerService.stopTimer();
    navigation.navigate("Focus");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => toPomodoro()}
        style={styles.imageContainer}
      >
        <ImageBackground
          source={require("../images/bg_focus_1.jpg")}
          resizeMode="center"
          style={styles.image}
        >
          <Text
            style={{ color: "white", fontSize: 24 }}
            onPress={() => toPomodoro()}
          >
           {parseInt(time/60) +1}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: screenWidth / 2 - 30,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: 60,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageFocus;
