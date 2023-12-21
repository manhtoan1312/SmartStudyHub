import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { MarkCompleteProject } from "../services/Guest/ProjectService";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

const ProjectComponent = ({
  id,
  projectName,
  colorCode,
  reload,
  totalTimeWork,
  TotalWorkActive,
}) => {
  const navigation = useNavigation();
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={() => handleEditProject()}
          style={styles.editButton}
        >
          <AntDesign name="edit" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDoneProject(id)}
          style={styles.doneButton}
        >
          <AntDesign name="check" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../sound/Done.mp3")
    );
    await sound.playAsync();
  }

  const handleEditProject = () => {
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
    navigation.navigate("ProjectDetail", { id: id });
  };
  const convertMinutesToHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeableContainer}
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
    margin:10,
    paddingVertical:5
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
    width: 80,
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
  totalTimeContainer: {
    position: 'absolute',
    top: 3,
    right: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalTimeText: {
    fontSize: 14,
    marginHorizontal: 5,
  },
});

export default ProjectComponent;
