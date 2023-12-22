import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DeleteProject, RecoverProject } from "../services/Guest/ProjectService";
import { MaterialIcons } from "@expo/vector-icons";
const ProjectDone = ({ projectItem, reload, navigation }) => {
  async function confirmDeleteProject() {
    const response = await DeleteProject(projectItem.id);
    if (response.success) {
      reload();
    }
  }

  const handleChange = async () => {
    const response = await RecoverProject(projectItem.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Change error", response.message);
    }
  };

  const toDetail = () => {
    navigation.navigate("ProjectDetail", { id: projectItem.id });
  };

  return (
    <TouchableOpacity
      key={projectItem.id}
      style={styles.projectItemContainer}
      onPress={() => toDetail()}
    >
      {/* Circle with colorCode */}
      <View
        style={[styles.colorCircle, { backgroundColor: projectItem?.colorCode }]}
      />

      {/* Project Name */}
      <View style={styles.projectNameContainer}>
        <Text
          style={[
            styles.projectName,
            projectItem.status === "COMPLETED" && styles.completedProject,
          ]}
        >
          {projectItem.projectName}
        </Text>
      </View>

      {/* Status Buttons */}
      <View style={styles.statusButtonsContainer}>
        <TouchableOpacity
          onPress={() => handleChange(projectItem)}
          style={[
            styles.statusCircle,
            {
              backgroundColor:
                projectItem.status === "ACTIVE" ? "transparent" : "green",
            },
          ]}
        />
        <TouchableOpacity onPress={() => confirmDeleteProject(projectItem.id)}>
          <MaterialIcons name="delete" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
    backgroundColor:'white',
    margin:10,
    borderRadius:10,
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
    fontSize:16
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

export default ProjectDone;