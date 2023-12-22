import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Picker } from "react-native-wheel-pick";

const ChangePomodoro = ({ visible, initPomo, initTime, onClose, onSubmit }) => {
  const [pomoCount, setPomoCount] = useState(String(initPomo));
  const [pomoTime, setPomoTime] = useState(String(initTime));

  const handlePomoCountChange = (value) => {
    setPomoCount(value);
  };

  const handlePomoTimeChange = (value) => {
    setPomoTime(value);
  };

  const handleSubmit = () => {
    const pomoCountValue = parseInt(pomoCount, 10);
    const pomoTimeValue = parseInt(pomoTime, 10);

    if (!isNaN(pomoCountValue) && !isNaN(pomoTimeValue)) {
      onSubmit(pomoCountValue, pomoTimeValue);
    } else {
      onSubmit(initPomo, initTime)
    }
  };

  // Generate an array from 1 to 250
  const generateNumberArray = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, index) =>
      String(start + index)
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}
            >
              Pomodoro
            </Text>
            <Text>
              Estimate Pomodoro time: {pomoCount} x {pomoTime} M ={" "}
              {pomoCount * pomoTime} M
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between", paddingTop:20 }}
          >
            <View style={{ height: 250 }}>
              <View style={{padding:10, justifyContent:'center'}}><Text>Pomodoro estimate</Text></View>
              <Picker
                style={{
                  height: 40,
                  width: 150,
                }}
                selectedValue={pomoCount}
                onValueChange={handlePomoCountChange}
                pickerData={generateNumberArray(1, 250)}
              />
            </View>

            <View style={{ height: 250 }}>
              <View style={{padding:10, justifyContent:'center'}}><Text>Pomodoro time</Text></View>
              <Picker
                style={{
                  height: 40,
                  width: 150,
                }}
                selectedValue={pomoTime}
                onValueChange={handlePomoTimeChange}
                pickerData={generateNumberArray(1, 250)}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#ddd",
                marginRight: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#007BFF",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePomodoro;
