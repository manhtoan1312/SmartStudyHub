// Avt.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {
  deleteAvtUploaded,
  deleteCompletelyAvt,
  deleteCurrentAvatar,
  getAvtUploaded,
  updateInformation,
} from "../services/UserService";
import getRole from "../services/RoleService";
import AvtItem from "./AvatarItem";
import { UploadAvt } from "../services/Guest/UploadFile";

const AvatarList = ({ information, navigation }) => {
  const [avtList, setAvtList] = useState([]);
  const [selectedAvt, setSelectedAvt] = useState(information.imageUrl);
  const infor = information;
  const fetchData = async () => {
    try {
      const avt = await AsyncStorage.getItem("img");
      if (avt) {
        setSelectedAvt(avt);
      }
    } catch (e) {
      console.log(e);
    }
    getData();
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getData = async () => {
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
  const handleSelectAvatar = (avt) => {
    setSelectedAvt(avt.secureUrl);
    updateInfor(avt.secureUrl);
  };

  const handleDeleteAvatar = (avt) => {
    if (avt.type !== "DEFAULT" && avt.secureUrl !== selectedAvt) {
      Alert.alert(
        "Confirm Action",
        "Do you want to delete this image?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => confirmDelete(avt) },
        ],
        { cancelable: false }
      );
    } else if (avt.type !== "DEFAULT" && avt.secureUrl === selectedAvt) {
      Alert.alert(
        "Confirm Action",
        "Do you want to delete your current avatar?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => confirmDeleteAvt() },
        ],
        { cancelable: false }
      );
    }
  };

  const confirmDeleteAvt = async () => {
    const response = await deleteCurrentAvatar();
    if (response.success) {
      await AsyncStorage.setItem("img", response.data.imageUrl);
      setSelectedAvt(response.data.imageUrl);
    } else {
      Alert.alert("Error", response.message);
    }
  };

  const confirmDelete = async (image) => {
    const response = await deleteCompletelyAvt(image.id);
    if (response.success) {
      getData();
    } else {
      Alert.alert("Error", response.message);
    }
  };

  const updateInfor = async (image) => {
    const role = await getRole();
    const response = await updateInformation(
      infor.phoneNumber ? infor.phoneNumber : null,
      infor.firstName,
      infor.lastName,
      infor.address ? infor.address : null,
      infor.dateOfBirth ? infor.dateOfBirth : null,
      infor.country ? infor.country : null,
      image
        ? image
        : "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png"
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
              setSelectedAvt(response.data);
              await updateInfor(response.data);
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
    <FlatList
      data={avtList}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          {item.id === -1 ? (
            <TouchableOpacity
              style={[styles.addAvatarContainer]}
              onPress={() => handleAddAvt()}
            >
              <AntDesign name="pluscircle" size={24} color="#676767" />
              <Text style={styles.addAvatarText}>Upload New Avatar</Text>
            </TouchableOpacity>
          ) : (
            <AvtItem
              avt={item}
              url={selectedAvt}
              navigation={navigation}
              onSelect={() => handleSelectAvatar(item)}
              onDelete={() => handleDeleteAvatar(item)}
            />
          )}
        </View>
      )}
      ListFooterComponent={<View style={{ height: 150 }} />}
    />
  );
};

const styles = StyleSheet.create({
  addAvatarText: {
    marginTop: 10,
    fontSize: 16,
    color: "#3b3f44",
  },
  addAvatarContainer: {
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

export default AvatarList;
