import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../../services/RoleService";
import { getAllSoundConcentrationOfGuest } from "../../services/Guest/getDataService";
import SoundItem from "../../components/SoundItem";
import { Audio } from "expo-av";
import {
  getAllSoundPREMIUM,
  markDeleteSound,
} from "../../services/PREMIUM/SoundService";
import * as DocumentPicker from "expo-document-picker";
const FocusSound = ({ navigation }) => {
  const [soundList, setSoundList] = useState([]);
  const [selectedSound, setSelectedSound] = useState({});
  const [soundObject, setSoundObject] = useState(null);
  const [noneSelected, setNoneSelected] = useState(false);

  const fetchData = async () => {
    const sound = await AsyncStorage.getItem("focusSound");
    if (sound) {
      setSelectedSound(JSON.parse(sound));
    }
    else{
      setNoneSelected(true)
    }
    let response;
    const role = getRole();
    if (role?.role === "PREMIUM") {
      response = await getAllSoundPREMIUM();
    } else {
      response = await getAllSoundConcentrationOfGuest();
    }
    if (response.success) {
      setSoundList(response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectSound = async (sound) => {
    if (soundObject) {
      await soundObject.stopAsync();
    }
    setSelectedSound(sound);
    setNoneSelected(false);
    const newSoundObject = new Audio.Sound();
    try {
      await newSoundObject.loadAsync({ uri: sound.url });
      await newSoundObject.playAsync();
      setSoundObject(newSoundObject);
      await AsyncStorage.setItem("focusSound", JSON.stringify(sound));
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleNone = async () => {
    if (soundObject) {
      await soundObject.stopAsync();
    }
    setSelectedSound({});
    setNoneSelected(true);
    await AsyncStorage.removeItem("focusSound");
  };

  const handleDeleteSound = (sound) => {
    if (sound.statusSound !== "DEFAULT") {
      Alert.alert(
        "Confirm Action",
        "Do you want to delete this sound?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => confirmDelete(sound) },
        ],
        { cancelable: false }
      );
    }
  };

  const confirmDelete = async (sound) => {
    const response = await markDeleteSound(sound.id);
    Alert.alert("Smart Study Hub announced", response.message);
  };

  const handleAddSound = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });

      if (file.type === "success") {
        if (
          file.name.endsWith(".mp3") ||
          file.name.endsWith(".wav") ||
          file.name.endsWith(".ogg")
        ) {
          const { sound: soundObject } = await Audio.Sound.createAsync({
            uri: file.uri,
          });
          await soundObject.playAsync();
        } else {
          Alert.alert(
            "Error",
            "Please select an audio file (mp3, wav, or ogg)."
          );
        }
      }
    } catch (error) {
      console.error("Error picking sound:", error);
      Alert.alert("Error", "Failed to pick sound.");
    }
  };

  const handleBack = async () => {
    if (soundObject) {
      await soundObject.stopAsync();
    }
    navigation.goBack();
  };
  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Working Sound</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View
        style={{
          borderTopColor: "#f3f3f3",
          borderTopWidth: 2,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={() => handleAddSound()}
          style={styles.addItem}
        >
          <Text style={styles.bodyText}>+ Add Sound</Text>
        </TouchableOpacity>
        {/* Hiển thị mục "None" */}
        <TouchableOpacity
          onPress={() => handleNone()}
          style={[styles.addItem, noneSelected && styles.selectedItem]}
        >
          <Text style={[styles.bodyText]}>None</Text>
          {noneSelected && (
            <MaterialIcons name="check" size={24} color="orange" />
          )}
        </TouchableOpacity>
        <FlatList
          data={soundList}
          renderItem={({ item }) => (
            <SoundItem
              sound={item}
              selectedSound={selectedSound}
              onSelect={handleSelectSound}
              onDelete={handleDeleteSound}
            />
          )}
        />
      </View>
      <View style={{ height: 20 }}></View>
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
  addItem: {
    height: 50,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  bodyText: {
    fontSize: 16,
    color: "#555555",
  },
  selectedItem: {
    backgroundColor: "#fee4d4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FocusSound;
