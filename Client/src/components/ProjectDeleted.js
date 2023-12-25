import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  DeleteCompletelyProject,
  RecoverProject,
} from "../services/Guest/ProjectService";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import WorkActive from "./WorkActive";
import WorkCompleted from "./WorkCompleted";
import WorkDeleted from "./WorkDeleted";
import WorkactiveDL from "./workactiveDL";
import WorkCompletedDL from "./WorkCompleteDL";
const ProjectDeleted = ({ projectItem, reload, navigation }) => {
  async function confirmDelete() {
    const response = await DeleteCompletelyProject(projectItem.id);
    if (response.success) {
      reload();
    }
  }

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
    const response = await RecoverProject(projectItem.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Change error", response.message);
    }
  };

  return (
    <View>
      <TouchableOpacity
        key={projectItem.id}
        style={styles.projectItemContainer}
      >
        {/* Circle with colorCode */}
        <View
          style={[
            styles.colorCircle,
            { backgroundColor: projectItem?.colorCode },
          ]}
        />

        {/* Project Name */}
        <View style={styles.projectNameContainer}>
          <Text style={[styles.projectName, styles.completedProject]}>
            {projectItem.projectName}
          </Text>
        </View>

        {/* Status Buttons */}
        <View style={styles.statusButtonsContainer}>
          <TouchableOpacity onPress={() => handleChange()}>
            <Feather name="refresh-ccw" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDetete()}>
            <MaterialIcons name="delete" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <View style={{ marginLeft: 30 }}>
        {projectItem.listWorkActive?.map((item) => (
          <WorkactiveDL
            workItem={item}
            reload={reload}
            navigation={navigation}
            key={item.id} // Use a unique identifier here, such as item.id
          />
        ))}
        {projectItem.listWorkCompleted?.map((item) => (
          <WorkCompletedDL
            workItem={item}
            reload={reload}
            navigation={navigation}
            key={item.id} // Use a unique identifier here, such as item.id
          />
        ))}
        {projectItem.listWorkDeleted?.map((item) => (
          <WorkDeleted
            workItem={item}
            reload={reload}
            navigation={navigation}
            key={item.id} // Use a unique identifier here, such as item.id
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ProjectDeleted;
