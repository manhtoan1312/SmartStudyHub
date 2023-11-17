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
  ScrollView,
} from "react-native";
import { s } from "react-native-wind";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  EvilIcons,
  AntDesign,
  Feather,
  Fontisto,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Home({ navigation }) {
  const [login, setLogin] = useState({});
  const [outOfDate, setOutOfDate] = useState(true);
  const [tomorow, setTomorow] = useState(true);
  const [thisWeek, setThisWeek] = useState(true);
  const [next7Day, setnext7Day] = useState(true);
  const [hightPriority, setHightPriority] = useState(true);
  const [mediumPriority, setMediumPriority] = useState(true);
  const [lowPriority, setLowPriority] = useState(true);
  const [planed, setPlaned] = useState(true);
  const [all, setAll] = useState(true);
  const [someDay, setSomeDay] = useState(true);
  const [event, setEvent] = useState(true);
  const [done, setDone] = useState(true);
  const [plan, setPlan] = useState(true);
  const [group, setGroup] = useState(true);
  const [rating, setRating] = useState(true);
  const [prenium, setPrenium] = useState(true);
  // const route = useRoute();
  // const { params } = route;
  useEffect(() => {
    const getSetting = async () => {
      try {
        const storedData = await AsyncStorage.getItem("settings");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setGroup(parsedData.group);
          setPlan(parsedData.plan);
          setRating(parsedData.ratings);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("projectData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setOutOfDate(parsedData.outOfDate);
          setTomorow(parsedData.tomorow);
          setThisWeek(parsedData.thisWeek);
          setnext7Day(parsedData.next7Day);
          setHightPriority(parsedData.hightPriority);
          setMediumPriority(parsedData.mediumPriority);
          setLowPriority(parsedData.lowPriority);
          setPlaned(parsedData.planed);
          setAll(parsedData.all);
          setSomeDay(parsedData.someDay);
          setEvent(parsedData.event);
          setDone(parsedData.done);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSetting();
    fetchData();
  }, []);

  // useEffect(() => {
  //   var parsedUrl = new URL(window.location.href);
  //   console.log(parsedUrl.searchParams.get("token"));
  //   if (params && params.token) {
  //     console.log(params.token);
  //   }
  // }, [params]);

  const handlePress = () => {
    Linking.openURL("http://localhost:8080/oauth2/authorization/google");
  };

  return (
    <View style={s`h-full bg-white`}>
      <ScrollView>
        <View>
          <View style={styles.headers}>
            <ImageBackground
              style={styles.avt}
              resizeMode="cover"
              source={require("../../images/avt.jpg")}
            ></ImageBackground>
            <Text
              style={{ fontSize: 20, color: "red" }}
              onPress={() => navigation.navigate("Setting")}
            >
              Đăng Nhập
            </Text>
            <FontAwesome5
              name="crown"
              style={styles.itemRow}
              size={20}
              color="#FFD300"
            />
            {group && (
              <MaterialCommunityIcons
                name="account-group-outline"
                style={styles.itemRow}
                size={20}
                color="black"
              />
            )}
            {plan && (
              <FontAwesome5
                name="seedling"
                style={styles.itemRow}
                size={20}
                color="black"
              />
            )}
            {rating && (
              <EvilIcons
                name="trophy"
                style={styles.itemRow}
                size={20}
                color="black"
              />
            )}
            <AntDesign
              name="barschart"
              style={styles.itemRow}
              size={20}
              color="black"
            />
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
              <MaterialIcons
                style={styles.itemRow}
                name="assignment-late"
                size={20}
                color="red"
              />
              <Text>Out of Date</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.itemRow}>1h 40m</Text>
              <Text>1</Text>
            </View>
          </View>
          {tomorow && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="weather-sunset"
                  style={styles.itemRow}
                  size={20}
                  color="orange"
                />
                <Text>Tomorrow</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {thisWeek && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-range-outline"
                  style={styles.itemRow}
                  size={20}
                  color="purple"
                />
                <Text>This Week</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {next7Day && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  style={styles.itemRow}
                  size={20}
                  color="#32CD32"
                />
                <Text>The next 7 days</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {hightPriority && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <Fontisto
                  name="flag"
                  style={styles.itemRow}
                  size={20}
                  color="red"
                />
                <Text>Hight Priority</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {mediumPriority && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <Fontisto
                  name="flag"
                  style={styles.itemRow}
                  size={20}
                  color="orange"
                />
                <Text>Medium Priority</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {lowPriority && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <Fontisto
                  name="flag"
                  style={styles.itemRow}
                  size={20}
                  color="#00FF7F"
                />
                <Text>Low Priority</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {planed && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-check-outline"
                  style={styles.itemRow}
                  size={20}
                  color="#87CEFA"
                />
                <Text>Planed</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {all && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="select-all"
                  style={styles.itemRow}
                  size={20}
                  color="orange"
                />
                <Text>All</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {someDay && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-text-outline"
                  style={styles.itemRow}
                  size={20}
                  color="purple"
                />
                <Text>Some day</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>1h 40m</Text>
                <Text>1</Text>
              </View>
            </View>
          )}
          {event && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialIcons
                  name="event"
                  style={styles.itemRow}
                  size={20}
                  color="#32CD32"
                />
                <Text>Event</Text>
              </View>
            </View>
          )}
          {done && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <AntDesign name="checkcircleo" size={20} color="gray" />
                <Text>Done</Text>
              </View>
            </View>
          )}
          <View style={styles.headers}>
            <View style={styles.row}>
              <FontAwesome
                name="tasks"
                style={styles.itemRow}
                size={20}
                color="#87CEFA"
              />
              <Text>Task</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.itemRow}>1h 40m</Text>
              <Text>1</Text>
            </View>
          </View>
          <View style={styles.headers}>
            <View style={styles.row}>
              <AntDesign
                name="plus"
                style={styles.itemRow}
                size={20}
                color="red"
              />
              <Text>Add a Project</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons
                style={styles.itemRow}
                name="tag-plus-outline"
                size={20}
                color="red"
              />
              <AntDesign name="addfolder" size={20} color="red" />
            </View>
          </View>
          <View></View>
          <TouchableOpacity onPress={handlePress}>
            <Text>Open External Link</Text>
          </TouchableOpacity>
        </View>
        <View >
          <ImageBackground
            source={require("../../images/bg_focus_1.jpg")}
            resizeMode="center"
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 24 }}
              onPress={() => navigation.navigate("Focus")}
            >
              25
            </Text>
          </ImageBackground>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avt: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  headers: {
    marginHorizontal: 10,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    marginTop: 10
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
  iconFocus: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    right: -50,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
