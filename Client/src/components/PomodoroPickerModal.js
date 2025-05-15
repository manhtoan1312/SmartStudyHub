import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Picker } from "react-native-wheel-pick";


const PomodoroPickerModal = ({ visible, selectedValue, onSelect, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(selectedValue);

  const data = Array.from({ length: 255 }, (_, i) => i + 1); 

  const onValueChange = (index) => {
    setSelectedItem(data[index]-1);
  };

  const handleConfirm = () => {
    onSelect(selectedItem);
    onClose(); 
  };
  return (
    <Modal 
      animationType="slide"
      transparent={true}
      visible={ visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}> 
        <View style={styles.pickerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Pomodoro Picker</Text>
            <TouchableOpacity style={styles.doneButton} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
          <View  style={styles.pickerBody}>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={onValueChange}
                pickerData={data.map((value) => value.toString())} 
                selectedItem={selectedValue}
              />
    
              <Text style={styles.minuteText}>Minute</Text>
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
  pickerContainer: {
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    height: 200,
    width: "50%", // Adjust width of the wheel as needed
    backgroundColor: "white",
  },
  minuteText: {
    fontSize: 18,
    marginLeft: 20, 
  },
  doneButton: {
  },
  buttonText: { 
    fontSize:16,
    paddingHorizontal: 20,
  },
  pickerBody:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  }
});

export default PomodoroPickerModal;
