import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,Clipboard,Alert, SafeAreaView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const HelpAndFeedBack = ({ navigation }) => {
    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert("Copied to Clipboard", `Copied: ${text}`);
      };
    
      const openEmail = async () => {
        const email = "nmt2002vn@gmail.com";
        copyToClipboard(email);
      };
    
      const openFacebook = async () => {
        const facebookProfile = "https://www.facebook.com/steven.nguyen.14473426";
        copyToClipboard(facebookProfile);
      };
    
      const openCall = async () => {
        const phoneNumber = "0907686495";
        copyToClipboard(phoneNumber);
      };
  return (
    <View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ backgroundColor: "#eeeeee" }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerText}>HELP AND FEEDBACK</Text>
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <View style={styles.body}>
              <View style={styles.infoContainer}>
                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={openEmail}
                >
                  <Text style={styles.infoLabel}>Email</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={styles.infoValue}
                    >nmt2002vn@gmail.com</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={openFacebook}
                >
                  <Text style={styles.infoLabel}>Facebook</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={styles.infoValue}
                    >Manh Toan</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={openCall}
                >
                  <Text style={styles.infoLabel}>Hot line</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={styles.infoValue}
                    >0907686495</Text>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.body}>
              <View style={styles.infoContainer}>
                <TouchableOpacity
                  style={styles.infoItem}
                  onPress={() => navigation.navigate('Report')}
                >
                  <Text style={styles.infoLabel}>Feed back & Report</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons
                      name="navigate-next"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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

export default HelpAndFeedBack;
