import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";

const MeditationModeModal = ({
  isVisible,
  initialOption,
  onClose,
  onSelectOption,
}) => {
  const [selectedOption, setSelectedOption] = useState(initialOption);

  useEffect(() => {
    setSelectedOption(initialOption);
  }, [initialOption]);

  const handleSwitchChange = () => {
    setSelectedOption(!selectedOption);
  };

  const handleCancel = () => {
    setSelectedOption(initialOption);
    onClose();
  };

  const handleOk = () => {
    onSelectOption(selectedOption);
    onClose();
  };

  return (
    <Modal
      key={isVisible ? "modalVisible" : "modalHidden"}
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Meditation Mode</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Turn Off</Text>
            <Switch value={selectedOption} onValueChange={handleSwitchChange} />
            <Text style={styles.switchText}>Flip Phone</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.okButton} onPress={handleOk}>
              <Text style={[styles.buttonText, { color: "green" }]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ddd",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginRight: 10,
  },
  okButton: {
    flex: 1,
    backgroundColor: "#d4edda",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default MeditationModeModal;
