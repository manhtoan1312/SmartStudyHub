import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { DeleteTag } from "../services/Guest/TagService";

const TagComponent = ({ id, tagName, colorCode, reload, totalTimeWork, TotalWorkActive }) => {
  const navigation = useNavigation();
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          onPress={() => handleEditTag()}
          style={styles.editButton}
        >
          <AntDesign name="edit" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteTag()}
          style={styles.deleteButton}
        >
          <AntDesign name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };


  const handleEditTag = () => {
    navigation.navigate("EditTag", { tagId: id });
  };

  

  const handleDeleteTag = async (key) => {
    const response = await DeleteTag(id);
    if (response.success) {
      playSound();
      reload();
    } else {
      Alert.alert("Error", response.message);
    }
  };

  const toDetail = () => {
    navigation.navigate("TagDetail", { id: id });
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
      friction={2} // Điều chỉnh friction để tùy chỉnh animation
      rightThreshold={40}
    >
      <TouchableOpacity
        style={styles.projectContainer}
        onPress={() => toDetail()}
      >
        <AntDesign name="tag" size={20} color={colorCode}/>
        <Text style={styles.projectName}>{tagName}</Text>
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
    marginLeft:10
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
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    width: 40,
    height: 40,
  },
});

export default TagComponent;
