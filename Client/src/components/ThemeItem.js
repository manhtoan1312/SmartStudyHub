// ThemeItem.js
import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

const ThemeItem = ({ theme, id, navigation , onSelect }) => {
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth / 2 - 30;
  const imageHeight = imageWidth * 2;

  const renderText = () => {
    if (theme.statusTheme === "PREMIUM") {
      return (
        <Text style={{ color: "#e27602" }}>
          {theme.nameTheme}{" "}
          <FontAwesome5 name="crown" size={16} color="#e27602" />
        </Text>
      );
    } else {
      return <Text style={{ color: "#3b3f44" }}>{theme.nameTheme}</Text>;
    }
  };
  const handleChoose = () => {
    onSelect(theme);
  };

  return (
    <TouchableOpacity onPress={handleChoose}  style={styles.container}>
      <View style={[styles.imageContainer, theme.id === id && styles.selected]}>
        <ImageBackground
          source={{ uri: theme.url }}
          resizeMode="cover"
          style={[styles.image, { width: imageWidth, height: imageHeight }]}
        >
          {theme.id === id && (
            <View style={styles.checkContainer}>
              <AntDesign name="checkcircle" size={24} color="#e27602" />
            </View>
          )}
        </ImageBackground>
        <View style={styles.bodyText}>{renderText()}</View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "transparent",
    overflow: "hidden",
  },
  selected: {
    borderColor: "orange",
  },
  image: {
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  checkContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    padding: 10,
    borderRadius: 50,
  },
  bodyText: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    height: 30,
    paddingTop: 5,
  },
});

export default ThemeItem;
