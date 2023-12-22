import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarPicker = ({ isVisible, onSelectDate, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(getToday());

  function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelectDate(selectedDate);
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={{ backgroundColor: "white", padding: 16 }}>
          <View style={{ alignItems: "center", paddingTop:16}}>
            <Text style={styles.title}>Select Due Date</Text>
          </View>

          <Calendar
            onDayPress={handleDayPress}
            markedDates={{ [selectedDate]: { selected: true } }}
          />

          <View style={{flexDirection:'row', paddingBottom:20}}>
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
    flex:1,
    marginTop: 16,
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginHorizontal:10
  },
  closeButton: {
    flex:1,
    marginTop: 16,
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginHorizontal:10
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default CalendarPicker;
