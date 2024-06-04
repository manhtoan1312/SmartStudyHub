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
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import getRole from "../../services/RoleService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import {
  CheckPasswordCorrect,
  CleanData,
  deleteAccount,
  getUserInfor,
  updateInformation,
} from "../../services/UserService";
import { DeleteGuest, UpdateTimeLastUse } from "../../services/GuestService";
import { ResendOTP } from "../../services/AccountService";
import { useIsFocused } from "@react-navigation/native";
import PhoneInputModal from "../../components/PhoneInputModal";
import DateOfBirthPickerModal from "../../components/DateOfBirthPickerModal";
import AddressPicker from "../../components/AddressPicker";
import ClearData from "../../services/ClearData";
const InforUser = ({ navigation }) => {
  const [infor, setInfor] = useState(null);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isPhoneInputModalVisible, setPhoneInputModalVisible] = useState(false);
  const [isDateOfBirthVisible, setDateOfBirthVisibl] = useState(false);
  const [isAddressVisible, setAddressVisible] = useState(false);

  const isFocused = useIsFocused();

  const fetchData = async () => {
    const response = await getUserInfor();
    if (response?.success) {
      setInfor(response.data);
      setNewFirstName(response.data.firstName);
      setNewLastName(response.data.lastName);
    } else {
      Alert.alert("Error", "Wrong or expired token, please log in again", [
        ,
        { text: "OK", onPress: () => handleLogin() },
      ]);
    }
  };
  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);
  const openEditNameModal = () => {
    setEditNameModalVisible(true);
  };

  const updateInfor = async () => {
    const response = await updateInformation(
      infor.phoneNumber ? infor.phoneNumber : null,
      infor.firstName,
      infor.lastName,
      infor.address ? infor.address : null,
      infor.dateOfBirth ? infor.dateOfBirth : null,
      infor.country ? infor.country : null,
      infor.imageUrl,
      infor?.isTwoFactor ? infor?.isTwoFactor : false,
      infor?.coverImage ? infor?.coverImage : null,
    );
    if (!response.success) {
      Alert.alert("Change User Information fail", response.message);
    } else {
      await AsyncStorage.setItem(
        "accountName",
        `${response.message.firstName} ${response.message.lastName}`
      );
    }
  };

  const handleLogin = async () => {
    await ClearData();
    navigation.goBack();
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

  const openPasswordModal = () => {
    setPasswordModalVisible(true);
  };

  const closePasswordModal = () => {
    setPasswordModalVisible(false);
    setPasswordInput("");
  };

  const handleSubmitPassword = async () => {
    const response = await CheckPasswordCorrect(passwordInput);
    if (response.success) {
      const rs = await ResendOTP(emailInput);
      if (rs.success) {
        updateInfor();
        navigation.navigate("ChangeEmail", {
          email: emailInput,
          otpCode: rs.data.otpCode,
          time: rs.data.otpTimeExpiration,
        });
      }
    } else {
      Alert.alert("Error!", response.message);
    }
    closePasswordModal();
  };

  const handleDeleteAccount = async () => {
    closeMoreOptionsModal();
    Alert.alert(
      "Confirm action",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => confirmDeleteAcc() },
      ]
    );
  };
  const confirmDeleteAcc = async () => {
    const rs = await deleteAccount();
    Alert.alert("Announcement", rs.message);
    navigation.navigate("Home");
  };

  const handleDeleteData = () => {
    closeMoreOptionsModal();
    Alert.alert(
      "Confirm action",
      "Are you sure you want to delete data of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => confirmDeleteData() },
      ]
    );
  };

  const confirmDeleteData = async () => {
    closeMoreOptionsModal();
    const rs = await CleanData();
    Alert.alert("Announcement", rs.message);
    navigation.navigate("Home");
  };

  const handleLogout = async () => {
    Alert.alert("Warning!!", "Are you sure you want to log out?", [
      {
        text: "OK",
        onPress: async () => {
          await ClearData();
          const response = await UpdateTimeLastUse();
          if (!response.success) {
            Alert.alert("Update time last use fail");
          }
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
      await updateInfor();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error!", e);
    }
  };

  const handleNameChange = () => {
    if (newFirstName && newLastName) {
      setInfor({
        ...infor,
        firstName: newFirstName,
        lastName: newLastName,
      });
    }
    closeEditNameModal();
  };
  const handlePhoneChange = (phone) => {
    if (phone) {
      setInfor({
        ...infor,
        phoneNumber: phone,
      });
    }
    setPhoneInputModalVisible(false);
  };

  const handleDateChange = (date) => {
    if (date) {
      setInfor({
        ...infor,
        dateOfBirth: date,
      });
    }
    setDateOfBirthVisibl(false);
  };
  const handleAddressChange = (add) => {
    if (add) {
      setInfor({
        ...infor,
        address: add,
      });
    }
    setAddressVisible(false);
  };

  const handleSelectGallery = async () => {
    navigation.navigate("AvtUploaded", {
      infor: infor,
    });
  };
  const handleSelectCoverImage = async () => {
    navigation.navigate("CoverImageUpload", {
      infor: infor,
    });
  };

  const handle2FAChange = (value) => {
    setInfor({ ...infor, isTwoFactor: value });
  };

  return (
    <View>
      {infor && (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ backgroundColor: "#eeeeee" }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => handleBack()}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Profile</Text>
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
                    <Text
                      style={styles.infoValue}
                    >{`${infor?.firstName} ${infor?.lastName}`}</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSelectGallery}
                  style={styles.infoItem}
                >
                  <Text style={styles.infoLabel}>Avatar</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 10,
                      }}
                      source={{ uri: infor?.imageUrl }}
                    />
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSelectCoverImage}
                  style={styles.infoItem}
                >
                  <Text style={styles.infoLabel}>Cover Image</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {infor.coverImage ? (
                      <Image
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 10,
                        }}
                        source={{ uri: infor?.coverImage }}
                      />
                    ) : (
                      <Text style={styles.infoValue}>
                        None
                      </Text>
                    )}
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openPasswordModal}
                  style={styles.infoItem}
                >
                  <Text style={styles.infoLabel}>Account</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.infoValue}>{infor?.email}</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={() => setPhoneInputModalVisible(true)}
                >
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.infoValue}>{infor?.phoneNumber}</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={() => setDateOfBirthVisibl(true)}
                >
                  <Text style={styles.infoLabel}>Date of Birth</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.infoValue}>
                      {infor?.dateOfBirth
                        ? new Date(infor?.dateOfBirth).toDateString()
                        : null}
                    </Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={() => setAddressVisible(true)}
                >
                  <Text style={styles.infoLabel}>Address</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.infoValue}>{infor?.address}</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={() => {
                    updateInfor();
                    navigation.navigate("ChangePassword", {
                      email: infor.email,
                    });
                  }}
                >
                  <Text style={styles.infoLabel}>Change Password</Text>
                  <MaterialIcons name="navigate-next" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoItem} onPress={() => {}}>
                  <Text style={styles.infoLabel}>
                    Two-Factor Authentication
                  </Text>
                  <Switch
                    trackColor={{ false: "gray", true: "red" }}
                    thumbColor={"white"}
                    value={infor?.isTwoFactor ? infor?.isTwoFactor : false}
                    onValueChange={handle2FAChange}
                  />
                </TouchableOpacity>
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
                      {/* First Name Input */}
                      <TextInput
                        style={styles.editNameInput}
                        placeholder="Enter first name"
                        value={newFirstName}
                        placeholderTextColor={"#686868"}
                        onChangeText={(text) => setNewFirstName(text)}
                      />
                      {/* Last Name Input */}
                      <TextInput
                        style={styles.editNameInput}
                        placeholder="Enter last name"
                        value={newLastName}
                        placeholderTextColor={"#686868"}
                        onChangeText={(text) => setNewLastName(text)}
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
                          onPress={() => {
                            closeEditNameModal();
                            setNewFirstName(infor.firstName);
                            setNewLastName(infor.lastName);
                          }}
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
                      onPress={() => handleDeleteAccount()}
                      style={{
                        width: "100%",
                        alignItems: "center",
                        borderBottomColor: "#dddddd",
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontWeight: "600",
                          fontSize: 16,
                        }}
                      >
                        Delete Account
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.moreOptionsButton}>
                    <TouchableOpacity
                      onPress={() => handleDeleteData()}
                      style={{
                        width: "100%",
                        alignItems: "center",
                        borderBottomColor: "#dddddd",
                      }}
                    >
                      <Text
                        style={{
                          color: "red",
                          fontWeight: "600",
                          fontSize: 16,
                        }}
                      >
                        Delete Data
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

            <Modal
              animationType="slide"
              transparent={true}
              visible={passwordModalVisible}
              onRequestClose={closePasswordModal}
            >
              <TouchableWithoutFeedback onPress={closePasswordModal}>
                <View style={styles.editNameModalContainer}>
                  <TouchableWithoutFeedback>
                    <View style={styles.editNameContent}>
                      <Text style={styles.editNameLabel}>Change Email</Text>
                      {/* Password Input */}
                      <TextInput
                        style={styles.editNameInput}
                        placeholder="Enter new email"
                        keyboardType="email-address"
                        value={emailInput}
                        onChangeText={(text) => setEmailInput(text)}
                        placeholderTextColor={"#686868"}
                      />
                      <TextInput
                        style={styles.editNameInput}
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        value={passwordInput}
                        placeholderTextColor={"#686868"}
                        onChangeText={(text) => setPasswordInput(text)}
                      />
                      <View style={styles.button}>
                        <TouchableOpacity
                          style={styles.editNameButton}
                          onPress={handleSubmitPassword}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              color: "green",
                              fontSize: 16,
                            }}
                          >
                            Submit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.editNameButton}
                          onPress={closePasswordModal}
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
            <PhoneInputModal
              isVisible={isPhoneInputModalVisible}
              phoneNum={infor?.phoneNumber ? infor?.phoneNumber : ""}
              onClose={() => setPhoneInputModalVisible(false)}
              onSubmit={handlePhoneChange}
            />
            <DateOfBirthPickerModal
              isVisible={isDateOfBirthVisible}
              date={infor?.dateOfBirth ? infor?.dateOfBirth : ""}
              onClose={() => setDateOfBirthVisibl(false)}
              onDateChange={handleDateChange}
            />
            <AddressPicker
              isVisible={isAddressVisible}
              add={infor?.address ? infor?.address : ""}
              onClose={() => setAddressVisible(false)}
              onSubmit={handleAddressChange}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
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
