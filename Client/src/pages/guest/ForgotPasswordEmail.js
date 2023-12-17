import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Checkemail, ResendOTP } from "../../services/AccountService";

function ForgotPasswordEmail({ navigation }) {
  const [email, setEmail] = useState("");

  const handleCheckEmail = async () => {
    if (email) {
      const response = await ResendOTP(email);
      if (response.success) {
        navigation.navigate("ForgotPasswordOTP", {
            otpCode: response.data.otpCode,
            time: response.data.otpTimeExpiration,
            email: email,
        });
      } else {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      }
    } else {
      Alert.alert("Warning", "Please enter your email.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="angle-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>FORGOT PASSWORD</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCheckEmail}>
            <Text style={styles.buttonText}>Next</Text>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 5,
    paddingHorizontal: 60,
    paddingTop: 100,
  },
  titleContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#e27602",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "#e27602",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "gray",
    paddingBottom: 10,
    alignItems: "center",
    marginBottom: 20,
    marginTop:30
  },
  input: {
    flex: 1,
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
  disabledButton: {
    backgroundColor: "#ccc",
  },
  resendText: {
    marginTop: 20,
    color: "#007bff",
  },
  registerButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  registerButtonText: {
    fontSize: 16,
    color: "#007bff",
  },
});

export default ForgotPasswordEmail;
