// SoundDone.js
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
import {
  deleteSoundDone,
  getAllSoundDonePREMIUM,
} from "../../services/PREMIUM/SoundDoneService";
import { getAllSoundDoneOfGuest } from "../../services/Guest/getDataService";
import SoundItem from "../../components/SoundItem";
import { Audio } from "expo-av";
const SoundDone = ({ navigation }) => {
  const [soundList, setSoundList] = useState([]);
  const [selectedSound, setSelectedSound] = useState({
    nameSound: "Default Bell",
    url: "https://res.cloudinary.com/dnj5purhu/video/upload/v1702956713/SmartStudyHub/SOUNDDONE/DEFAULT/DefaultBell_vh2hg0.mp3",
  });
  const [soundObject, setSoundObject] = useState(null);
  const fetchData = async () => {
    const sound = await AsyncStorage.getItem("soundDone");
    if (sound) {
      setSelectedSound(JSON.parse(sound));
    }
    let response;
    const role = getRole();
    if (role?.role === "PREMIUM") {
      response = await getAllSoundDonePREMIUM();
    } else {
      response = await getAllSoundDoneOfGuest();
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
    const newSoundObject = new Audio.Sound();
    try {
      await newSoundObject.loadAsync({ uri: sound.url });
      await newSoundObject.playAsync();
      setSoundObject(newSoundObject);

      await AsyncStorage.setItem("soundDone", JSON.stringify(sound));
    } catch (error) {
      console.error("Error playing sound:", error);
    }
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

  const handleBack = async ()=> {
    if (soundObject) {
      await soundObject.stopAsync();
    }
    navigation.goBack()
  }

  const confirmDelete = async (sound) => {
    const response = await deleteSoundDone(sound.id);
    Alert.alert("Smart Study Hub announced", response.message);
  };
  const handleAddSound = async () => {};
  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Break Bell</Text>
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
    paddingLeft: 20,
    justifyContent: "center",
  },
  bodyText: {
    fontSize: 16,
    color: "#555555",
  },
});

export default SoundDone;
