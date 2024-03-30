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
import { getAllSoundDonePrenium } from "../../services/Prenium/SoundDoneService";
import { getAllSoundDoneOfGuest } from "../../services/Guest/getDataService";
import SoundItem from "../../components/SoundItem";

const SoundDone = ({ navigation }) => {
  const [soundList, setSoundList] = useState([]);
  const [selectedSound, setSelectedSound] = useState(
    "https://res.cloudinary.com/dnj5purhu/video/upload/v1702956713/SmartStudyHub/SOUNDDONE/DEFAULT/DefaultBell_vh2hg0.mp3"
  );

  const fetchData = async () => {
    const sound = await AsyncStorage.getItem("soundDone");
    if (sound) {
      setSelectedSound(sound);
    }
    let response;
    const role = getRole();
    if (role?.role === "PRENIUM") {
      response = await getAllSoundDonePrenium();
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

  const handleSelectSound = () => {

  }
  const handleDeleteSound = () => {

  }
  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sound Done</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={{borderTopColor:'#f3f3f3', borderTopWidth:2, backgroundColor:'white'}}>
        <View style={styles.addItem}><Text style={styles.bodyText}>Add Sound</Text></View>
        <FlatList data={soundList} renderItem={({ item }) => <SoundItem 
        sound={item}
        url={selectedSound}
        onSelect={handleSelectSound}
        onDelete={handleDeleteSound}
        />} 
        />
      </View>
      <View style={{height:20}}></View>
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
    height:50,
    paddingLeft:20,
    justifyContent:'center'
  }
  ,
  bodyText: {
    fontSize:16,
    color:'#555555'
  }
});

export default SoundDone;
