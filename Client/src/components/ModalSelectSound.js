import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllSoundPREMIUM } from "../services/PREMIUM/SoundService";
import { getAllSoundConcentrationOfGuest } from "../services/Guest/getDataService";
import getRole from "../services/RoleService";

const ModalSelectSound = ({ visible, onClose }) => {
  const [soundList, setSoundList] = useState([]);
  const [selectedSound, setSelectedSound] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = await getRole();
        let response;
        if (role && role.role === "PREMIUM") {
          response = await getAllSoundPREMIUM();
        } else {
          response = await getAllSoundConcentrationOfGuest();
        }
        if (response.success) {
          setSoundList(response.data);
          const sound = await AsyncStorage.getItem("focusSound");
          console.log(sound)
          if (sound) {
            setSelectedSound(JSON.parse(sound));
          }
        } else {
          Alert.alert(
            "Error",
            role && role.role === "PREMIUM"
              ? "Error when getting premium sound data"
              : "Error when getting guest sound data"
          );
        }
      } catch (error) {
        console.error("Error fetching sound data:", error);
        Alert.alert("Error", "Failed to fetch sound data.");
      }
    };

    fetchData();
  }, []);

  const handleSelectSound = (sound) => {
    setSelectedSound(sound);
  };

  const handleConfirm = async () => {
    try {
      if(selectedSound){
        await AsyncStorage.setItem("focusSound", JSON.stringify(selectedSound));
      }
      else{
        await AsyncStorage.removeItem('focusSound')
      }
      onClose();
    } catch (error) {
      console.error("Error saving selected sound:", error);
      Alert.alert("Error", "Failed to save selected sound.");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>Select Sound</Text>
          {/* Hiển thị mục "None" */}
         <ScrollView style={{height:300}}>
            <TouchableOpacity
              onPress={() => handleSelectSound(null)}
              style={[styles.soundItem, selectedSound === null && styles.selectedItem]}
            >
              <Text style={styles.soundText}>None</Text>
              {selectedSound === null && <MaterialIcons name="check" size={24} color="orange" />}
            </TouchableOpacity>
            {/* Hiển thị các âm thanh */}
            {soundList.map((sound) => (
              <TouchableOpacity
                key={sound.id}
                onPress={() => handleSelectSound(sound)}
                style={[styles.soundItem, selectedSound?.id === sound.id && styles.selectedItem]}
              >
                <Text style={styles.soundText}>{sound.nameSound}</Text>
                {selectedSound?.id === sound.id && <MaterialIcons name="check" size={24} color="orange" />}
              </TouchableOpacity>
            ))}
         </ScrollView>
          {/* Nút xác nhận */}
          <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  soundItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal:5
  },
  soundText: {
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: "#fee4d4",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default ModalSelectSound;
