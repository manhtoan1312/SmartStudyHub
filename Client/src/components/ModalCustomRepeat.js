import React, { useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Picker } from "react-native-wheel-pick";

const ModalCustomRepeat = ({
  unitRepeat,
  amountRepeat,
  daysOfWeekRepeat,
  visible,
  onClose,
}) => {
  const [selectUnitVisible, setSelectUnitVisible] = useState(false);
  const [selectAmountVisible, setSelectAmountVisible] = useState(false);
  const [selectedUnitRepeat, setSelectedUnitRepeat] = useState(
    unitRepeat !== null ? unitRepeat : "DAY"
  );
  const [selectedAmountRepeat, setSelectedAmounRepeat] = useState(
    amountRepeat !==null ? amountRepeat : 1
  );
  const [selectedDaysOfWeekRepeat, setSelectedDaysOfWeekRepeat] = useState(
    daysOfWeekRepeat && daysOfWeekRepeat.length > 0 ? daysOfWeekRepeat : [2]
  );
  
  const optionUnitRepeat = [
    {
      label: "Every day",
      key: "DAY",
    },
    {
      label: "Every week",
      key: "WEEK",
    },
    {
      label: "Every Month",
      key: "MONTH",
    },
    {
      label: "Every Year",
      key: "YEAR",
    },
  ];
  const optionWeek = [
    {
      label: "Monday",
      key: 2,
    },
    {
      label: "Tuesday",
      key: 3,
    },
    {
      label: "Wednesday",
      key: 4,
    },
    {
      label: "Thursday",
      key: 5,
    },
    {
      label: "Friday",
      key: 6,
    },
    {
      label: "Saturday",
      key: 7,
    },
    {
      label: "Sunday",
      key: 8,
    },
  ];

  let amountList = [];
  for (let i = 1; i <= 250; i++) {
    amountList.push({ label: i.toString(), key: i });
  }

  const renderPicker = (
    label,
    selectedValue,
    onValueChange,
    data,
    isPickerVisible,
    setPickerVisibility,
    unit,
    pick
  ) => {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setPickerVisibility(!isPickerVisible)}
          >
            <Text style={styles.labelText}>{label}</Text>
            <View style={styles.pickerButton}>
              <Text style={styles.selectedValueText}>
                {selectedValue} {unit}
              </Text>
              <AntDesign
                style={styles.pickerIcon}
                name={isPickerVisible ? "up" : "down"}
              />
            </View>
          </TouchableOpacity>
          {isPickerVisible && (
            <View style={styles.pickerBody}>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={onValueChange}
                pickerData={data.map((item) => ({
                  label: item.label,
                  value: item.key,
                }))}
                selectedItem={selectedValue}
                onItemSelected={() => {
                  setPickerVisibility(false);
                  onValueChange();
                }}
              />
              <Text style={styles.minuteText}>{pick}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };

  const handleUnitRepeatChange = (value) => {
    setSelectedUnitRepeat(value);
  };
  const handleAmountRepeatChange = (value) => {
    setSelectedAmounRepeat(parseInt(value));
  };
  const handleDaysOfWeekRepeatChange = (key) => {
    if (key !== 2) {
      if (selectedDaysOfWeekRepeat.includes(key)) {
        setSelectedDaysOfWeekRepeat(
          selectedDaysOfWeekRepeat.filter((item) => item !== key)
        );
      } else {
        setSelectedDaysOfWeekRepeat([...selectedDaysOfWeekRepeat, key]);
      }
    }
  };

  const renderDay = () => {
    const days = optionWeek
      .filter((day) => selectedDaysOfWeekRepeat.includes(day.key))
      .map((day) => day.label);
    let formattedDays = days.join(", ");
    const lastIndex = formattedDays.lastIndexOf(", ");
    if (lastIndex !== -1) {
      formattedDays =
        formattedDays.substring(0, lastIndex) +
        " and" +
        formattedDays.substring(lastIndex + 1);
    }
    return `at ${formattedDays}.`;
  };

  const handleClose = () => {
    onClose(selectedUnitRepeat, selectedAmountRepeat, selectedDaysOfWeekRepeat);
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.back}>
              <AntDesign
                name="left"
                color="black"
                style={[{ paddingHorizontal: 5 }, styles.headerText]}
              />
              <Text style={styles.headerText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Custom</Text>
          </View>
          <ScrollView>
            <View style={styles.body}>
              <View style={styles.repeatBody}>
                {renderPicker(
                  "Frequency",
                  String(selectedUnitRepeat),
                  handleUnitRepeatChange,
                  optionUnitRepeat,
                  selectUnitVisible,
                  setSelectUnitVisible,
                  "",
                  ""
                )}
                {renderPicker(
                  "Every",
                  selectedAmountRepeat,
                  handleAmountRepeatChange,
                  amountList,
                  selectAmountVisible,
                  setSelectAmountVisible,
                  String(selectedUnitRepeat),
                  String(selectedUnitRepeat)
                )}
              </View>
            </View>
            <Text style={{ paddingHorizontal: 25, fontSize: 12 }}>
              Repeat will start at every{" "}
              {selectedAmountRepeat !== 1 ? `${selectedAmountRepeat} ` : ""}
              {selectedAmountRepeat !== 1 ||
              selectedUnitRepeat !== "WEEK" ||
              selectedDaysOfWeekRepeat.length !== 7
                ? selectedUnitRepeat
                : "day"}{" "}
              {selectedUnitRepeat === "WEEK" &&
                selectedDaysOfWeekRepeat.length > 1 &&
                selectedDaysOfWeekRepeat.length < 7 &&
                renderDay()}
            </Text>
            <View>
              {selectedUnitRepeat === "WEEK" && (
                <View style={styles.repeatBody}>
                  {optionWeek.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => handleDaysOfWeekRepeatChange(item.key)}
                      style={styles.repeatItem}
                      key={index}
                    >
                      <Text style={styles.repeatText}>{item.label}</Text>
                      {selectedDaysOfWeekRepeat.includes(item.key) && (
                        <Entypo name="check" size={20} color="orange" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    bottom: 0,
    backgroundColor: "#F0F2F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 5,
    top: 0,
  },
  headerText: {
    fontSize: 20,
    color: "#FC9853",
  },
  repeatBody: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  repeatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EDEDED",
  },
  repeatText: {
    fontSize: 16,
  },
  body: {
    marginTop: 50,
  },
  container: {
    paddingVertical: 10,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 900,
  },
  selectedValueText: {
    color: "gray",
    fontSize: 18,
    paddingRight: 5,
  },
  pickerIcon: {
    fontSize: 18,
  },
  picker: {
    height: 200,
    width: "70%", // Adjust width of the wheel as needed
    backgroundColor: "white",
  },
  minuteText: {
    fontSize: 18,
    marginLeft: 20,
  },
  doneButton: {},
  buttonText: {
    fontSize: 16,
    paddingHorizontal: 20,
  },
  pickerBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ModalCustomRepeat;
