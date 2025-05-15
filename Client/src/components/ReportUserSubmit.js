import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const ReportUserSubmit = ({ title, visible, onClose, onSubmit }) => {
  const [description, setDescription] = useState("");

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.modalBackground} onPress={onClose}>
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.header}>
              <AntDesign name="checkcircle" size={24} color="green" />
              <Text style={styles.headerText}>You chose</Text>
              <Pressable onPress={onClose}>
                <AntDesign name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                We will use your comments to prevent violations and make the
                application environment more civilized.
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Can you tell us more information?
              </Text>
              <TextInput
                value={description}
                placeholder="Description"
                onChangeText={(e) => setDescription(e)}
                multiline
                style={styles.textInput}
              />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable
                style={styles.submitButton}
                onPress={() => {
                  onSubmit(description);
                  setDescription("");
                }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.submitButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: height * 0.5,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between",
    paddingBottom: 40,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  titleContainer: {
    padding: 10,
    backgroundColor: "#B4F7FA",
    alignItems: "center",
    borderRadius: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    width: 150,
  },
  cancelButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    width: 150,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReportUserSubmit;
