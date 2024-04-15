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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { getAllThemeOfGuest } from "../services/Guest/getDataService";
import { addTheme, getAllThemePREMIUM, markDeleteTheme } from "../services/PREMIUM/ThemeService";
import getRole from "../services/RoleService";
import { UploadAvt } from "../services/Guest/UploadFile";
import ThemeItem from "./ThemeItem";

const ThemeBody = ({navigation}) => {
  const [themeList, setThemeList] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const imageWidth = screenWidth / 2 - 30;
  const imageHeight = imageWidth * 2;

  const fetchData = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      if (theme) {
        const data = JSON.parse(theme);
        setSelectedTheme(data);
      }
    } catch (error) {
      console.log("Error fetching theme from AsyncStorage:", error);
    }
  
    try {
      const role = await getRole();
      if (role && role.role === "PREMIUM") {
        const response = await getAllThemePREMIUM();
        if (response.success) {
          const addThemeItem = {
            id: -1,
            name: "Add Theme",
            icon: "plus-circle",
          };
          const updatedThemeList = [addThemeItem, ...response.message];
          setThemeList(updatedThemeList);
        } else {
          Alert.alert("Error", response.message);
        }
      } else {
        const response = await getAllThemeOfGuest();
        if (response.success) {
          const addThemeItem = {
            id: -1,
            name: "Add Theme",
            icon: "plus-circle",
          };
          const updatedThemeList = [addThemeItem, ...response.message];
          setThemeList(updatedThemeList);
        } else {
          Alert.alert("Error", response.message);
        }
      }
    } catch (error) {
      console.log("Error fetching role or theme:", error);
      Alert.alert("Error", "Failed to fetch themes. Please try again later.");
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  

  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
  };
  const handleDeleteTheme = (theme) => {
    if(theme.statusTheme!=="PREMIUM" && theme?.id !== selectedTheme?.id) {
        Alert.alert(
            "Confirm Action",
            "Do you want to change this theme?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Update", onPress: () => confirmUpdate(theme) },
              { text: "Delete", onPress: () => confirmDelete(theme) },
            ],
            { cancelable: false }
          );
    }
  }
  const confirmUpdate = async() => {

  } 
  const confirmDelete = async (theme) => {
    const response = await markDeleteTheme(theme?.id)
    if(response.success) {
        fetchData()
    }
    else{
        Alert.alert('Error', response.message)
    }
  }

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
      const role = await getRole();
      console.log(role.token)
      if (role) {
        if (role.role === "PREMIUM") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Warning", "Permission denied!");
          } else {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              Alert.prompt(
                "Enter Theme Name",
                null,
                async (text) => {
                  if (text.trim().length > 0) {
                    const file = {
                      uri: result.assets[0].uri,
                      name: `${result.assets[0].fileName}`,
                      type: "image/jpeg",
                    };
                    const response = await UploadAvt(file, "THEME");
                    if (response.success) {
                      const res = await addTheme(text, response.data);
                      if(res.success){
                        fetchData();
                      }
                      else{
                        Alert.alert("Error!", res.message);
                      }
                    } else {
                      Alert.alert("Error!", response.message);
                      if (response.message === "Wrong token") {
                        await AsyncStorage.removeItem("token");
                        navigation.navigate("Login");
                      }
                    }
                  } else {
                    Alert.alert(
                      "Error",
                      "Please enter a valid name for the image!"
                    );
                  }
                },
                "plain-text"
              );
            }
          }
        } else {
          navigation.navigate("PREMIUM");
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Image library launch error:", error);
    }
  };
  return (
    <View style={{ marginHorizontal: 5, marginTop: 40 }}>
      <FlatList
        data={themeList}
        numColumns={2}
        keyExtractor={(item) => item?.id.toString()}
        renderItem={({ item }) => (
          <View>
            {item?.id === -1 ? (
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
                onDelete={() => handleDeleteTheme(item)}
              />
            )}
          </View>
        )}
        ListFooterComponent={<View style={{ height: 150 }} />}
      />
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

export default ThemeBody;
