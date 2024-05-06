import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width: screenWidth } = Dimensions.get("window");
const ImageFocus = () => {
  const navigation = useNavigation();
  const { secondsLeft } = useSelector((state) => state.focus);
  const [theme, setTheme] = useState(null);
  const toPomodoro = () => {
    navigation.navigate("Focus");
  };
  useEffect(() => {
    const fetchTheme = async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (theme) {
        const parse = JSON.parse(theme);
        setTheme(parse);
      }
    };
    fetchTheme();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => toPomodoro()}
        style={styles.imageContainer}
      >
        <ImageBackground
          source={
            theme ? { uri: theme.url } : require("../images/bg_focus_1.jpg")
          }
          resizeMode="center"
          style={styles.image}
        >
          <Text
            style={{ color: "white", fontSize: 24 }}
            onPress={() => toPomodoro()}
          >
            {parseInt(secondsLeft / 60)}
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
