import React from "react";
import { Modal, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const PriorityModal = ({ visible, onSelectPriority, onClose }) => {
  const priorities = [
    { label: "High priority", color: "red", icon: "ios-flag", value:'HIGH' },
    { label: "Normal Priority", color: "#e6e600", icon: "ios-flag" , value:'NORMAL'},
    { label: "Low Priority", color: "green", icon: "ios-flag", value:'LOW' },
    { label: "None", color: "gray", icon: null, value:'NONE' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity onPress={onClose} style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.priorityModal}>
            {priorities.map((priority, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.priorityItem,
                  { borderColor: priority.color },
                ]}
                onPress={() => onSelectPriority(priority.value)}
              >
                {priority.icon && (
                  <Ionicons
                    name={priority.icon}
                    size={24}
                    color={priority.color}
                  />
                )}
                <Text style={{ color: priority.color, fontWeight:"800", fontSize:16 }}>{priority.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 250,
    alignSelf: "center",
  },
  priorityModal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  priorityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});

export default PriorityModal;
