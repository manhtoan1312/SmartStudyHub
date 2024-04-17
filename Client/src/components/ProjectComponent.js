import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { Swipeable, progress, dragX } from "react-native-gesture-handler";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  DeleteProject,
  MarkCompleteProject,
} from "../services/Guest/ProjectService";
import { Audio } from "expo-av";

const ProjectComponent = ({
  id,
  projectName,
  colorCode,
  reload,
  totalTimeWork,
  TotalWorkActive,
}) => {
  const navigation = useNavigation();
  const swipeableRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 150, 151],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <View style={styles.rightActions}>
        
        <TouchableOpacity
          onPress={() => handleDoneProject(id)}
          style={[styles.doneButton, { transform: [{ translateX: trans }] }]}
        >
          <AntDesign name="check" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEditProject()}
          style={[styles.editButton, { transform: [{ translateX: trans }] }]}
        >
          <AntDesign name="edit" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(id)}
          style={[styles.delButton, { transform: [{ translateX: trans }] }]}
        >
          <EvilIcons name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm action",
      "All data related to this item will be deleted, are you sure you want to delete it?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => confirmDeleteProject(id) },
      ]
    );
  };

  const confirmDeleteProject = async (id) => {
    const response = await DeleteProject(id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Error!", response.message);
    }
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../sound/Done.mp3")
    );
    await sound.playAsync();
  }

  const handleEditProject = () => {
    swipeableRef.current && swipeableRef.current.close();
    navigation.navigate("EditProject", { id: id });
  };

  const handleDoneProject = async (key) => {
    const response = await MarkCompleteProject(id);
    if (response.success) {
      playSound();
      reload();
    } else {
      Alert.alert("Error", response.message);
    }
  };

  const toDetail = () => {
    swipeableRef.current && swipeableRef.current.close();
    navigation.navigate("ProjectDetail", { id: id });
  };

  const convertMinutesToHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      progress={progress}
      dragX={dragX}
    >
      <TouchableOpacity
        style={styles.projectContainer}
        onPress={() => toDetail()}
      >
        <View style={[styles.colorPreview, { backgroundColor: colorCode }]} />
        <Text style={styles.projectName}>{projectName}</Text>
        <View style={styles.totalTimeContainer}>
          <Text style={styles.totalTimeText}>
            {convertMinutesToHoursAndMinutes(totalTimeWork)}
          </Text>
          <Text style={styles.totalTimeText}>{TotalWorkActive}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  projectContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    paddingVertical: 5,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  projectName: {
    fontSize: 16,
    color: "black",
  },
  rightActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 120,
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  doneButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  delButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  totalTimeContainer: {
    position: "absolute",
    top: 3,
    right: -5,
    flexDirection: "row",
    alignItems: "center",
  },
  totalTimeText: {
    fontSize: 14,
    marginHorizontal: 5,
  },
});

export default ProjectComponent;
