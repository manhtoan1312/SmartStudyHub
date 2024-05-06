// RecoverAccount.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,SafeAreaView
} from "react-native";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import { AuthenToRecover, ResendOTP } from "../../services/AccountService";
import { recoverAccount } from "../../services/GuestService";

function RecoverAccount({route, navigation }) {
  const lastEmail = route.params.email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleCheckAccount = async () => {
    const rs = await AuthenToRecover(email, password);
    if (rs.success) {
      if(email === lastEmail) {
        const response = await ResendOTP(email)
      if(response.success)
      {
        navigation.navigate('RecoverStep2', {
          otpCode: response.data.otpCode,
          time: response.data.otpTimeExpiration,
          id:rs.message.id
        })
      }
      else {
        Alert.alert("Authenticate fail", response.message);
      }
      }
      else{
        Alert.alert('Error', 'You entered the wrong account to recover')
        setEmail('')
        setPassword('')
      }
    } else {
      Alert.alert("Authenticate fail!!", rs.message);
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
          <Text style={styles.title}>Recover Account</Text>
        </View>

        <View>
          <View style={styles.inputContainer}>
            <EvilIcons
              name="envelope"
              size={24}
              color="black"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={(e) => setEmail(e)}
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
              secureTextEntry
              value={password}
              onChangeText={(e) => setPassword(e)}
              style={styles.input}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCheckAccount}
            >
              <Text style={styles.buttonText}>Check Account</Text>
            </TouchableOpacity>
          </View>
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
});

export default RecoverAccount;
