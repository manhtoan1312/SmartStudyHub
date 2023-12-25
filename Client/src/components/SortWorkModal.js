import { AntDesign, Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import React from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";

const SortWorkModal = ({ isVisible, onChoose, onClose, type }) => {
  return (
    <Modal
      isVisible={isVisible}
      animationType="slide"
      transparent={true}
      onBackdropPress={onClose}
    >
      <TouchableOpacity style={styles.largeContainer} onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onChoose("DUEDATE")}
          >
            <View style={styles.body}>
              <View style={styles.content}>
              <MaterialIcons name="date-range" size={26} color="black" />
                <Text style={styles.buttonText}>Sort by due date</Text>
              </View>
              {type==='DUEDATE' && <View style={styles.icon}><AntDesign name="check" size={24} color="#FF3232" /></View>}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onChoose("PROJECT")}
          >
            <View style={styles.body}>
              <View style={styles.content}>
              <Octicons name="project" size={24} color="black" />
                <Text style={styles.buttonText}>Sort by project</Text>
              </View>
              {type==='PROJECT' && <View style={styles.icon}><AntDesign name="check" size={24} color="#FF3232" /></View>}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onChoose("PRIORITY")}
          >
            <View style={styles.body}>
              <View style={styles.content}>
              <Feather name="flag" size={24} color="black" />
                <Text style={styles.buttonText}>Sort by priority</Text>
              </View>
              {type==='PRIORITY' && <View style={styles.icon}><AntDesign name="check" size={24} color="#FF3232" /></View>}
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal:40,
    borderTopRightRadius:40,
    borderTopLeftRadius: 40
  },
  button: {
    paddingVertical:10
  },
  buttonText: {
    fontWeight: "400",
    textAlign: "center",
    paddingLeft:15,
    fontSize:16,
    color:'#666666'
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 200,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  largeContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  body:{
    justifyContent:'space-between'
  },
  content:{
    flexDirection:'row',
    alignItems:'center'
  },
  icon:{
    position:"absolute",
    right:0
  }
});

export default SortWorkModal;
