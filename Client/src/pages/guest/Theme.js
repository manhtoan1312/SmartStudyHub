import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ThemeBody from "../../components/ThemeBody";
import DeletedThemeBody from "../../components/DeletedThemeBody";
import getRole from "../../services/RoleService";

const Theme = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [checkRole, setCheckRole] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  useEffect(() => {
    const fetchRole = async () => {
      const role = await getRole();
      console.log(role)
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
          </View>
        </TouchableOpacity>
      </Modal>
      {selectedMode === 0 ? (
        <ThemeBody navigation={navigation} />
      ) : (
        <DeletedThemeBody />
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
