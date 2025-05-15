import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const WorkHeader = ({
  projectName,
  projectList,
  onBack,
  onDelete,
  onUpdateProject,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.projectItem,
        item.id === (projectName?.projectId || null) && styles.selectedProject,
      ]}
      onPress={() => handleProjectSelection(item)}
    >
      <Text>{item.projectName}</Text>
      {item.id === (projectName?.projectId || null) && (
        <MaterialIcons name="check" size={20} color="#ff3232" />
      )}
    </TouchableOpacity>
  );
  const handleProjectSelection = (selectedProject) => {
    setModalVisible(false);
    onUpdateProject(selectedProject);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.projectName}>
          {projectName?.projectName || "Mission"}
        </Text>
        <AntDesign name="down" size={15} color="#666666" />
      </TouchableOpacity>
      <TouchableOpacity onPress={showMoreOptions}>
        <MaterialIcons name="more-vert" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const showMoreOptions = () => {
    setMoreOptionsModalVisible(true);
  };

  const hideMoreOptions = () => {
    setMoreOptionsModalVisible(false);
  };

  const handleDelete = () => {
    hideMoreOptions();
    onDelete();
  };
  return (
    <View>
      {renderHeader()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={[{ id: null, projectName: "Mission" }, ...projectList]}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id?.toString() || "mission"}
          />
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
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.moreOption}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={hideMoreOptions}>
            <Text style={styles.moreOption}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3f51b5",
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
  },
  moreOptionsModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: 20,
  },
  moreOption: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginLeft: 10,
  },
});

export default WorkHeader;
