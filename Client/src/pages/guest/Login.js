import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  EvilIcons,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import { login } from "../../services/AccountService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const handleUrlChange = async ({ url }) => {
      const tokenIndex = url.indexOf("token=");
      if (tokenIndex !== -1) {
        const token = url.slice(tokenIndex + 6);
        const decodedToken = jwt_decode(token);
        const subArray = decodedToken.sub.split("-");
        const id = subArray[0];
        await AsyncStorage.setItem('token', tokenIndex)
        await AsyncStorage.setItem("id", id);
        const firstName = subArray[subArray.length - 1].trim().split(" ")[0];
        const lastName = subArray[subArray.length - 1].trim().split(" ")[1];
        console.log(id, token, firstName, lastName)
        await AsyncStorage.setItem("accountName", `${lastName} ${firstName}`);
        navigation.navigate("Home");
      } else if (url.includes("account-deleted")) {
        Alert.alert(
          "Your account has been deleted",
          "Do you want to recover your account?",
          [
            { text: "No", style: "cancel" },
            { text: "Yes", onPress: () => navigation.navigate("Recover") },
          ]
        );
      } else if (url.includes("account-banned")) {
        Alert.alert(
          "Your account has been banned",
          "Please create a new account."
        );
      }
    };

    unsubscribeRef.current = Linking.addEventListener("url", handleUrlChange);
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current.remove();
      }
    };
  }, [navigation]);
  const handleLogin = async (e) => {
    if(email && password){
      e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      await AsyncStorage.setItem("token", response.token);
      const role = jwt_decode(response.token);
      const subArray = role.sub.split("-");
      const id = subArray[0];
      await AsyncStorage.setItem("id", id);

      navigation.navigate("Home");
    } else {
      if (response.status === "2_4_f") {
        Alert.alert(
          "Your account has been deleted",
          "Do you want to recover your account?",
          [
            {
              text: "No",
              style: "cancel",
            },
            { text: "Yes", onPress: () => navigation.navigate("Recover") },
          ]
        );
      } else {
        Alert.alert("Account was banned",'Do you want to report this problem?',[
          [
            {
              text: "No",
              style: "cancel",
            },
            { text: "Yes", onPress: () => navigation.navigate("Report") },
          ]
        ]);
        
      }
    }
    }
    else{
      Alert.alert("Warnning", 'you need to input all field')
    }
  };

  const handleGoogleLogin = () => {
    Linking.openURL(
      "https://api-smart-study-hub.onrender.com/oauth2/authorization/google"
    );
  };

  const handleGitHubLogin = () => {
    Linking.openURL(
      "https://api-smart-study-hub.onrender.com/oauth2/authorization/github"
    );
  };

  const handleFacebookLogin = () => {
    Linking.openURL(
      "https://api-smart-study-hub.onrender.com/oauth2/authorization/facebook"
    );
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
        <View style={styles.forgot}>
          <Text
            style={styles.textMin}
            onPress={() => navigation.navigate("ForgotPasswordEmail")}
          >
            Forgot password?
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.textMin}>Or</Text>
        </View>
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <AntDesign name="google" size={24} color="white" />
            <Text style={styles.buttonTextSecondary}>Login With Google</Text>
          </TouchableOpacity>
        </View> */}

        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.githubButton}
            onPress={handleGitHubLogin}
          >
            <AntDesign name="github" size={24} color="white" />
            <Text style={styles.buttonTextSecondary}>Login With GitHub</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.facebookButton}
            onPress={handleFacebookLogin}
          >
            <Entypo name="facebook-with-circle" size={24} color="white" />
            <Text style={styles.buttonTextSecondary}>Login With Facebook</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate("Register")}
          >
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
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 25,
    marginTop: 20,
    padding: 15,
    width: 300,
    justifyContent: "center",
  },

  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 25,
    marginTop: 20,
    padding: 15,
    width: 300,
    justifyContent: "center",
  },

  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 25,
    marginTop: 20,
    padding: 15,
    width: 300,
    justifyContent: "center",
  },

  buttonTextSecondary: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
  },
  forgot: {
    alignItems: "flex-end",
  },
});

export default Login;
