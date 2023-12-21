import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ResendOTP, ForgotPassword } from "../../services/AccountService";

function ForgotPasswordOTP({ route, navigation }) {
  const { email, otpCode, time } = route.params;
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  let expiredTime = time;
  let otp = otpCode;
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

  const handleResendOTP = async () => {
    if (!resendDisabled) {
      const newResponse = await ResendOTP(email);
      if (newResponse.success) {
        setOtpInput("");
        setNewPassword("");
        setCountdown(60);
        setResendDisabled(true);
        otp = newResponse.data.otpCode;
        expiredTime = newResponse.data.otpTimeExpiration;
      } else {
        Alert.alert("Resend OTP Failed", "Please try again.");
      }
    }
  };

  const handleNext = async () => {
    const currentTime = new Date().getTime();
    if (currentTime < expiredTime) {
      if (otpInput === otp) {
        const response = await ForgotPassword(email, newPassword, otpInput);
        if (response.success) {
          Alert.alert("Announce", response.message);
          navigation.navigate("Login");
        } else {
          Alert.alert("Invalid OTP", "Please enter the correct OTP.");
        }
      }
    } else {
      Alert.alert("OTP Expired", "The OTP has expired. Please resend OTP.");
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{paddingLeft:15, paddingTop:10}}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="angle-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SMART STUDY HUB</Text>
        </View>
        <Text style={styles.subTitle}>Enter OTP and New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otpInput}
            onChangeText={(text) => setOtpInput(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter New Password"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.resendText} onPress={handleResendOTP}>
          {resendDisabled
            ? `OTP was sent to your email. Resend OTP in ${countdown}s`
            : "Resend OTP"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Reset Password</Text>
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
    marginTop: 30,
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
  resendText: {
    marginTop: 20,
    color: "#007bff",
  },
});

export default ForgotPasswordOTP;
