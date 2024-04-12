// Avt.js
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AvatarList from "../../components/AvatarList";

const AvatarUploaded = ({ route, navigation }) => {
  return (
    <View style={{ backgroundColor: "#eeeeee" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Avatar Uploaded</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View
        style={{ marginHorizontal: 5, marginTop: 40, alignItems: "center" }}
      >
        <AvatarList information={route.params.infor} navigation={navigation} />
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

export default AvatarUploaded;
