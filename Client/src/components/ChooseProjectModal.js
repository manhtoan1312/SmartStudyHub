import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";

const ChooseProjectModal = ({
  visible,
  projectList,
  selectedProject,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.contentContainer}>
          <TouchableOpacity
            style={[
              styles.itemContainer,
              selectedProject === "Default" && styles.selectedItem,
            ]}
            onPress={() => onSelect({id:0, projectName: 'Task Default'})}
          >
            <MaterialIcons name="home-work" size={20} color="#60A9E5" />
            <Text style={styles.itemText}>Task Default</Text>
            {selectedProject.id === 0 && (
              <MaterialIcons
                name="check"
                size={24}
                color="black"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          {projectList?.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={[
                styles.itemContainer,
                selectedProject.id === project.id && styles.selectedItem,
              ]}
              onPress={() => onSelect(project)}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: project.colorCode },
                ]}
              />
              <Text style={styles.itemText}>{project.projectName}</Text>
              {selectedProject.id === project.id && (
                <MaterialIcons
                  name="check"
                  size={24}
                  color="black"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}

          
        </ScrollView>
        <View style={{height:20, backgroundColor:'white'}}></View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding:20,
    minHeight:100,
    maxHeight:400,
    
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: "#e6e6e6",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    paddingLeft:5,
    flex: 1,
  },
  checkIcon: {
    position: "absolute",
    right: 10,
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    padding: 20,
  },
});

export default ChooseProjectModal;
