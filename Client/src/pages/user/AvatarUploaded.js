// Avt.js
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
import { UploadAvt } from "../../services/Guest/UploadFile";
import * as ImagePicker from "expo-image-picker";
import getRole from "../../services/RoleService";
import { getAvtUploaded, updateInformation } from "../../services/UserService";
import AvtItem from "../../components/AvatarItem";

const AvatarUploaded = ({ route, navigation }) => {
  const [avtList, setAvtList] = useState([]);
  const [selectedAvt, setSelectedAvt] = useState(route.params.infor.imageUrl);
  const infor = route.params.infor;
  const fetchData = async () => {
    try {
      const avt = await AsyncStorage.getItem("img");
      if (avt) {
        console.log(avt)
        setSelectedAvt(avt);
      }
    } catch (e) {
      console.log(e);
    }
    const response = await getAvtUploaded("USER");
    if (response.success) {
      const addAvtItem = {
        id: -1,
        icon: "plus-circle",
      };
      const updatedAvtList = [addAvtItem, ...response.data];
      setAvtList(updatedAvtList);
    } else {
      Alert.alert("Error", response.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectTheme = (avt) => {
    setSelectedAvt(avt.secureUrl);
    updateInfor(avt.secureUrl)
  };

  const handleSaveAvt = async () => {
    try {
      await AsyncStorage.setItem("img", JSON.stringify(selectedAvt));
    } catch (error) {
      console.log(error);
    }
  };

  const updateInfor = async (image) => {
    const response = await updateInformation(
      infor.phoneNumber ? infor.phoneNumber : null,
      infor.firstName,
      infor.lastName,
      infor.address ? infor.address : null,
      infor.dateOfBirth ? infor.dateOfBirth : null,
      infor.country ? infor.country : null,
      image
        ? image
        : "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png",
      infor.roles ? infor.roles : "CUSTOMER"
    );
    if (!response.success) {
      Alert.alert("Change User Information fail", response.message);
    } else {
      await AsyncStorage.setItem("img", String(response.message.imageUrl));
    }
  };

  const handleAddAvt = async () => {
    try {
      const role = getRole();
      if (role) {
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
            const file = {
              uri: result.assets[0].uri,
              name: `${result.assets[0].fileName}`,
              type: "image/jpeg",
            };
            const response = await UploadAvt(file, "USER");
            if (response.success) {
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
        <Text style={styles.headerText}>Avatar Uploaded</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View
        style={{ marginHorizontal: 5, marginTop: 40, alignItems: "center" }}
      >
        <FlatList
          data={avtList}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              {item.id === -1 ? (
                <TouchableOpacity
                  style={[styles.addThemeContainer]}
                  onPress={() => handleAddAvt()}
                >
                  <AntDesign name="pluscircle" size={24} color="#676767" />
                  <Text style={styles.addThemeText}>Upload New Avatar</Text>
                </TouchableOpacity>
              ) : (
                <AvtItem
                  avt={item}
                  url={selectedAvt}
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
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    width: 150,
    height: 150,
  },
});

export default AvatarUploaded;
