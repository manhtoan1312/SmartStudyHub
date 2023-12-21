import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { DeleteWork, GetDetailWork } from "../../services/Guest/WorkService";
import { GetAllTagOfUser } from "../../services/Guest/TagService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetProjectByStatus } from "../../services/Guest/ProjectService";

const WorkDetail = ({ route, navigation }) => {
  const id = route.params.id;
  const isMounted = useRef(true);

  const [work, setWork] = useState(null);
  const [listTag, setListTag] = useState(null);
  const [listTagSelected, setListTagSelected] = useState(null);
  const [listProject, setlistProject] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();

    return () => {
      // Cleanup function
      isMounted.current = false;
    };
  }, []);

  const fetchData = async () => {
    try {
      const Userid = await AsyncStorage.getItem("id");
      const [workResponse, listTagResponse, listProjectResponse] =
        await Promise.all([
          GetDetailWork(id),
          GetAllTagOfUser(Userid),
          GetProjectByStatus(Userid, "ACTIVE"),
        ]);

      if (isMounted.current) {
        if (workResponse.success) {
          setWork(workResponse.data);
          console.log(workResponse.data);
        }

        if (listTagResponse.success) {
          setListTag(listTagResponse.data);
        }

        if (listProjectResponse.success) {
          setlistProject(listProjectResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBack = () => {
    console.log("go back");
    navigation.goBack();
  };

  const handleDelete = async () => {
    const response = await DeleteWork(id);
    if (response.success) {
      navigation.goBack();
    } else {
      Alert.alert("Error when delete Work", response.message);
    }
  };

  const handleUpdateProject = (project) => {
    if (work) {
      const updatedWork = { ...work };
      updatedWork.projectId = project?.id || null;
      updatedWork.projectName = project?.projectName || null;
      setWork(updatedWork);
    }
    setModalVisible(false);
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.projectItem,
        item.id === (work?.projectId || null) && styles.selectedProject,
      ]}
      onPress={() => handleUpdateProject(item)}
    >
      <Text>{item.projectName}</Text>
      {item.id === (work?.projectId || null) && (
        <MaterialIcons name="check" size={20} color="#ff3232" />
      )}
    </TouchableOpacity>
  );

  const showMoreOptions = () => {
    setMoreOptionsModalVisible(true);
  };

  const hideMoreOptions = () => {
    setMoreOptionsModalVisible(false);
  };

  const handleDeleteWork = () => {
    hideMoreOptions();
    handleDelete();
  };

  return (
    <View>
      {/* WorkHeader Component */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.projectName}>
            {work?.projectName || "Mission"}
          </Text>
          <AntDesign name="down" size={15} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={showMoreOptions}>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Project Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View>
            <View style={styles.projectHeader}>
              <Text style={{fontSize:16, fontWeight:600, color:'white'}}>Choose Project</Text>
            </View>
            <FlatList
              data={[{ id: 0, projectName: "Mission" }, ...listProject]}
              renderItem={renderProjectItem}
              keyExtractor={(item) => item.id?.toString() || "mission"}
            />
          </View>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={moreOptionsModalVisible}
        onRequestClose={hideMoreOptions}
      >
        <View style={styles.moreOptionsModalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonMore}
              onPress={handleDeleteWork}
            >
              <Text style={styles.moreOption}>Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonMore}
              onPress={hideMoreOptions}
            >
              <Text style={styles.moreOption}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ff7f7f",
    padding: 20,
  },
  projectName: {
    color: "#fff",
    fontSize: 18,
    paddingRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 20,
  },
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedProject: {
    backgroundColor: "#ffcccc",
  },
  cancelButton: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    fontSize: 18,
    color: "red",
    paddingBottom:40
  },
  moreOptionsModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  moreOption: {
    padding: 15,
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
  buttonMore: {
    width: 300,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "white",
  },
  buttonContainer: {
    alignItems: "center",
    borderRadius: 20,
  },
  projectHeader:{
    backgroundColor:'#ff9999',
    padding:20,
    justifyContent:'center',
    alignItems:'center'
  }
});

export default WorkDetail;
