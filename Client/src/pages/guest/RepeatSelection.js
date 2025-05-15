import React, { useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import ModalCustomRepeat from "../../components/ModalCustomRepeat";

const RepeatSelection = ({
  typeRepeat,
  unitRepeat,
  amountRepeat,
  daysOfWeekRepeat,
  visible,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState(typeRepeat);
  const [customVisible, setCustomVisible] = useState(false);
  const [selectedDaysOfWeekRepeat, setSelectedDaysOfWeekRepeat] =
    useState(daysOfWeekRepeat);
  const [selectedUnitRepeat, setSelectedUnitRepeat] = useState(unitRepeat);
  const [selectedAmountRepeat, setSelectedAmounRepeat] = useState(amountRepeat);
  const optionList = [
    {
      label: "None",
      key: null,
    },
    {
      label: "Daily",
      key: "DAILY",
    },
    {
      label: "Ordinary day",
      key: "ORDINARY DAY",
    },
    {
      label: "Weekend",
      key: "WEEKEND",
    },
    {
      label: "One Every Two Weeks",
      key: "ONCE EVERY TWO WEEKS",
    },
    {
      label: "Monthly",
      key: "MONTHLY",
    },
    {
      label: "Every Three Months",
      key: "EVERY THREE MONTH",
    },
    {
      label: "Every Six Months",
      key: "EVERY SIX MONTH",
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

  const handleCustom = () => {
    setSelectedType("CUSTOM");
    setCustomVisible(true);
  };

  const handleCloseCustom = (unit, amount, day) => {
    setSelectedUnitRepeat(unit);
    setSelectedAmounRepeat(amount);
    setSelectedDaysOfWeekRepeat(day);
    setCustomVisible(false);
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
    onClose(
      selectedType,
      selectedUnitRepeat,
      selectedAmountRepeat,
      selectedDaysOfWeekRepeat
    );
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
            <Text style={styles.headerText}>Repeat</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.repeatBody}>
              {optionList.map((item, index) => (
                <TouchableOpacity
                  onPress={() => setSelectedType(item.key)}
                  style={styles.repeatItem}
                  key={index}
                >
                  <Text style={styles.repeatText}>{item.label}</Text>
                  {selectedType === item.key && (
                    <Entypo name="check" size={20} color="orange" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.repeatBody}>
            <TouchableOpacity onPress={handleCustom} style={styles.repeatItem}>
              <Text>Custom</Text>
              {selectedType === "CUSTOM" ? (
                <Entypo name="check" size={20} color="orange" />
              ) : (
                <AntDesign name="right" size={20} color="gray" />
              )}
            </TouchableOpacity>
          </View>
          {selectedType === "CUSTOM" && (
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
          )}
        </View>
      </View>
      {selectedType === "CUSTOM" && (
        <ModalCustomRepeat
          unitRepeat={selectedUnitRepeat}
          amountRepeat={selectedAmountRepeat}
          daysOfWeekRepeat={selectedDaysOfWeekRepeat}
          visible={customVisible}
          onClose={handleCloseCustom}
        />
      )}
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
    height: "95%",
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
});

export default RepeatSelection;
