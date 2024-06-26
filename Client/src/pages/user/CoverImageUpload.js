// Avt.js
import { View, Text, TouchableOpacity, StyleSheet,Alert } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import AvatarList from "../../components/AvatarList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeleteAllAvatar } from "../../services/Guest/UploadFile";
import CoverImageList from "../../components/CoverImageList";

const CoverImageUpload = ({ route, navigation }) => {
  const handleDeleteAll = () => {
    Alert.alert(
      "Confirm action",
      "Are you sure you want to delete all cover image?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Ok", onPress: () => confirmDelete() },
      ]
    );
  };

  const confirmDelete = async () => {
    const response = await DeleteAllAvatar("COVERIMAGE");
    if (response.success) {
      Alert.alert("Action success", "Delete all cover image successfully");
      navigation.goBack();
    } else {
      Alert.alert("Action fail", response.message);
    }
  };
  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cover Image Uploaded</Text>
        <TouchableOpacity onPress={() => handleDeleteAll()}>
          <EvilIcons name="trash" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View
        style={{ marginHorizontal: 5, marginTop: 40, alignItems: "center" }}
      >
        <CoverImageList information={route.params.infor} navigation={navigation} />
      </View>
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
});

export default CoverImageUpload;
