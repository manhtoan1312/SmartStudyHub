import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateOfBirthPickerModal = ({ isVisible, date, onClose, onDateChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(date));

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = () => {
    onDateChange(selectedDate.getTime());
    hideDatePicker();
  };
 
  const onCancel = () => {
    setSelectedDate(new Date(date))
    onClose()
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalContainer} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Date of Birth</Text>
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.selectDateButton}
          >
            <Text style={styles.selectDateButtonText}>
              {selectedDate.toDateString()}
            </Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleConfirm}
            >
              <Text style={[styles.buttonText, { color: "green" }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: "red" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              setSelectedDate(date);
              hideDatePicker();
            }}
            onCancel={hideDatePicker}
          />
        </View>
      </TouchableOpacity>
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
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectDateButton: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  selectDateButtonText: {
    fontSize: 16,
  },
  cancelButton: {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: "50%",
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DateOfBirthPickerModal;
