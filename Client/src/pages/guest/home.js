import React from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { s } from "react-native-wind";

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={s`h-full`}>
      <View style={s`flex-1 bg-white py-50 items-center`}>
        <Text style={s`text-2xl`}>Trang chủ</Text>
        <Button
          title="Di đến Setting"
          onPress={() => navigation.navigate("Setting")}
        />
      </View>
    </SafeAreaView>
  );
}
