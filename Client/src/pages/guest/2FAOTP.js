import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { ResendOTP } from "../../services/AccountService";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import getRole from "../../services/RoleService";
import { CreateOrUpdateDevice } from "../../services/PREMIUM/DevicesService";
import { useDispatch } from "react-redux";
import { resetFocus } from "../../slices/focusSlice";
const TFAOTP = ({ route, navigation }) => {
  const { otpCode, time, email, token } = route.params;
  const [otpInput, setOtpInput] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const dispatch = useDispatch();
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
  const handleNext = async () => {
    const currentTime = new Date().getTime();
    if (currentTime < expiredTime) {
      if (otpInput === otp) {
        dispatch(resetFocus());
        await ClearData();
        try {
          await AsyncStorage.setItem("token", queryParams.token);
          const response = await getUserInfor();
          if (response.success) {
            await AsyncStorage.setItem("img", response.data.imageUrl);
            await AsyncStorage.setItem("accountName", `${response.data?.firstName} ${response.data?.lastName}`);
          }
          console.log("Token saved to AsyncStorage:", queryParams.token);
          navigation.goBack();
        } catch (error) {
          console.error("Failed to save token to AsyncStorage:", error);
          Alert.log("Login fail", "Please try again");
        }
        const role = await getRole();
        if (role.role) {
          if (role && role.role === "PREMIUM") {
            const response = await CreateOrUpdateDevice();
            if (!response.success) {
              console.log("Error update device, message:", response.message);
            }
          }
        }
        navigation.navigate("Home");
      } else {
        Alert.alert("Invalid OTP", "Please enter the correct OTP.");
      }
    } else {
      Alert.alert("OTP Expired", "The OTP has expired. Please resend OTP.");
    }
  };

  const handleResendOTP = async () => {
    if (!resendDisabled) {
      const newResponse = await ResendOTP(email);
      if (newResponse.success) {
        otp = newResponse.data.otpCode;
        expiredTime = newResponse.data.otpTimeExpiration;
        setCountdown(60);
        setResendDisabled(true);
      } else {
        Alert.alert("Resend OTP Failed", "Please try again.");
      }
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
          <Text style={styles.title}>Smart Study Hub</Text>
        </View>
        <Text style={styles.subTitle}>Enter OTP</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otpInput}
            onChangeText={(text) => setOtpInput(text)}
            placeholderTextColor={"#686868"}
            style={styles.input}
          />
        </View>
        <Text style={styles.resendText} onPress={handleResendOTP}>
          {resendDisabled
            ? `OTP was sent to your email. Resend OTP in ${countdown}s`
            : "Resend OTP"}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

export default TFAOTP;
