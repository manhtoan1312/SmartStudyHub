import React from "react";
import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Fontisto, Entypo,AntDesign } from "@expo/vector-icons";
import { GetProjectForAddFolder } from "../../services/Guest/ProjectService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { CreateFolder } from "../../services/Guest/FolderService";
import ImageFocus from "../../components/Image_Focus";

const AddFolder = ({ navigation }) => {
  const [color, setColor] = useState("#FF1493");
  const [name, setName] = useState("");
  const [listProject, setListProject] = useState([]);
  const [projectSelected, setProjectSelected] = useState([]);
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
      try {
        const id = await AsyncStorage.getItem("id");
        const response = await GetProjectForAddFolder(id);
        if (response.success) {
          setListProject(response.data);
        } else {
          Alert.alert("Error!", response.message);
        }
      } catch (e) {
        Alert.alert("Error!!", e);
      }
    };
    fetchData();
  }, []);
  const isSelected = (selectedColor) => {
    return color === selectedColor;
  };
  const handleAddProject = (projectId) => {
    setProjectSelected((prevSelected) => {
      if (prevSelected.includes(projectId)) {
        return prevSelected.filter((id) => id !== projectId);
      } else {
        return [...prevSelected, projectId];
      }
    });
  };

  const isSelectedProject = (projectId) => {
    return projectSelected.includes(projectId);
  };

  const handleDone = async () => {
    if (name) {
      const id = await AsyncStorage.getItem("id");
      const transformedList = projectSelected.map(id => ({ id }));
      const response = await CreateFolder(
        id,
        name,
        color,
        transformedList,
        null
      );
      
      if (response.success) {
        navigation.goBack();
      } else {
        Alert.alert("Error!", response.message);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Fontisto name="close-a" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Folder</Text>
        <TouchableOpacity>
          <Text
            style={[styles.headerText, { color: name ? "black" : "gray" }]}
            onPress={() => handleDone()}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Entypo name="folder" size={24} color={color} />
        <TextInput
          style={styles.input}
          placeholder="Folder Name"
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

      <View style={{ marginVertical: 20 }}>
        {listProject?.map((item, index) => (
          <View key={index} style={[styles.projectRow, isSelectedProject(item.id) && {backgroundColor:'#F1D8E9'}]}>
            <TouchableOpacity
              style={[styles.colorPreview, { backgroundColor: item.colorCode }]}
            />
            <Text style={styles.projectName}>{item.projectName}</Text>
            <TouchableOpacity
              style={[
                styles.addProjectButton,
                isSelectedProject(item.id) && styles.selectedAddProjectButton,
              ]}
              onPress={() => handleAddProject(item.id)}
            >
              {isSelectedProject(item.id) ? (
                <Fontisto name="check" size={10} color="white" />
              ) : (
                <AntDesign name="plus" size={18} color="lightcoral" />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <ImageFocus />
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
    width: 20,
    height: 20,
    borderRadius: 10,
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
  projectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    paddingVertical: 10,
  },
  projectColorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedProjectColor: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  projectName: {
    marginLeft: 10,
    flex: 1,
    fontSize:16
  },
  addProjectButton: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "lightcoral", 
  borderWidth: 2,
  },
  selectedAddProjectButton: {
    backgroundColor: "lightcoral",
  },
});

export default AddFolder;
