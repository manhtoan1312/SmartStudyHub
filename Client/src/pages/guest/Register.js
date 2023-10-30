import { useState } from "react";
import { Switch, View, SafeAreaView, Text } from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { s } from "react-native-wind";

function Register() {
  const [infor, setInfor] = useState();
  return (
    <SafeAreaView>
      <View
        style={s` flex-1 bg-white py-4 border-b-2 border-b-gray-200`}
      >
        <FontAwesome
          style={s`absolute left-1`}
          name="angle-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={s`w-full pt-40 flex justify-center`}>
        <Text style={s`text-2xl text-[#F24405]`}>
            SMART STUDY HUB
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default Register
