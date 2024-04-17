import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { s } from "react-native-wind";
import { AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../../services/RoleService";
import { Picker } from "react-native-wheel-pick";
import { DeleteGuest } from "../../services/GuestService";
export default function Setting({ navigation }) {
  const [preTime, setPreTime] = useState(0);
  const [workSound, setWorkSound] = useState("None");
  const [breakSound, setBreakSound] = useState("Default Bell");
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
  const [email, setEmail] = useState("");
  const [img, setImg] = useState(null);
  const [tfa, setTfa] = useState(false);
  const isFocused = useIsFocused();
  const [isPomodoroTimePickerVisible, setIsPomodoroTimePickerVisible] =
    useState(false);
  const [isShortBreakTimePickerVisible, setIsShortBreakTimePickerVisible] =
    useState(false);
  const [isLongBreakTimePickerVisible, setIsLongBreakTimePickerVisible] =
    useState(false);
  const [isBreakAfterPickerVisible, setIsBreakAfterPickerVisible] =
    useState(false);
  const data = [];
  for (let i = 1; i <= 250; i++) {
    data.push({ label: i.toString(), value: i });
  }
  const fetchSettings = async () => {
    try {
      const nameAcc = await AsyncStorage.getItem("accountName");
      setEmail(nameAcc ? nameAcc : "");
      const storedImg = await AsyncStorage.getItem("img");
      setImg(storedImg ? storedImg : null);
      const workingSound = await AsyncStorage.getItem("focusSound");
      if (workingSound) {
        const parse = JSON.parse(workingSound);
        setWorkSound(parse?.nameSound);
      }
      const breakSound = await AsyncStorage.getItem("soundDone");
      if (breakSound) {
        const parse = JSON.parse(breakSound);
        setBreakSound(parse?.nameSound);
      }
      const storedSettings = await AsyncStorage.getItem("settings");
      const storage2FA = await AsyncStorage.getItem('2FA')
      if(storage2FA && storage2FA=='true') {
        setTfa(true)
      }
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setPreTime(parsedSettings.preTime);
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

  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchSettings();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);
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
      plan
    };
    await AsyncStorage.setItem("settings", JSON.stringify(settings));
  };

  const navigate = async (to) => {
    try {
      await updateData();
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
    navigation.navigate(to);
  };
  const toSignIn = () => {
    navigate("Login");
  };
  const toInfor = () => {
    navigate("Infor");
  };
  const toPREMIUM = () => {
    navigate("PREMIUM");
  };
  const toProject = () => {
    navigate("Project");
  };

  const handlePomodoroTimeChange = (index) => {
    setIsPomodoroTimePickerVisible(false);
    setPomodoroTime(index);
    // getRole().then((role) => {
    //   if (role && role.role === "PREMIUM") {
    //     setPomodoroTime(index);
    //   } else {
    //     navigation.navigate("PREMIUM");
    //   }
    // });
  };

  const handleShortBreakTimeChange = (index) => {
    setIsShortBreakTimePickerVisible(false);
    setShortBreakTime(index);
  };

  const handleLongBreakTimeChange = (index) => {
    setIsLongBreakTimePickerVisible(false);
    setLongBreakTime(index);
  };

  const handleBreakAfterChange = (index) => {
    setIsBreakAfterPickerVisible(false);
    setBreakAfter(index);
  };

  const renderPicker = (
    label,
    selectedValue,
    onValueChange,
    data,
    isPickerVisible,
    setPickerVisibility,
    unit
  ) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setPickerVisibility(!isPickerVisible)}
        >
          <Text style={styles.labelText}>{label}</Text>
          <View style={styles.pickerButton}>
            <Text style={styles.selectedValueText}>
              {selectedValue} {unit}
            </Text>
            <AntDesign
              style={styles.pickerIcon}
              name={isPickerVisible ? "up" : "down"}
            />
          </View>
        </TouchableOpacity>
        {isPickerVisible && (
          <Picker
            selectedValue={selectedValue}
            style={styles.picker}
            onValueChange={onValueChange}
            pickerData={data.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            selectedItem={selectedValue}
            onItemSelected={() => {
              setPickerVisibility(false);
              onValueChange();
            }}
          />
        )}
      </View>
    );
  };

  const handleSaveSettings = async () => {
    try {
      await updateData();
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

  const deleteData = () => {
    if (!email) {
      Alert.alert(
        "Smart Study Hub Announcement",
        "Are you sure to delete this data?",
        [
          {
            text: "Cancel",
          },
          {
            text: "OK",
            onPress: () => submitDelete(),
          },
        ]
      );
    } else {
      Alert.alert("Smart Study Hub Announcement", "Do you wanna log out?", [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => submitLogOut(),
        },
      ]);
    }
  };

  const submitLogOut = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const keysToRemove = allKeys.filter(key => key !== '2FA');
    await AsyncStorage.multiRemove(keysToRemove);
    navigation.navigate("Home");
  };
  const submitDelete = async () => {
    const id = await AsyncStorage.getItem("id");
    const rs = await DeleteGuest(id);
    if (!rs.success) {
      const allKeys = await AsyncStorage.getAllKeys();
    const keysToRemove = allKeys.filter(key => key !== '2FA');
    await AsyncStorage.multiRemove(keysToRemove);
      navigation.navigate("Home");
    } else {
      Alert.alert("Smart Study Hub Announcement", "Delete data successfully");
      const allKeys = await AsyncStorage.getAllKeys();
    const keysToRemove = allKeys.filter(key => key !== '2FA');
    await AsyncStorage.multiRemove(keysToRemove);
      navigation.navigate("Home");
    }
  };

  const Change2Fa = async () => {
    await AsyncStorage.setItem('2FA', String(!tfa))
    setTfa(!tfa)
  }

  const handleHeader = () => {
    if (email) {
      toInfor();
    } else {
      toSignIn();
    }
  };
  return (
    <ScrollView style={s`flex-1 bg-gray`}>
      <View style={s` flex-1 bg-white justify-center items-center mb-4 py-4`}>
        <Feather
          style={s`absolute left-4`}
          size={24}
          name="x"
          onPress={() => handleSaveSettings()}
        />
        <Text style={s`font-medium text-2xl`}>Setting</Text>
      </View>
      <TouchableOpacity onPress={() => handleHeader()}>
        <View style={s`flex flex-row h-auto py-4 pl-4 bg-white`}>
          <View>
            <Image
              source={img ? { uri: img } : require("../../images/avt.jpg")}
              style={s`w-12 h-12 rounded-3xl`}
            />
          </View>
          <TouchableOpacity style={s`flex flex-col px-2`}>
            <TouchableOpacity style={s`flex flex-row items-center`}>
              <View style={s`mr-2`}>
                {!email ? (
                  <TouchableOpacity onPress={() => handleHeader()}>
                    <Text style={s` text-lg font-medium`}>
                      Sign In | Sign Up
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handleHeader()}>
                    <Text style={s` text-lg font-medium`}>{email}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>

            <View style={s`mt-1`}>
              <Text>Sync all devices</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View
        style={s`flex flex-row justify-between px-2 mt-6 bg-white py-4`}
        onTouchEnd={() => toPREMIUM()}
      >
        <View style={s`flex flex-row`}>
          <FontAwesome5
            name="crown"
            style={s`text-lg font-medium pr-1 text-yellow-400`}
          />
          <Text style={s`text-yellow-400 text-lg font-medium`}>
            Upgrade to Premium
          </Text>
        </View>

        <View style={s`flex flex-row`}>
          <Text style={s`text-red-500 text-lg`}>{preTime} Days</Text>
          <AntDesign style={s`text-lg`} name="right" color="red" />
        </View>
      </View>

      <View
        style={s`flex flex-row justify-between px-2 mt-6 bg-white py-4`}
        onTouchEnd={() => toProject()}
      >
        <Text style={s` text-lg font-medium`}>Project</Text>
        <AntDesign style={s`text-lg font-medium`} name="right" />
      </View>

      <View style={s`flex flex-col px-2 mt-6 bg-white py-2`}>
        <TouchableOpacity
          onPress={() => navigate("FocusSound")}
          style={s`flex flex-row justify-between py-2`}
        >
          <Text style={s` text-lg font-medium`}>Working sound</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg `}>{workSound}</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={s`flex flex-row justify-between py-2`}
          onPress={() => navigate("SoundDone")}
        >
          <Text style={s` text-lg font-medium`}>Break bell</Text>
          <View style={s`flex flex-row`}>
            <Text style={s`text-gray-500 text-lg`}>{breakSound}</Text>
            <AntDesign style={s`text-lg `} name="right" />
          </View>
        </TouchableOpacity>

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
        {renderPicker(
          "Pomodoro Time",
          pomodoroTime,
          handlePomodoroTimeChange,
          data,
          isPomodoroTimePickerVisible,
          setIsPomodoroTimePickerVisible,
          "Minutes"
        )}
        {renderPicker(
          "Short Break Time",
          shortBreakTime,
          handleShortBreakTimeChange,
          data,
          isShortBreakTimePickerVisible,
          setIsShortBreakTimePickerVisible,
          "Minutes"
        )}
        {renderPicker(
          "Long Break Time",
          longBreakTime,
          handleLongBreakTimeChange,
          data,
          isLongBreakTimePickerVisible,
          setIsLongBreakTimePickerVisible,
          "Minutes"
        )}
        {renderPicker(
          "Long break after",
          breakAfter,
          handleBreakAfterChange,
          data,
          isBreakAfterPickerVisible,
          setIsBreakAfterPickerVisible,
          "Pomodoro"
        )}

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
        <TouchableOpacity onPress={() => navigate("Theme")}>
          <View style={s` py-2`}>
            <Text style={s`text-lg font-medium`}>Theme</Text>
          </View>
        </TouchableOpacity>

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

        <TouchableOpacity
          onPress={() => navigate("HelpAndFeedBack")}
          style={s`flex flex-row justify-between py-2`}
        >
          <Text style={s`text-lg font-medium`}>Help and feedback</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </TouchableOpacity>

        <TouchableOpacity style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Application Reviews</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </TouchableOpacity>
        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Application information</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Two-Factor Authentication</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={tfa}
            onValueChange={() => Change2Fa()}
          />
        </View>
        <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Ratings App</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </View>
      </View>

      {!email && (
        <View style={s`flex flex-col justify-between px-2 mt-6 bg-white py-4`}>
          <View
            style={s`flex flex-row justify-between  py-2`}
            onTouchEnd={() => toSignIn()}
          >
            <Text style={s`text-lg font-medium `}>Sync now</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>
      )}

      <View
        style={s`flex flex-col justify-between px-2 mt-6 bg-white py-2 mb-4`}
      >
        <View
          style={s`flex flex-row justify-center items-center py-2`}
          onTouchEnd={() => deleteData()}
        >
          <Text style={s`text-lg font-medium text-red-500`}>
            {email ? "Log Out" : "Delete Data"}{" "}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 900,
  },
  selectedValueText: {
    color: "gray",
    fontSize: 18,
  },
  pickerIcon: {
    fontSize: 18,
  },
  picker: {
    height: 200,
    width: "100%",
    color: "black",
    backgroundColor: "white",
  },
});
