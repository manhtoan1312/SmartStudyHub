import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { s } from "react-native-wind";
import { AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Setting({ navigation }) {
  const [preTime, setPreTime] = useState(0);
  const [workSound, setWorkSound] = useState("Timer");
  const [breakSound, setBreakSound] = useState("Timer");
  const [focusSound, setFocusSound] = useState("None");
  const [vibrate, setVibrate] = useState(true);
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [breakAfter, setBreakAfter] = useState(4);
  const [autoStartPo, setAutoStartPo] = useState(false);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [disableBreakTime, setDisableBreakTime] = useState(false);
  const [appNotification, setAppNotification] = useState("Today's tasks");
  const [notifyEveryday, setNotifyEveryday] = useState(true);
  const [group, setGroup] = useState(true);
  const [ratings, setRatings] = useState(true);
  const [plan, setPlan] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem("settings");
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setPreTime(parsedSettings.preTime);
          setWorkSound(parsedSettings.workSound);
          setBreakSound(parsedSettings.breakSound);
          setFocusSound(parsedSettings.focusSound);
          setVibrate(parsedSettings.vibrate);
          setPomodoroTime(parsedSettings.pomodoroTime);
          setShortBreakTime(parsedSettings.shortBreakTime);
          setLongBreakTime(parsedSettings.longBreakTime);
          setBreakAfter(parsedSettings.breakAfter);
          setAutoStartPo(parsedSettings.autoStartPo);
          setAutoStartBreak(parsedSettings.autoStartBreak);
          setDisableBreakTime(parsedSettings.disableBreakTime);
          setAppNotification(parsedSettings.appNotification);
          setNotifyEveryday(parsedSettings.notifyEveryday);
          setGroup(parsedSettings.group);
          setRatings(parsedSettings.ratings);
          setPlan(parsedSettings.plan);
        }
      } catch (error) {
        console.log(error);
        Alert.alert(
          "Smart Study Hub Announcement",
          "An error occurred while saving the settings",
          [
            {
              text: "Cancel",
            },
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
      }
    };

     fetchSettings();
  }, []);

  const updateData = async () => {
    const settings = {
      preTime,
      workSound,
      breakSound,
      focusSound,
      vibrate,
      pomodoroTime,
      shortBreakTime,
      longBreakTime,
      breakAfter,
      autoStartPo,
      autoStartBreak,
      disableBreakTime,
      appNotification,
      notifyEveryday,
      group,
      ratings,
      plan,
    };
    await AsyncStorage.setItem("settings", JSON.stringify(settings));
  }

  const navigate = async (to) => {
    try {
      await updateData()
      navigation.navigate(to);
    } catch (e) {
      console.log(e);
      Alert.alert(
        "Smart Study Hub Announcement",
        "An error occurred while saving the settings",
        [
          {
            text: "Cancel",
          },
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  }
  const toSignIn = () => {
    navigate('Login')
  }
  const toPrenium = () => {
    navigate('Prenium')
  }
  const toProject = () => {
    navigate('Project')
  }
  const handleSaveSettings = async () => {
    try {
      await updateData()
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert(
        "Smart Study Hub Announcement",
        "An error occurred while saving the settings",
        [
          {
            text: "Cancel",
          },
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <ScrollView style={s`flex-1 bg-gray`}>
      <View style={s` flex-1 bg-white justify-center items-center mb-4`}>
        <Feather
          style={s`absolute left-1`}
          size={24}
          name="x"
          onPress={() => handleSaveSettings()}
        />
        <Text style={s`font-medium text-2xl`}>Setting</Text>
      </View>
      <View style={s`flex-1 flex-row py-4 pl-4 bg-white`}>
        <View>
          <Image
            source={require("../../images/avt.jpg")}
            style={s`w-12 h-12 rounded-3xl`}
          />
        </View>
        <View style={s`flex flex-col px-2`}>
          <View style={s`flex flex-row items-center`}>
            <View style={s`mr-2`}>
              <Text
                style={s` text-lg font-medium`}
                onPress={() => toSignIn()}
              >
                Sign In | Sign Up
              </Text>
            </View>
          </View>

          <View style={s`mt-1`}>
            <Text>Sync all devices</Text>
          </View>
        </View>
      </View>

      <View style={s`flex flex-row justify-between px-2 mt-6 bg-white py-4`}>
        <View style={s`flex flex-row`}>
          <FontAwesome5
            name="crown"
            style={s`text-lg font-medium pr-1 text-yellow-400`}
          />
          <Text style={s`text-yellow-400 text-lg font-medium`} onPress={() => toPrenium()}>
            Upgrade to Premium 
          </Text>
        </View>

        <View style={s`flex flex-row`}>
          <Text style={s`text-red-500 text-lg`} onPress={() => toPrenium()}>{preTime} Date</Text>
          <AntDesign style={s`text-lg`} name="right" onPress={() => toPrenium()}/>
        </View>
      </View>

      <View style={s`flex flex-row justify-between px-2 mt-6 bg-white py-4`}>
        <Text style={s` text-lg font-medium`} onPress={() => toProject()}>Project</Text>
        <AntDesign
          style={s`text-lg font-medium`}
          name="right"
          onPress={() => toProject()}
        />
      </View>

      <View style={s`flex flex-col px-2 mt-6 bg-white py-2`}>
        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s` text-lg font-medium`}>Working alarm</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg `}>{workSound}</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s` text-lg font-medium`}>Break bell</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{breakSound}</Text>
            <AntDesign style={s`text-lg `} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s` text-lg font-medium`}>Noise helps concentration</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{focusSound}</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Vibration Alert</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={vibrate}
            onValueChange={() => setVibrate(!vibrate)}
          />
        </View>
      </View>

      <View style={s`flex flex-col justify-between px-2 mt-6 bg-white py-4`}>
        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Pomodoro Time</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{pomodoroTime} Minutes</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Short Break Time</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{shortBreakTime} Minutes</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>
        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Long Break Time</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{longBreakTime} Minutes</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Long break after</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{breakAfter} Pomodoro</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>
            Automatically start the next Pomodoro
          </Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={autoStartPo}
            onValueChange={() => setAutoStartPo(!autoStartPo)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>
            Automatically starts a break
          </Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={autoStartBreak}
            onValueChange={() => setAutoStartBreak(!autoStartBreak)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Disable breaks</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={disableBreakTime}
            onValueChange={() => setDisableBreakTime(!disableBreakTime)}
          />
        </View>
      </View>

      <View style={s`flex flex-col justify-between px-2 mt-6 bg-white py-4`}>
        <View style={s` py-2`}>
          <Text style={s`text-lg font-medium`}>Display</Text>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Application notifications</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{appNotification}</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Daily reminder</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={notifyEveryday}
            onValueChange={() => setNotifyEveryday(!notifyEveryday)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Group</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={group}
            onValueChange={() => setGroup(!group)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Ratings</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={ratings}
            onValueChange={() => setRatings(!ratings)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Plan</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={plan}
            onValueChange={() => setPlan(!plan)}
          />
        </View>
      </View>

      <View style={s`flex flex-col justify-between px-2 mt-6 bg-white py-4`}>
        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>User manual</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Help and feedback</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Application information</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </View>
      </View>

      <View style={s`flex flex-col justify-between px-2 mt-6 bg-white py-4`}>
        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Sync now</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </View>
      </View>
    </ScrollView>
  );
}
