import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  Octicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DeleteAllWork,
  GetWorkCompleted,
  GetWorkDeleted,
} from "../../services/Guest/WorkService";
import {
  DeleteAllProject,
  GetProjectByStatus,
} from "../../services/Guest/ProjectService";
import ImageFocus from "../../components/Image_Focus";
import {
  DeleteAllFolder,
  GetAllFolderDelete,
} from "../../services/Guest/FolderService";
import ProjectDeleted from "../../components/ProjectDeleted";
import WorkDeleted from "../../components/WorkDeleted";
import FolderDeleted from "../../components/FolderDeleted";
import { useIsFocused } from "@react-navigation/native";
import getRole from "../../services/RoleService";

const DeletedDetail = ({ navigation }) => {
  const [listWork, setListWork] = useState([]);
  const [listFolder, setListFolder] = useState([]);
  const [listProject, setListProject] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);
  const fetchData = async () => {
    fetchWork();
    fetchFolder();
    fetchProject();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchWork = async () => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const response = await GetWorkDeleted(id);
    if (response.success) {
      setListWork(response.data);
    } else {
      console.log("Error fetch work", response.message);
    }
  };

  const fetchFolder = async () => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const response = await GetAllFolderDelete(id);
    if (response.success) {
      setListFolder(response.data);
    } else {
      console.log("Error fetch folder", response.message);
    }
  };

  const fetchProject = async () => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const project = await GetProjectByStatus(id, "DELETED");
    if (project.success) {
      setListProject(project.data);
    } else {
      console.log("Error fetch project", response.message);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    toggleModal();
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Confirm action!",
      `Are you sure you wanna delete all ${selectedCategory}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Ok", onPress: () => confirmDeleteAll() },
      ]
    );
  };

  const confirmDeleteAll = async () => {
    let response;
    let id = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      id = role.id;
    }
    if (selectedCategory === "Work") {
      response = await DeleteAllWork(id);
    } else if (selectedCategory === "Folder") {
      response = await DeleteAllFolder(id);
    } else {
      response = await DeleteAllProject(id);
    }
    if (response.success) {
      Alert.alert("Action success");
      navigation.goBack();
    } else {
      Alert.alert("Error delete all:", response.message);
    }
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {/* Category */}
        <Pressable
          style={{ flexDirection: "row", justifyContent: "center" }}
          onPress={toggleModal}
        >
          <Text style={styles.categoryText}>{selectedCategory} </Text>
          <AntDesign name="downcircleo" size={24} color="black" />
        </Pressable>

        {/* Three dots button */}
        <TouchableOpacity onPress={handleDeleteAll}>
          <FontAwesome6 name="trash" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Modal for category options */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <TouchableOpacity style={styles.modal}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Work")}
          >
            <FontAwesome5
              name="tasks"
              style={styles.icon}
              size={18}
              color="black"
            />
            <Text style={styles.modalText}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Folder")}
          >
            <AntDesign
              name="folderopen"
              style={styles.icon}
              size={18}
              color="black"
            />
            <Text style={styles.modalText}>Folder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Project")}
          >
            <Octicons
              name="project"
              style={styles.icon}
              size={18}
              color="black"
            />
            <Text style={styles.modalText}>Project</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => toggleModal()}
          >
            <Text style={[styles.modalText, { paddingLeft: 30 }]}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Content based on selected category */}
      {selectedCategory === "Work" && (
        <ScrollView>
          {listWork?.map((item) => (
            <WorkDeleted
              key={item.id}
              workItem={item}
              reload={fetchData}
              navigation={navigation}
            />
          ))}

          {listWork?.length === 0 && (
            <View
              style={{
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: 700, color: "gray" }}>
                No Work Deleted
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {selectedCategory === "Folder" && (
        <ScrollView>
          {listFolder?.map((item, index) => (
            <FolderDeleted
              key={index}
              folderItem={item}
              reload={fetchData}
              navigation={navigation}
            />
          ))}
          {listFolder?.length === 0 && (
            <View
              style={{
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: 700, color: "gray" }}>
                No Folder Deleted
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {selectedCategory === "Project" && (
        <ScrollView>
          {listProject?.map((item, index) => (
            <ProjectDeleted
              key={index}
              projectItem={item}
              reload={fetchData}
              navigation={navigation}
            />
          ))}
          {listProject?.length === 0 && (
            <View
              style={{
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: 700, color: "gray" }}>
                No Project Deleted
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <ImageFocus />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  categoryText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalItem: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    flexDirection: "row",
  },
  modalText: {
    fontSize: 18,
  },
  icon: {
    paddingRight: 15,
  },
});

export default DeletedDetail;
