import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const ChooseWorkModal = ({
  visible,
  workList,
  selectedWork,
  onSelect,
  onClose,
}) => {
  return (
    workList && (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.contentContainer}>
            {/* Phần công việc active */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Active Works</Text>
            </View>
            {workList?.active?.map((work) => (
              <TouchableOpacity
                key={work.id}
                style={[
                  styles.itemContainer,
                  selectedWork.id === work.id && styles.selectedItem,
                ]}
                onPress={() => onSelect(work)}
              >
                <View style={styles.colorDot} />
                <Text style={styles.itemText}>{work.workName}</Text>
                {selectedWork.id === work.id && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color="black"
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}

            {/* Phần công việc completed */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Completed Works</Text>
            </View>
            {workList?.completed?.map((work) => (
              <TouchableOpacity
                key={work.id}
                style={[
                  styles.itemContainer,
                  selectedWork.id === work.id && styles.selectedItem,
                ]}
                onPress={() => onSelect(work)}
              >
                <View style={styles.colorDot} />
                <Text style={styles.itemText}>{work.workName}</Text>
                {selectedWork.id === work.id && (
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
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
    minHeight: 100,
    maxHeight: 400,
  },
  sectionHeader: {
    backgroundColor: "#e6e6e6",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "500",
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
    backgroundColor: "#60A9E5",
  },
  itemText: {
    paddingLeft: 5,
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

export default ChooseWorkModal;
