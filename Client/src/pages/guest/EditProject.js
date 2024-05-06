import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  TextInput,SafeAreaView
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import {
  DeleteProject,
  GetDetailProject,
  MarkCompleteProject,
  RecoverProject,
  UpdateProject,
} from "../../services/Guest/ProjectService";

const EditProjectPage = ({ route, navigation }) => {
  const projectId = route.params.id;
  const [color, setColor] = useState(null);
  const [name, setName] = useState(null);
  const [project, setProject] = useState(null);
  const colorOptions = [
    "#FF1493",
    "#00BFFF",
    "#32CD32",
    "#FFD700",
    "#8A2BE2",
    "#FF4500",
    "#4682B4",
    "#00FF00",
    "#FF6347",
    "#1E90FF",
    "#8B008B",
    "#2E8B57",
    "#DC143C",
    "#BA55D3",
    "#FF8C00",
    "#20B2AA",
    "#9400D3",
    "#00FA9A",
    "#696969",
    "#808080",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetDetailProject(projectId);
      if (response.success) {
        console.log(response.data);
        setProject(response.data);
        setName(response.data.projectName);
        setColor(response.data.colorCode);
      }
    };
    fetchData();
  }, []);
  const isSelected = (selectedColor) => {
    return color === selectedColor;
  };

  const recoverProject = async () => {
    if (name) {
      const response = await RecoverProject(project.id);
      if (response.success) {
        navigation.navigate("Home");
      } else {
        Alert.alert("Error!", response.message);
      }
    }
  }

  const handleDone = async () => {
    if (name) {
      const response = await MarkCompleteProject(project.id);
      if (response.success) {
        navigation.navigate("Home");
      } else {
        Alert.alert("Error!", response.message);
      }
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm action",
      "All data related to this item will be deleted, are you sure you want to delete it?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => confirmDeleteProject() },
      ]
    );
  };

  const handleRecover = async () => {
    Alert.alert(
      "Confirm action",
      "Do you want to recover this project?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => recoverProject() },
      ]
    );
  };
  const confirmDeleteProject = async () => {
    const response = await DeleteProject(projectId);
    if (response.success) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Error!", response.message);
    }
  };

  const handleUpdate = async () => {
    console.log(project.id, name, color, null, project.status);
    const response = await UpdateProject(
      project.id,
      null,
      name,
      color,
      project.iconUrl,
      project.status
    );
    if (response.success) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Error!", response.message);
    }
  };

  const handleBack = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Fontisto name="close-a" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Project</Text>
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={[styles.headerText, { color: name ? "black" : "gray" }]}>
            Update
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={[styles.colorPreview, { backgroundColor: color }]}></View>
        <TextInput
          style={[
            styles.input,
            project?.status === "COMPLETED" && name && styles.completedProject,
          ]}
          placeholder="Project Name"
          value={name}
          onChangeText={(e) => setName(e)}
        />
      </View>
      <View style={styles.colorOptions}>
        {[...Array(4)].map((_, row) => (
          <View key={row} style={styles.colorOptionRow}>
            {colorOptions.slice(row * 5, (row + 1) * 5).map((option, col) => (
              <TouchableOpacity
                key={col}
                style={[
                  styles.colorOption,
                  { backgroundColor: option },
                  isSelected(option) && styles.selectedColor,
                ]}
                onPress={() => setColor(option)}
              >
                {isSelected(option) && (
                  <Fontisto name="check" size={18} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      {project?.status === "ACTIVE" ? (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={[styles.buttonText, styles.doneButtonText]}>
              Complete
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.doneButton} onPress={handleRecover}>
            <Text style={[styles.buttonText, styles.recoverButtonText]}>
              Recover
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete()}
        >
          <Text style={[styles.buttonText, styles.deleteButtonText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDCDC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
  },
  content: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 20,
    paddingStart: 10,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    height: 40,
    borderBottomColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    fontSize: 16,
  },
  colorOptions: {
    flexDirection: "column",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  colorOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#fff",
  },

  actionsContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 15,
    backgroundColor: "white",
    paddingVertical: 5,
    marginBottom: 4,
  },
  doneButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 12,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: 600,
  },
  doneButtonText: {
    color: "#4EE508",
  },recoverButtonText: {
    color: "#60A9E5",
  },
  deleteButtonText: {
    color: "red",
  },
  completedProject: {
    textDecorationLine: "line-through",
  },
});

export default EditProjectPage;
