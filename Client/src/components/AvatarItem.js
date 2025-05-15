// ThemeItem.js
import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

const AvtItem = ({ avt, url, navigation , onSelect, onDelete }) => {
  
  const handleChoose = () => {
    onSelect(avt);
  };

  return (
    <Pressable onLongPress={() => onDelete(avt)} onPress={handleChoose}  style={styles.container}>
      <View style={[styles.imageContainer, avt.secureUrl === url && styles.selected]}>
        <ImageBackground
          source={{ uri: avt.secureUrl }}
          resizeMode="cover"
          style={styles.image}
        >
          {avt.secureUrl === url && (
            <View style={styles.checkContainer}>
              <AntDesign name="checkcircle" size={24} color="#e27602" />
            </View>
          )}
        </ImageBackground>
      </View>
    </Pressable>
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
    width:150,
    height:150
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

export default AvtItem;
