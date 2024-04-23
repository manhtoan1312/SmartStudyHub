import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllSoundConcentrationOfGuest } from "../../services/Guest/getDataService";
import getRole from "../../services/RoleService";
import SoundItem from "../../components/SoundItem";
import { Audio } from "expo-av";
import {
  addSound,
  deleteSound,
  getAllSoundDelete,
  getAllSoundPREMIUM,
  markDeleteSound,
  recoverSound,
  updateSound,
} from "../../services/PREMIUM/SoundService";
import * as DocumentPicker from "expo-document-picker";
import SoundDeletedItem from "../../components/SoundDeletedItem";
import { UploadAvt } from "../../services/Guest/UploadFile";

const FocusSound = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [soundList, setSoundList] = useState([]);
  const [deletedSoundList, setDeletedSoundList] = useState([]);
  const [selectedSound, setSelectedSound] = useState({});
  const [soundObject, setSoundObject] = useState(null);
  const [noneSelected, setNoneSelected] = useState(false);
  const [checkRole, setCheckRole] = useState(false);
  const fetchData = async () => {
    const sound = await AsyncStorage.getItem("focusSound");
    if (sound) {
      setSelectedSound(JSON.parse(sound));
    } else {
      setNoneSelected(true);
    }
    let response;
    if (soundObject) {
      await soundObject.stopAsync();
    }
    const role = await getRole();
    if (role && role.role === "PREMIUM") {
      setCheckRole(true);
      response = await getAllSoundPREMIUM();
    } else {
      response = await getAllSoundConcentrationOfGuest();
    }
    if (response.success) {
      setSoundList(response.data);
    }
  };

  const fetchDataDeleted = async () => {
    const role = await getRole();
    if (role && role.role === "PREMIUM") {
      const response = await getAllSoundDelete();
      if (response.success) {
        setDeletedSoundList(response.data);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataDeleted();
  }, []);

  const handleModeChange = async (mode) => {
    if (soundObject) {
      await soundObject.stopAsync();
    }
    setSelectedMode(mode);
    setModalVisible(false);
  };

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

  const handleOption = (sound) => {
    if (sound.statusSound !== "PREMIUM") {
      Alert.alert(
        "Confirm Action",
        "Do you want to change this sound?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Update", onPress: () => confirmUpdate(sound) },
          { text: "Delete", onPress: () => confirmDelete(sound) },
        ],
        { cancelable: false }
      );
    }
  };

  const confirmDelete = async (sound) => {
    const response = await markDeleteSound(sound.id);
    if (response.success) {
      if (sound.id === selectedSound.id) {
        await AsyncStorage.setItem("focusSound", JSON.stringify(soundList[0]));
      }
      fetchData();
      fetchDataDeleted();
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  const confirmUpdate = (sound) => {
    Alert.prompt(
      "Update Sound",
      null, // Đặt phần mô tả là null
      async (text) => {
        if (text !== null && text.trim().length > 0) {
          confirmUpdateSound(sound, text);
        }
      },
      "plain-text",
      sound.nameSound,
      "default"
    );
  };

  const confirmUpdateSound = async (sound, text) => {
    const response = await updateSound(sound.id, text, sound.url);
    if (response.success) {
      if (selectedSound.id === sound.id) {
        await AsyncStorage.setItem("focusSound", JSON.stringify(response.data));
      }
      fetchData();
    } else {
      Alert.alert("Error when update sound!", response.message);
    }
  };

  const handleAddSound = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || "audio.m4a",
          type: "audio/mp3",
        };
        const response = await UploadAvt(file, "SOUNDCONCENTRATION");
        addSoundStep2(response.data);
      }
    } catch (error) {
      console.error("Error picking sound:", error);
      Alert.alert("Error", "Failed to pick sound.");
    }
  };

  const addSoundStep2 = async (uri) => {
    Alert.prompt(
      "Enter Sound Name",
      null,
      async (text) => {
        if (text.trim().length > 0) {
          const response = await addSound(text, uri);
          if (response.success) {
            fetchData();
          } else {
            Alert.alert("Error!", response.message);
          }
        } else {
          Alert.alert("Error", "Please enter a valid name for the sound!");
        }
      },
      "plain-text"
    );
  };

  const handleBack = async () => {
    if (soundObject) {
      await soundObject.stopAsync();
    }
    navigation.goBack();
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
  };
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
  };

  const confirmDeleteCompletely = async (sound) => {
    const response = await deleteSound(sound.id);
    if (response.success) {
      fetchDataDeleted();
    } else {
      Alert.alert("Error!!", response.message);
    }
  };
  const confirmRecover = async (sound) => {
    const response = await recoverSound(sound.id);
    if (response.success) {
      fetchData();
      fetchDataDeleted();
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Working Sound</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons
            name="more-vert"
            size={24}
            color={checkRole ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={{
          borderTopColor: "#f3f3f3",
          borderTopWidth: 2,
          backgroundColor: "white",
        }}
      >
        {selectedMode === 0 ? (
          <View style={{}}>
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
            {soundList?.map((item) => (
              <SoundItem
                key={item.id} // Đảm bảo bạn cung cấp một key duy nhất cho mỗi SoundItem
                sound={item}
                selectedSound={selectedSound}
                onSelect={handleSelectSound}
                onDelete={handleOption}
              />
            ))}
            <View style={{ height: 150 }} />
          </View>
        ) : deletedSoundList.length !== 0 ? (
          <View>
            {deletedSoundList?.map((item) => (
              <SoundItem
                key={item.id} 
                sound={item}
                selectedSound={deletedSoundList}
                onSelect={handleRecoverSound}
                onDelete={handleDeleteCompletelySound}
              />
            ))}
            <View style={{ height: 150 }} />
          </View>
        ) : (
          <View
            style={{
              flex:1,
              height: 800,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 20, paddingBottom: 100, color: "#565656", }}
            >
              There're no Sound deleted
            </Text>
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TouchableOpacity
              style={[styles.modeItem, selectedMode === 0 && styles.selected]}
              onPress={() => handleModeChange(0)}
            >
              <Text>Current Sounds</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeItem, selectedMode === 1 && styles.selected]}
              onPress={() => handleModeChange(1)}
            >
              <Text>Deleted Sounds</Text>
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
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 5,
    marginHorizontal: 10,
    top: 120,
    borderColor: "#f7c068",
    borderWidth: 1,
  },
  modeItem: {
    marginVertical: 10,
    padding: 10,
  },
  selected: {
    backgroundColor: "#f7c068",
  },
});

export default FocusSound;
