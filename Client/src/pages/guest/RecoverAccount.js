// RecoverAccount.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome, EvilIcons } from "@expo/vector-icons";
import { AuthenToRecover } from "../../services/AccountService";
import { recoverAccount } from "../../services/GuestService";

function RecoverAccount({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRecover = async () => {
    const rs = await AuthenToRecover(email, password)
    console.log(rs)
    if(rs.success){
        const id = rs.message.id
        const response = await recoverAccount(id)
        if(response.success){
            Alert.alert("Announcement", response.message)
            navigation.goBack()
        }
        else{
            Alert.alert("Announcement", response.message)
        }
    }
    else{
        Alert.alert('Login fail', rs
        )
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
          <TouchableOpacity style={styles.button} onPress={handleRecover}>
            <Text style={styles.buttonText}>Recover</Text>
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
