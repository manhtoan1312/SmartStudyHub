import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from "react-native";
import { s } from "react-native-wind";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  EvilIcons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
export default function Home({ navigation }) {
  const [login, setLogin] = useState({});
  let group = true;
  let plan = true;
  let rating = true;
  let prenium = false;
  const route = useRoute();
  const { params } = route;
  useEffect(() => {
    const getSetting = async () => {
      try {
        const storedData = await AsyncStorage.getItem("settings");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log(parsedData);
          group = parsedData.group || true;
          plan = parsedData.plan || true;
          rating = parsedData.ratings || true;
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSetting();

    
  }, []);
  useEffect(() => {
    var parsedUrl = new URL(window.location.href);
    console.log(parsedUrl.searchParams.get('token'))
    if (params && params.token) {
      console.log(params.token);
    }
  },[params])

  const handlePress = () => {
    // Mở đường dẫn bên ngoài khi nút được nhấn
    Linking.openURL("http://localhost:8080/oauth2/authorization/google");
  };

  return (
    <SafeAreaView style={s`h-full bg-white`}>
      <View>
        <View style={styles.headers}>
          <ImageBackground
            style={styles.avt}
            resizeMode="center"
            source={require("../../images/avt.jpg")}
          >
            {/* <View style={styles.preavt}>
            <FontAwesome5 style={{flex:1, justifyContent:"center", alignItems:"center"}} name="crown" size={8} color="gray" />
            </View> */}
          </ImageBackground>
          <Text style={{ fontSize: 20, color: "red" }}>Đăng Nhập</Text>
          <FontAwesome5 name="crown" size={24} color="#FFD300" />
          {group && (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={24}
              color="black"
            />
          )}
          {plan && <FontAwesome5 name="seedling" size={24} color="black" />}
          {rating && <EvilIcons name="trophy" size={24} color="black" />}
          <AntDesign name="barschart" size={24} color="black" />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.headers}>
          <View style={styles.row}>
            <Feather
              name="sun"
              style={styles.itemRow}
              size={20}
              color="#21D375"
            />
            <Text>Today</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemRow}>1h 40m</Text>
            <Text>1</Text>
          </View>
        </View>
        <View style={styles.headers}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="weather-sunset"
              size={24}
              color="orange"
            />
            <Text>Tomorrow</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.itemRow}>1h 40m</Text>
            <Text>1</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handlePress}>
          <Text>Open External Link</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avt: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  headers: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  },
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  preavt: {
    position: "absolute",
    width: 15,
    height: 15,
    bottom: -10,
    right: -10,
    borderRadius: 10,
    backgroundColor: "#676767",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemRow: {
    marginRight: 5,
  },
});
