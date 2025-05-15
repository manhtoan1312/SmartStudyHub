import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import {
  DeleteCompletelyFolder,
  RecoverFolder,
} from "../services/Guest/FolderService";
import { Swipeable } from "react-native-gesture-handler";
import WorkDeleted from "./WorkDeleted";
import ProjectDeleted from "./ProjectDeleted";
const FolderDeleted = ({ folderItem, reload, navigation }) => {
  console.log(folderItem);
  async function confirmDelete() {
    const response = await DeleteCompletelyFolder(folderItem.id);
    if (response.success) {
      reload();
    }
  }

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <TouchableOpacity
        style={styles.rightActions}
        onPress={() => handleDelete()}
      >
        <TouchableOpacity onPress={() => handleDetete()}>
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleDetete = () => {
    Alert.alert(
      "Warning",
      "Are you sure you want to permanently delete this item?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => confirmDelete(),
        },
      ]
    );
  };
  const handleChange = async () => {
    const response = await RecoverFolder(folderItem.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Change error", response.message);
    }
  };

  return (
    <View>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          key={folderItem.id}
          style={styles.folderItemContainer}
        >
          {/* Circle with colorCode */}
          <MaterialCommunityIcons
            name="folder-remove"
            size={24}
            color={folderItem.colorCode}
          />

          {/* Project Name */}
          <View style={styles.projectNameContainer}>
            <Text style={[styles.projectName]}>{folderItem.folderName}</Text>
          </View>

          {/* Status Buttons */}
          <View style={styles.statusButtonsContainer}>
            <TouchableOpacity onPress={() => handleChange()}>
              <Feather name="refresh-ccw" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>

      {folderItem?.listProjectDeleted?.map((projectItem) => (
        <ProjectDeleted projectItem={projectItem} reload={reload} navigation={navigation}/>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  folderItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  projectNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  projectName: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  completedProject: {
    textDecorationLine: "line-through",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    backgroundColor: "transparent",
    borderColor: "green",
  },
  rightActions: {
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  projectItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
  },
  projectNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  projectName: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  completedProject: {
    textDecorationLine: "line-through",
  },
  statusButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    backgroundColor: "transparent",
    borderColor: "green",
  },
});

export default FolderDeleted;
