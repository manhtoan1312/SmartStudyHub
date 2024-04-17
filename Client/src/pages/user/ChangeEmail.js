import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChangeEmailUser,
  SendOTPChangePassword,
} from "../../services/UserService";
import { ResendOTP } from "../../services/AccountService";

function ChangeEmail({ route, navigation }) {
  const email = route.params.email;
  const [otpInput, setOtpInput] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [otp, setOtp] = useState(route.params.otpCode);
  const [time, setTime] = useState(route.params.time);

  const sendOTP = async () => {
    const newResponse = await ResendOTP(email);
    if (newResponse.success) {
      setCountdown(60);
      setResendDisabled(true);
      setTime(newResponse.data.otpTimeExpiration);
      setOtp(newResponse.data.otpCode);
    } else {
      Alert.alert("Sending OTP Failed", newResponse.message);
    }
  };


  useEffect(() => {
    let interval;
    if (countdown > 0 && resendDisabled) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [countdown, resendDisabled]);

  const handleNext = async () => {
    const currentTime = new Date().getTime();
    if (currentTime < time) {
      if (otpInput === otp) {
        const response = await ChangeEmailUser(email, otpInput);
        if (response.success) {
          Alert.alert("Change Email success!", "please login again");
          handleLogin()
        } else if(!response.success) {
          Alert.alert("Error", response.message);
        }
        else{
          Alert.alert("Error", "Wrong or expired token, please log in again", [
            ,
            { text: "OK", onPress: () => {handleLogin()} },
          ]);
        }
      } else {
        Alert.alert("Invalid OTP", "Please enter the correct OTP.");
      }
    } else {
      Alert.alert("OTP Expired", "The OTP has expired. Please resend OTP.");
    }
  };

  const handleLogin = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const keysToRemove = allKeys.filter(key => key !== '2FA');
    await AsyncStorage.multiRemove(keysToRemove);
    navigation.navigate("Login");
  };
  const handleResendOTP = async () => {
    if (!resendDisabled) {
      sendOTP();
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
          <Text style={styles.title}>SMART STUDY HUB</Text>
        </View>
       
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otpInput}
            onChangeText={(text) => setOtpInput(text)}
            style={styles.input}
            placeholderTextColor={'#686868'}

          />
        </View>

        <Text style={styles.resendText} onPress={handleResendOTP}>
          {resendDisabled
            ? `OTP was sent to your email. Resend OTP in ${countdown}s`
            : "Resend OTP"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
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

export default ChangeEmail;
