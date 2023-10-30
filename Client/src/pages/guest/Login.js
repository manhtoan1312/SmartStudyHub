import { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { s } from "react-native-wind";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [hide, setHide] = useState(true);

  const handleLogin = () => {
    // Xử lý việc đăng nhập hoặc gửi dữ liệu form lên máy chủ tại đây
    console.log("Email: ", formData.email);
    console.log("Password: ", formData.password);
  };
  return (
    <SafeAreaView>
      <View style={s` flex-1 bg-white py-4 border-b-2 border-b-gray-200`}>
        <FontAwesome
          style={s`absolute left-1`}
          name="angle-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={s`w-full pt-40 flex justify-center`}>
        <Text style={s`text-2xl text-[#F24405]`}>SMART STUDY HUB</Text>
      </View>
      <View style={s`border-b-2 border-b-gray-200 w-full pt-10`}>
        <MaterialCommunityIcons name="email-outline" size={24} color="black" />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setEmail(e)}
        ></TextInput>
      </View>
      <View
        style={s`border-b-2 flex flex-row justify-between border-b-gray-200 w-full pt-5`}
      >
        <View>
          <EvilIcons name="lock" size={24} color="black" />
          <TextInput
            placeholder="Password"
            secureTextEntry={!hide}
            value={password}
            onChangeText={(e) => setPassword(e)}
          ></TextInput>
        </View>
        <View>
          <Feather
            name={hide ? "eye-off" : "eye"}
            onPress={() => setHide(!hide)}
            size={24}
            color="black"
          />
        </View>
      </View>
      <View>
        <TouchableOpacity style={s`w-1/5 items-center`} onPress={handleLogin}>
          <Text style={s`bg-[#F24405] text-white p-2 rounded-md`}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Login;
