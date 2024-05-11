import React from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity, View, Text } from "react-native";

const RepeatSelection = ({
  typeRepeat,
  unitRepeat,
  amountRepeat,
  daysOfWeekRepeat,
  visible,
  onClose,
}) => {
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
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.back}>
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
                <View style={styles.repeatItem} key={index}>
                  <Text style={styles.repeatText}>{item.label}</Text>
                  {unitRepeat === item.key && (
                    <Entypo name="check" size={20} color="orange" />
                  )}
                </View>
              ))}
            </View>
          </View>
          <View style={styles.repeatBody}>
            <TouchableOpacity style={styles.repeatItem}>
              <Text>Custom</Text>
              {unitRepeat === "CUSTOM" ? (
                <Entypo name="check" size={20} color="orange" />
              ) : (
                <AntDesign name="right" size={20} color="gray" />
              )}
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
