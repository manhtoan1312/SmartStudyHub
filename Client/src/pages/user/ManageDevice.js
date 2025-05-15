import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import {
  DeleteDevice,
  GetDevices,
  LogOut,
} from "../../services/PREMIUM/DevicesService";
import {
  AntDesign,
  FontAwesome6,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";

const ManageDevice = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  const fetchData = async () => {
    const response = await GetDevices();
    if (response.success) {
      setDevices(response.data);
    } else {
      Alert.alert("Get All devices error:", response.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectDevice = (id) => {
    if (selectedDevices.includes(id)) {
      setSelectedDevices(selectedDevices.filter((deviceId) => deviceId !== id));
    } else {
      setSelectedDevices([...selectedDevices, id]);
    }
  };

  const handleLogoutDevices = async () => {
    const ids = selectedDevices.map((id) => ({
      id: id,
    }));
    const response = await LogOut(ids);
    if (response.success) {
      setSelectedDevices([]);
      fetchData();
    } else {
      Alert.alert("Error logout devices:", response.message);
    }
  };

  const handleDeleteDevices = () => {
    Alert.alert(
      "Confirm action",
      "Are you sure you want to delete this devices?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Ok", onPress: () => confirmDelete() },
      ]
    );
  };
  const confirmDelete = async () => {
    const ids = selectedDevices.map((id) => ({
      id: id,
    }));
    const response = await DeleteDevice(ids);
    if (response.success) {
      setSelectedDevices([]);
      fetchData();
    } else {
      Alert.alert("Error delete devices:", response.message);
    }
  };
  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => handleSelectDevice(item.id)}
      style={styles.deviceContainer}
    >
      <View style={{ width: 30 }}>
        {selectedDevices.includes(item.id) ? (
          <Fontisto name="checkbox-active" size={24} color="black" />
        ) : (
          <Fontisto name="checkbox-passive" size={24} color="black" />
        )}
      </View>
      <View style={styles.deviceInfo}>
        <View>
          <Text style={styles.deviceName}>{item.deviceName}</Text>
          <Text>Type: {item.deviceType}</Text>
          <Text>Location: {item.location}</Text>
          <Text>IP Address: {item.ipAddress}</Text>
          <Text>Status: {item.status}</Text>
          <Text>
            Last Login: {new Date(item.timeLastLogin).toLocaleString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Manage Devices</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        {selectedDevices.length > 0 && (
          <View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogoutDevices}
            >
              <Text style={styles.logoutButtonText}>
                Logout Selected Devices
              </Text>
              <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleDeleteDevices}
            >
              <Text style={styles.logoutButtonText}>
                Delete Selected Devices
              </Text>
              <FontAwesome6 name="trash-can" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
  headerText: {
    paddingLeft: 10,
    fontWeight: "700",
    fontSize: 18,
  },
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  deviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deviceInfo: {
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },
  deviceName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#f00",
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
});

export default ManageDevice;
