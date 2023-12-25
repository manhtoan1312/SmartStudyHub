// ExtraActive.js
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { AntDesign, EvilIcons, Ionicons } from "@expo/vector-icons";
import {
  ExtraMarkCompleted,
  MarkDelete,
  RecoverExtraWork,
} from "../services/Guest/ExtraWork";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ExtraActive = ({ extra, reload, navigation }) => {
  const recover = async () => {
    const response = await ExtraMarkCompleted(extra.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Complete Extra Work Fail", response.message);
    }
  };

  const deleteEx = async () => {
    const response = await MarkDelete(extra.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Complete Extra Work Fail", response.message);
    }
  };

  const playextra = async () => {
    try {
      await AsyncStorage.setItem("work", JSON.stringify(extra));
      await AsyncStorage.setItem("workType", "EXTRA");
      await AsyncStorage.setItem("stop", "true");
      navigation.navigate("Focus");
    } catch (e) {
      Alert.alert("Error when save work", e);
    }
  };

  return (
    <TouchableOpacity onPress={recover} style={styles.container}>
      <View style={styles.extraCompletedItem}>
        <View style={{ flexDirection: "row" , alignItems:'center'}}>
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              borderColor: "green",
              borderWidth: 2,
              marginRight: 5,
            }}
          ></View>
          <Text style={{ color: "#666666" }}>{extra.extraWorkName}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems:'center' }}>
        <TouchableOpacity onPress={playextra}>
          <Ionicons name="ios-play-circle-sharp" size={26} color="#ff3232" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteEx}>
          <EvilIcons name="trash" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    flex: 1,
  },
  extraCompletedItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraWorkText: {
    color: "#666666",
    textDecorationLine: "line-through",
    marginLeft: 5,
  },
});

export default ExtraActive;
