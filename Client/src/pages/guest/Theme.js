// Theme.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { getAllThemeOfGuest } from "../../services/Guest/getDataService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemeItem from "../../components/ThemeItem";
import { UploadAvt } from "../../services/Guest/UploadFile";
import * as ImagePicker from "expo-image-picker";
import getRole from "../../services/RoleService";
import { getAllThemePrenium } from "../../services/Prenium/ThemeService";

const Theme = ({ navigation }) => {
  const [themeList, setThemeList] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const imageWidth = screenWidth / 2 - 30;
  const imageHeight = imageWidth * 2;
  const fetchData = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      if (theme) {
        const data = JSON.parse(theme);
        setSelectedTheme(data);
      }
    } catch (e) {
      console.log(e);
    }
    const role = getRole();
    let response;
    if (role?.role === "PRENIUM") {
      response = await getAllThemePrenium();
    } else {
      response = await getAllThemeOfGuest();
    }
    if (response.success) {
      const addThemeItem = {
        id: -1,
        name: "Add Theme",
        icon: "plus-circle",
      };
      const updatedThemeList = [addThemeItem, ...response.data];
      setThemeList(updatedThemeList);
    } else {
      Alert.alert("Error", response.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
  };

  const handleSaveThemeToStorage = async () => {
    try {
      await AsyncStorage.setItem("theme", JSON.stringify(selectedTheme));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedTheme) {
        handleSaveThemeToStorage();
      }
    };
  }, [selectedTheme]);

  const handleAddTheme = async () => {
    try {
      const role = getRole();
      if (role) {
        if (role.role === "PRENIUM") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Warning", "Permission denied!");
          } else {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [screenWidth, screenHeight],
              quality: 1,
            });

            if (!result.canceled) {
              const file = {
                uri: result.assets[0].uri,
                name: `${result.assets[0].fileName}`,
                type: "image/jpeg",
              };
              const response = await UploadAvt(file, "THEME");
              if (response.success) {
                console.log(response);
                fetchData();
              } else {
                Alert.alert("Error!", response.message);
                if (response.message === "Wrong token") {
                  await AsyncStorage.removeItem("token");
                  navigation.navigate("Login");
                }
              }
            }
          }
        } else {
          navigation.navigate("Prenium");
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Image library launch error:", error);
    }
  };
  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Theme</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={{ marginHorizontal: 5, marginTop: 40 }}>
        <FlatList
          data={themeList}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              {item.id === -1 ? (
                <TouchableOpacity
                  style={[
                    styles.addThemeContainer,
                    { width: imageWidth, height: imageHeight },
                  ]}
                  onPress={() => handleAddTheme()}
                >
                  <AntDesign name="pluscircle" size={24} color="#676767" />
                  <Text style={styles.addThemeText}>{item.name}</Text>
                </TouchableOpacity>
              ) : (
                <ThemeItem
                  theme={item}
                  id={selectedTheme?.id ? selectedTheme?.id : 1}
                  navigation={navigation}
                  onSelect={() => handleSelectTheme(item)}
                />
              )}
            </View>
          )}
          ListFooterComponent={<View style={{ height: 150 }} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 18,
  },
  addThemeText: {
    marginTop: 10,
    fontSize: 16,
    color: "#3b3f44",
  },
  addThemeContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
});

export default Theme;
