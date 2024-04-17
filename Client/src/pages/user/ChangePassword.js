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
  SendOTPChangePassword,
  changePassword,
} from "../../services/UserService";
import getRole from "../../services/RoleService";

function ChangePassword({ route, navigation }) {
  const email = route.params.email;
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);
  const [otp, setOtp] = useState('')
  const [time, setTime] = useState()
  const sendOTP = async () => {
    const newResponse = await SendOTPChangePassword(email);
    if (newResponse.success) {
      setCountdown(60);
      setResendDisabled(true);
      setTime(newResponse.data.otpTimeExpiration);
      setOtp(newResponse.data.otpCode)
    } else {
      Alert.alert("Sending OTP Failed", newResponse.message);
    }
  };
  useEffect(() => {
    sendOTP();
  }, []);
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
    if (password === rePassword) {
      const currentTime = new Date().getTime();
      if (currentTime < time) {
        if (otpInput === otp) {
          const response = await changePassword(email, password, otpInput);
          if(response.success) {
            Alert.alert('Change Password success!',"please login again")
            await AsyncStorage.clear()
            navigation.navigate('Login')
          }
          
        } else {
          Alert.alert("Invalid OTP", "Please enter the correct OTP.");
          setOtpInput('')
        }
      } else {
        Alert.alert("OTP Expired", "The OTP has expired. Please resend OTP.");
        setOtpInput('')
      }
    }
    else{
      Alert.alert('Warning',"passwords are not the same")
      setPassword('')
      setRePassword('')
    }
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
            placeholderTextColor={'#686868'}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!passwordVisible}
            placeholderTextColor={'#686868'}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ?  "eye" : "eye-off"}
              size={24}
              color="black"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Re-enter Password"
            value={rePassword}
            onChangeText={(text) => setRePassword(text)}
            secureTextEntry={!rePasswordVisible}
            placeholderTextColor={'#686868'}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setRePasswordVisible(!rePasswordVisible)}
          >
            <Ionicons
              name={rePasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="black"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.resendText} onPress={handleResendOTP}>
          {resendDisabled
            ? `OTP was sent to your email. Resend OTP in ${countdown}s`
            : "Resend OTP"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Change Password</Text>
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
    marginBottom:20,
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
  eyeIcon: {
    marginRight: 10,
  },
});

export default ChangePassword;
