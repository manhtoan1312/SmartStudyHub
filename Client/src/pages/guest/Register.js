import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  EvilIcons,
} from "@expo/vector-icons";
import { Checkemail, ResendOTP } from "../../services/AccountService";

function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = async () => {
    if (email && password && firstName && lastName) {
      const rs = await Checkemail(email)
      if(rs.success){
        Alert.alert("Warnning", rs.message);
      }
      else{
        const response = await ResendOTP(email);
        
      if (response.success) {
        navigation.navigate("InputOTP", {
          otpCode: response.data.otpCode,
          time: response.data.otpTimeExpiration,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        });
      } else {
        Alert.alert("Register failed", response.message);
      }
      }
    } else {
      {
        Alert.alert("Warnning", "You must enter all field");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome
          style={styles.backIcon}
          name="angle-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SMART STUDY HUB</Text>
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <EvilIcons
            name="lock"
            size={24}
            color="black"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={hide}
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
          />

          <Feather
            name={hide ? "eye-off" : "eye"}
            onPress={() => setHide(!hide)}
            size={24}
            color="black"
            style={styles.showPasswordIcon}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            style={styles.halfInput}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 10,
    backgroundColor: "white",
    justifyContent: "flex-end",
  },
  backIcon: {
    paddingLeft: 10,
  },
  content: {
    flex: 5,
    paddingHorizontal: 60,
    paddingTop: 100,
  },
  titleContainer: {
    alignItems: "center",
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    color: "#e27602",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "gray",
    paddingBottom: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  showPasswordIcon: {
    position: "absolute",
    right: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFA500",
    marginTop: 40,
    padding: 15,
    borderRadius: 25,
    width: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  textMin: {
    fontSize: 14,
    marginTop: 10,
    color: "gray",
  },
  registerBtn: {
    marginTop: 20,
    borderColor: "#FFA500",
    borderWidth: 2,
    padding: 15,
    borderRadius: 25,
    width: 300,
    alignItems: "center",
  },
});

export default Register;
