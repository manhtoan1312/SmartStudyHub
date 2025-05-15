import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { DeleteExtraWork, MarkDelete, RecoverExtraWork } from "../services/Guest/ExtraWork";

const ExtraCompleted = ({ extra, reload }) => {
  const deleteEx = async () => {
    const response = await DeleteExtraWork(extra.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Delete Extra Work Fail", response.message);
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.extraCompletedItem}>
        <View style={{ flexDirection: "row" }}>
          <AntDesign name="checkcircle" size={20} color="#00cc00" />
          <Text style={styles.extraWorkText}>{extra.extraWorkName}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={deleteEx}>
        <EvilIcons name="trash" size={28} color="black" />
      </TouchableOpacity>
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
    flex:1
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

export default ExtraCompleted;
