import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Picker } from "react-native-wheel-pick";

const HourPicker = ({ visible, initTime, onSelect, onClose }) => {
  const [selectedHour, setSelectedHour] = useState(initTime);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Picker
              style={styles.picker}
              selectedValue={selectedHour}
              pickerData={hours}
              onValueChange={(value) => setSelectedHour(value)}
            />
            <Text style={styles.label}>Hour</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.okButton]}
              onPress={() => {
                onSelect(selectedHour);
                onClose();
              }}
            >
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
  },
  picker: {
    width: 200,
    height: 200,
    backgroundColor: "white",
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: "center",
    width: 100,
  },
  okButton: {
    backgroundColor: "#007BFF",
  },
  cancelButton: {
    backgroundColor: "#DC3545",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HourPicker;
