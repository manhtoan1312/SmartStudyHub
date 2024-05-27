import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ThemeBody from "../../components/ThemeBody";
import DeletedThemeBody from "../../components/DeletedThemeBody";
import getRole from "../../services/RoleService";
import DeleteAllFileByType from "../../services/PREMIUM/FilePremiumService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Theme = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [checkRole, setCheckRole] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger re-renders

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getRole();
      console.log(role);
      if (role && role?.role === "PREMIUM") {
        setCheckRole(true);
      }
    };
    fetchRole();
  }, []);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setModalVisible(false);
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [selectedMode]);

  const handleShowChoose = () => {
    if (checkRole) {
      setModalVisible(!modalVisible);
    }
  };

  const handleDeleteAllTheme = () => {
    Alert.alert(
      "Confirm action",
      "Are you sure you want to delete all themes?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Ok", onPress: () => confirmDelete() },
      ]
    );
  };

  const confirmDelete = async () => {
    setModalVisible(!modalVisible);
    const response = await DeleteAllFileByType("THEME");
    if (response.success) {
      Alert.alert("Action success", "Delete all themes successfully");
      setRefreshKey((prevKey) => prevKey + 1); 
    } else {
      Alert.alert("Action fail", response.message);
    }
  };

  return (
    <View style={{ backgroundColor: "#eeeeee", flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Theme</Text>
        <TouchableOpacity onPress={() => handleShowChoose()}>
          <MaterialIcons
            name="more-vert"
            size={24}
            color={checkRole ? "black" : "white"}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TouchableOpacity
              style={[styles.modeItem, selectedMode === 0 && styles.selected]}
              onPress={() => handleModeChange(0)}
            >
              <Text>Current Themes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeItem, selectedMode === 1 && styles.selected]}
              onPress={() => handleModeChange(1)}
            >
              <Text>Deleted Themes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modeItem}
              onPress={() => handleDeleteAllTheme()}
            >
              <Text>Delete All Themes</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {selectedMode === 0 ? (
        <ThemeBody navigation={navigation} refreshKey={refreshKey} />
      ) : (
        <DeletedThemeBody refreshKey={refreshKey} />
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 5,
    marginHorizontal: 10,
    top: 120,
  },
  modeItem: {
    marginVertical: 10,
    padding: 10,
  },
  selected: {
    backgroundColor: "#f7c068",
  },
});

export default Theme;
