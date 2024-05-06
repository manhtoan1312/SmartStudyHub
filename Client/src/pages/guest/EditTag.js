import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,SafeAreaView
} from "react-native";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import {
  DeleteTag,
  GetTagDetail,
  UpdateTag,
} from "../../services/Guest/TagService";

const EditTag = ({ route, navigation }) => {
  const { tagId } = route.params;
  const [color, setColor] = useState(null);
  const [name, setName] = useState(null);
  const [tag, setTag] = useState(null);
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
      const response = await GetTagDetail(tagId);
      if (response.success) {
        setTag(response.data);
        setName(response.data.tagName);
        setColor(response.data.colorCode);
      }
    };
    fetchData();
  }, []);

  const isSelected = (selectedColor) => {
    return color === selectedColor;
  };

  const handleUpdate = async () => {
    const response = await UpdateTag(tagId, name, color, tag.status);
    if (response.success) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Error!", response.message);
    }
  };
  // const handleDone = async () => {
  //   const response = await UpdateTag(id, name, color, 'COMPLETED');
  //   if (response.success) {
  //     navigation.navigate("Home");
  //   } else {
  //     Alert.alert("Error!", response.message);
  //   }
  // };

  const handleDelete = async () => {
    const response = await DeleteTag(tagId);
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
        <Text style={styles.headerText}>Edit Tag</Text>
        <TouchableOpacity onPress={handleUpdate}>
          <Text style={[styles.headerText, { color: name ? "black" : "gray" }]}>
            Update
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <AntDesign name="tag" size={24} color={color} />
        <TextInput
          style={styles.input}
          placeholder="Tag Name"
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
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
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
    paddingHorizontal: 30,
    marginTop: 10,
    backgroundColor: "white",
    paddingVertical: 2,
    marginBottom: 4,
  },
  doneButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 6,
    paddingVertical: 8,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 6,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  doneButtonText: {
    color: "blue",
  },
  deleteButtonText: {
    color: "red",
  },
});
export default EditTag;
