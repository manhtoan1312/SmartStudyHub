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
import { login } from "../../services/AccountService";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);
  const [errorMessage,setErrorMessage] = useState('')
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      Alert.alert(
        'Smart Study Hub anoucement',
        "thanh cong",
        [
          {
            text: 'cancel',
            onPress: () => {
              console.log('Hủy')
              navigation.goBack()
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              console.log('OK')
              navigation.goBack()
            },
            
          },
        ],
        { cancelable: false }
      )
      // let checked = false;
      // if (document.querySelector("#remember").checked) {
      //   checked = true;
      // }
      // contextLogin(checked, response.token);
      // navigate("/checkin");
    } else {
      setErrorMessage(response.message)
      // setEmail("");
      // setPassword("");
      // document.querySelector("#floating_email").focus();
      Alert.alert(
        'Smart Study Hub anoucement',
        'sai roi',
        [
          {
            text: 'cancel',
            onPress: () => console.log('Hủy'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => console.log('OK'),
          },
        ],
        { cancelable: false }
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
            secureTextEntry={hide}
            value={password}
            onChangeText={(e) => setPassword(e)}
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.textMin}>Forgot password?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.textMin}>Or</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.registerBtn} onPress={() => navigation.navigate('Register')}>
            <Text>Sign Up</Text>
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
    width:300,
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
    width:300,
    alignItems: "center",
  },
});

export default Login;
