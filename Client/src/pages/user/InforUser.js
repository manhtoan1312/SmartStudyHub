import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import getRole from "../../services/RoleService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { deleteAccount } from "../../services/UserService";
import { DeleteGuest } from "../../services/GuestService";

const InforUser = ({ navigation }) => {
  const [avt, setAvt] = useState("");
  const [name, setName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      getRole().then((role) => {
        if (role) {
          setName(role.email);
        }
      });
      const img = await AsyncStorage.getItem("img");
      const accName = await AsyncStorage.getItem("accountName");
      if (img) {
        setAvt(img);
      }
      if (accName) {
        setAccountName(accName);
      }
    };
    fetchData();
  }, []);


  const openEditNameModal = () => {
    setEditNameModalVisible(true);
  };

  const closeEditNameModal = () => {
    setEditNameModalVisible(false);
  };

  const openMoreOptionsModal = () => {
    setMoreOptionsModalVisible(true);
  };

  const closeMoreOptionsModal = () => {
    setMoreOptionsModalVisible(false);
  };

  const handleDeleteAccount = async () => {
    console.log('call delte acc')
    closeMoreOptionsModal();
    const rs = await deleteAccount();
    Alert.alert("Announcement", rs.message);
    navigation.navigate("Home");
  };

  const handleDeleteData = async () => {
    closeMoreOptionsModal();
    const id = await AsyncStorage.getItem("id");
    const rs = await DeleteGuest(id);
    Alert.alert("Announcement", rs.message);
    navigation.navigate("Home");
  };

  const handleLogout = async () => {
    Alert.alert("Warning!!", "Are you sure you want to log out?", [
      {
        text: "OK",
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.navigate("Home");
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleBack = async () => {
    try {
      await AsyncStorage.setItem("img", avt);
      await AsyncStorage.setItem("accountName", accountName);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error!", e);
    }
  };

  const handleNameChange = () => {
    if (newName) {
      setAccountName(newName);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={{ flex: 1, backgroundColor: "#eeeeee" }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBack()}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Account Detail</Text>
          <TouchableOpacity onPress={openMoreOptionsModal}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.infoContainer}>
            <TouchableOpacity
              onPress={() => openEditNameModal()}
              style={styles.infoItem}
            >
              <Text style={styles.infoLabel}>User Name</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.infoValue}>{accountName}</Text>
                <MaterialIcons name="navigate-next" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Avatar</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                  source={avt ? { uri: avt } : require("../../images/avt.jpg")}
                />
                <MaterialIcons name="navigate-next" size={24} color="black" />
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Account</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.infoValue}>{name}</Text>
                <MaterialIcons name="navigate-next" size={24} color="black" />
              </View>
            </View>
            <View
              style={styles.infoItem}
              onTouchEnd={() =>
                navigation.navigate("ChangePassword", { email: name })
              }
            >
              <Text style={styles.infoLabel}>Change Password</Text>
              <MaterialIcons name="navigate-next" size={24} color="black" />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Edit Name Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editNameModalVisible}
          onRequestClose={closeEditNameModal}
        >
          <TouchableWithoutFeedback onPress={closeEditNameModal}>
            <View style={styles.editNameModalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.editNameContent}>
                  <Text style={styles.editNameLabel}>Enter New Name</Text>
                  <TextInput
                    style={styles.editNameInput}
                    placeholder={accountName}
                    value={newName}
                    onChangeText={(text) => setNewName(text)}
                  />
                  <View style={styles.button}>
                    <TouchableOpacity
                      style={styles.editNameButton}
                      onPress={() => {
                        handleNameChange();
                        closeEditNameModal();
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "green",
                          fontSize: 16,
                        }}
                      >
                        Save
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.editNameButton}
                      onPress={closeEditNameModal}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "red",
                          fontSize: 16,
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* More Options Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={moreOptionsModalVisible}
          onRequestClose={closeMoreOptionsModal}
        >
          <TouchableWithoutFeedback onPress={closeMoreOptionsModal}>
            <View style={styles.moreOptionsModalContainer}>
              <View style={styles.moreOptionsButton}>
                <TouchableOpacity
                  onPress={() => handleDeleteData()}
                  style={{
                    borderBottomWidth: 1,
                    width: "100%",
                    alignItems: "center",
                    borderBottomColor: "#dddddd",
                    paddingBottom: 20,
                  }}
                >
                  <Text
                    style={{ color: "red", fontWeight: "600", fontSize: 16 }}
                  >
                    Delete Data
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteAccount()
                  }
                  style={{ paddingTop: 20 }}
                >
                  <Text
                    style={{ color: "red", fontWeight: "600", fontSize: 16 }}
                   
                  >
                    Delete Account
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.moreOptionsButton}
                  onPress={() => {
                    closeMoreOptionsModal();
                  }}
                >
                  <Text style={{ color: "red", fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  body: {
    backgroundColor: "white",
    marginTop: 30,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    color: "gray",
    marginRight: 10,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    top: 0,
    left: 0,
    backgroundColor: "white",
    elevation: 20,
    borderRadius: 5,
    width: 150,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  logoutButton: {
    marginTop: 30,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  logoutText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  editNameModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  editNameContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  editNameLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  editNameInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: "90%",
  },
  editNameButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    alignItems: "center",
    width: 100,
    marginHorizontal: 8,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  moreOptionsModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  moreOptionsButton: {
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: "white",
    marginHorizontal: 8,
    alignItems: "center",
    marginBottom: 20,
  },
});

export default InforUser;