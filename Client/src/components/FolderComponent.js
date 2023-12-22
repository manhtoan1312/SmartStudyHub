import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import ProjectComponent from "./ProjectComponent";
import { Swipeable } from "react-native-gesture-handler";
import { DeleteFolder } from "../services/Guest/FolderService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const FolderComponent = ({
  id,
  folderName,
  colorCode,
  listProjects,
  reload,
}) => {
  const [done, setDone] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const navigation = useNavigation();
  const handleToggleProjects = () => {
    setShowProjects(!showProjects);
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <View style={styles.rightActions} key={id}>
        <TouchableOpacity
          onPress={() => handleEditFolder()}
          style={styles.editButton}
        >
          <AntDesign name="edit" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteFolder()}
          style={styles.deleteButton}
        >
          <AntDesign name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleEditFolder = () => {
    navigation.navigate("EditFolder", { id: id });
  };

  const handleDeleteFolder = async () => {
    const transformedList = listProjects.map(({ id }) => ({ id }));
    const userId = await AsyncStorage.getItem("id");
    const response = await DeleteFolder(
      userId,
      id,
      folderName,
      colorCode,
      transformedList,
      null
    );
    if (response.success) {
      setDone(true);
      reload();
    } else {
      Alert.alert("Error", response.message);
    }
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        onPress={() => navigation.navigate("FolderDetail", { id: id })}
        style={styles.container}
      >
        <View style={styles.folderContainer}>
          <TouchableOpacity onPress={handleToggleProjects}>
            <FontAwesome name="folder" size={20} color={colorCode} />
          </TouchableOpacity>
          <Text style={styles.folderName}>{folderName}</Text>
        </View>

        {showProjects && (
          <View>
            {listProjects.map((project) => (
              <View key={project.id} style={{ marginLeft: 20 }}>
                <ProjectComponent
                  id={project.id}
                  projectName={project.projectName}
                  colorCode={project.colorCode}
                  totalTimeWork={project.totalTimeWork}
                  TotalWorkActive={project.totalWorkActive}
                  reload={reload}
                />
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={handleToggleProjects}
        >
          <AntDesign
            name={showProjects ? "up" : "down"}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 10,
  },
  folderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  folderName: {
    fontSize: 16,
    color: "black",
    marginLeft: 10,
  },
  projectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 20,
    borderLeftColor: "lightgray",
    borderLeftWidth: 2,
  },
  projectContainer: {
    marginBottom: 5,
    flexDirection: "row",
  },
  dropdownButton: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  rightActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 80,
    marginRight: 10,
  },

  editButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    width: 40,
    height: 40,
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

export default FolderComponent;
