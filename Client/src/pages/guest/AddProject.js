import React from "react";
import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { CreateProject } from "../../services/Guest/ProjectService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageFocus from "../../components/Image_Focus";

const AddProject = ({ navigation }) => {
  const [color, setColor] = useState("#FF1493");
  const [name, setName] = useState("");

  const colorOptions = [
    "#FF1493", "#00BFFF", "#32CD32", "#FFD700", "#8A2BE2",
    "#FF4500", "#4682B4", "#00FF00", "#FF6347", "#1E90FF",
    "#8B008B", "#2E8B57", "#DC143C", "#BA55D3", "#FF8C00",
    "#20B2AA", "#9400D3", "#00FA9A", "#696969", "#808080",
  ];

  const isSelected = (selectedColor) => {
    return color === selectedColor;
  };

  const handleDone = async () => {
    if(name){
        const id = await AsyncStorage.getItem('id')
        const response = await CreateProject(id, null, name, color,null)
        if(response.success){
            navigation.goBack()
        }
        else{
            Alert.alert('Error!', response.message)
            
        }
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Fontisto name="close-a" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Project</Text>
        <TouchableOpacity>
        <Text style={[styles.headerText, { color: name ? 'black' : 'gray' }]} onPress={() => handleDone()}>Done</Text>

        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={[styles.colorPreview, { backgroundColor: color }]}></View>
        <TextInput
          style={styles.input}
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
    backgroundColor:'white',
    paddingVertical:20,
    paddingStart:10
    
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  input: {
    height: 40,
    borderBottomColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    fontSize:16
  },
  colorOptions: {
    flexDirection: "column",
    backgroundColor:'white',
    paddingHorizontal:15,
    paddingVertical:20
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
});

export default AddProject;
