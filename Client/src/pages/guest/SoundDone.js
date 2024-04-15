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
  getAllSoundDoneDelete,
  getAllSoundDonePREMIUM,
  markDeleteSoundDone,
  recoverSoundDone,
} from "../../services/PREMIUM/SoundDoneService";
import { getAllSoundDoneOfGuest } from "../../services/Guest/getDataService";
import SoundItem from "../../components/SoundItem";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import SoundDeletedItem from "../../components/SoundDeletedItem";
const SoundDone = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [soundList, setSoundList] = useState([]);
  const [deletedSoundList, setDeletedSoundList] = useState([]);
  const [soundObject, setSoundObject] = useState(null);
  const [noneSelected, setNoneSelected] = useState(false);
  const [selectedSound, setSelectedSound] = useState({
    nameSound: "Default Bell",
    url: "https://res.cloudinary.com/dnj5purhu/video/upload/v1702956713/SmartStudyHub/SOUNDDONE/DEFAULT/DefaultBell_vh2hg0.mp3",
  });
  const fetchData = async () => {
    const sound = await AsyncStorage.getItem("soundDone");
    if (sound) {
      setSelectedSound(JSON.parse(sound));
    }
    else {
      setNoneSelected(true);
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

  const fetchDataDeleted = async () => {
    const role = await getRole();
    if (role?.role === "PREMIUM") {
      const response = await getAllSoundDoneDelete();
      if (response.success) {
        setDeletedSoundList(response.data);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataDeleted()
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
    const response = await markDeleteSoundDone(sound.id);
    if(response.success){
      fetchData()
      fetchDataDeleted()
    }
    else{
      Alert.alert('Error!!', response.message)
    }
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
  const handleRecoverSound = (sound) => {
    Alert.alert(
      "Confirm Action",
      "Do you want to recover this sound?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => confirmRecover(sound) },
      ],
      { cancelable: false }
    );
  }
  const handleDeleteCompletelySound = (sound) => {
    Alert.alert(
      "Confirm Action",
      "Do you want to delete this sound forever?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => confirmDeleteCompletely(sound) },
      ],
      { cancelable: false }
    );
  }

  const confirmDeleteCompletely = async (sound) => {
    const response = await deleteSoundDone(sound.id)
    if(response.success) {
      fetchDataDeleted()
    }
    else{
      Alert.alert("Error!!", response.message)
    }
  }
  const confirmRecover = async (sound) => {
    const response = await recoverSoundDone(sound.id)
    if(response.success) {
      fetchData()
      fetchDataDeleted()
    }
    else{
      Alert.alert("Error!!", response.message)
    }
  }
  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Break Sound</Text>
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
        {selectedMode=== 0 ? <View>
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
        </View> : <FlatList
            data={deletedSoundList}
            renderItem={({ item }) => (
              <SoundDeletedItem
                sound={item}
                onRecover={handleRecoverSound}
                onDelete={handleDeleteCompletelySound}
              />
            )}
          />}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        {/* Modal content */}
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            {/* Option Current */}
            <TouchableOpacity
              style={[styles.modeItem, selectedMode === 0 && styles.selected]}
              onPress={() => handleModeChange(0)}
            >
              <Text>Current</Text>
            </TouchableOpacity>
            {/* Option Deleted */}
            <TouchableOpacity
              style={[styles.modeItem, selectedMode === 1 && styles.selected]}
              onPress={() => handleModeChange(1)}
            >
              <Text>Deleted</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modeItem: {
    marginVertical: 10,
    padding: 10,
  },
  selected: {
    backgroundColor: "#f7c068",
  },
});

export default SoundDone;
