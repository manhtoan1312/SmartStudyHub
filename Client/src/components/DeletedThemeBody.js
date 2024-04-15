import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
  Pressable,
  ImageBackground,
} from "react-native";
import {
  deleteTheme,
  getAllThemeDelete,
  recoverTheme,
} from "../services/PREMIUM/ThemeService";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import getRole from "../services/RoleService";

const DeletedThemeBody = () => {
  const [themeList, setThemeList] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth / 2 - 30;
  const imageHeight = imageWidth * 2;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllThemeDelete();
      
      if (response.success) {
        setThemeList(response.data);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.log("Error fetching role or theme:", error);
      Alert.alert(
        "Error",
        "Failed to fetch deleted themes. Please try again later."
      );
    }
  };

  const handleDeleteTheme = (item) => {
    Alert.alert("Confirm action", "Do you want delete this theme forever?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => confirmDeleteTheme(item) },
    ]);
  };

  const confirmDeleteTheme = async (item) => {
    const response = await deleteTheme(item?.id);
    if (response.success) {
      fetchData();
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  const handleRecoverTheme = (item) => {
    Alert.alert("Confirm action", "Do you want recover this theme?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => confirmRecoverTheme(item) },
    ]);
  };

  const confirmRecoverTheme = async (item) => {
    const response = await recoverTheme(item?.id);
    if (response.success) {
      fetchData();
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  const renderText = (theme) => {
    if (theme?.statusTheme === "PREMIUM") {
      return (
        <Text style={{ color: "#e27602" }}>
          {theme?.nameTheme}{" "}
          <FontAwesome5 name="crown" size={16} color="#e27602" />
        </Text>
      );
    } else {
      return <Text style={{ color: "#3b3f44" }}>{theme?.nameTheme}</Text>;
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      onLongPress={() => handleDeleteTheme(item)}
      onPress={() => handleRecoverTheme(item)}
      style={styles.container}
    >
      <View style={[styles.imageContainer]}>
        <ImageBackground
          source={{ uri: item?.url }}
          resizeMode="cover"
          style={[
            styles.image,
            { width: imageWidth, height: imageHeight },
          ]}
        ></ImageBackground>
        <View style={styles.bodyText}>{renderText(item)}</View>
      </View>
    </Pressable>
  );

  return (
    <View style={{ marginHorizontal: 5, marginTop: 40 }}>
      <FlatList
        data={themeList}
        numColumns={2}
        keyExtractor={(theme) => theme?.id.toString()}
        renderItem={renderItem}
        ListFooterComponent={<View style={{ height: 150 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:'auto'
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
    justifyContent: "flex-start",
    alignItems: "center",
    height: 30,
    paddingTop: 5,
  },
});

export default DeletedThemeBody;
