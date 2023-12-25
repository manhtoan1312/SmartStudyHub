import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { DeleteExtraWork, RecoverExtraWork } from "../services/Guest/ExtraWork";

const ExtraDeleted = ({ extra, reload }) => {
  const recover = async () => {
    const response = await RecoverExtraWork(extra.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Recover Extra Work Fail", response.message);
    }
  };

  const deleteEx = async () => {
    const response = await DeleteExtraWork(extra.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Recover Extra Work Fail", response.message);
    }
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={() => deleteEx()}
          style={[styles.actionButton]}
        >
          <EvilIcons name="trash" size={28} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.container}>
        <View style={styles.extraCompletedItem}>
          <View>
            <Text style={styles.extraWorkText}>{extra.extraWorkName}</Text>
          </View>
          <TouchableOpacity onPress={() => recover()} style={styles.actionButton}>
            <Feather name="refresh-ccw" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
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
  },
  extraCompletedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%',
  },
  extraWorkText: {
    color: "red",
    textDecorationLine: "line-through",
    marginLeft: 5,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ExtraDeleted;
