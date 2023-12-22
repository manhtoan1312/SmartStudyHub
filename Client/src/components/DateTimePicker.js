import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import DatePickerModal from "react-native-modal-datetime-picker";

const DateTimePicker = ({ visible, onSelectTime, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(getToday);
  const defaultTime = new Date();
  defaultTime.setHours(8);
  defaultTime.setMinutes(30);

  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedTime.getHours());
      selectedDateTime.setMinutes(selectedTime.getMinutes());
      onSelectTime(selectedDateTime.getTime());
    }
    onClose();
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDatePicked = (date) => {
    setSelectedTime(date);
    hideDatePicker();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={{ backgroundColor: "white", padding: 16 }}>
          <View style={{ alignItems: "center", paddingTop: 16 }}>
            <Text style={styles.title}>Select Time Remindered</Text>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markedDates={{ [selectedDate]: { selected: true } }}
          />

          <View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={showDatePicker}
              >
                <Text style={styles.buttonText}>
                  {selectedTime.getHours()}:{selectedTime.getMinutes()}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", paddingBottom: 20 }}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DatePickerModal
            isVisible={isDatePickerVisible}
            mode="time"
            onConfirm={handleDatePicked}
            onCancel={hideDatePicker}
            date={selectedTime}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  confirmButton: {
    flex: 1,
    marginTop: 16,
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  datePickerButton: {
    marginTop: 16,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },
  closeButton: {
    flex: 1,
    marginTop: 16,
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    paddingHorizontal:20
  },
});

export default DateTimePicker;
