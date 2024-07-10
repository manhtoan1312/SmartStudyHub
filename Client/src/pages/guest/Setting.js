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
  SafeAreaView,
  Pressable,
} from "react-native";
import { s } from "react-native-wind";
import {
  AntDesign,
  FontAwesome5,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";
import * as Device from "expo-device";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../../services/RoleService";
import { Picker } from "react-native-wheel-pick";
import { DeleteGuest, UpdateTimeLastUse } from "../../services/GuestService";
import ClearData from "../../services/ClearData";
import { useDispatch, useSelector } from "react-redux";
import { resetFocus, setFocus } from "../../slices/focusSlice";
import { getUserInfor } from "../../services/UserService";
import { LogOut } from "../../services/PREMIUM/DevicesService";
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
  const [email, setEmail] = useState("");
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { isStop } = useSelector((state) => state.focus);
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
      const role = await getRole();
      const uName = await AsyncStorage.getItem("accountName");
      if (role) {
        setEmail(role.email);
        const response = await getUserInfor();
        if (response.success) {
          setPreTime(response.data.dueDatePremium);
        }
      }
      if (uName) {
        setName(uName);
      }
      const storedImg = await AsyncStorage.getItem("img");
      setImg(storedImg ? storedImg : null);
      const workingSound = await AsyncStorage.getItem("focusSound");
      if (workingSound) {
        const parse = JSON.parse(workingSound);
        setWorkSound(parse?.nameSound);
      } else {
        setWorkSound("None");
      }
      const breakSound = await AsyncStorage.getItem("soundDone");
      if (breakSound) {
        const parse = JSON.parse(breakSound);
        setBreakSound(parse?.nameSound);
      }
      const storedSettings = await AsyncStorage.getItem("settings");
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
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
    };
    if (isStop) {
      dispatch(
        setFocus({
          shortBreakTime,
          longBreakTime,
          breakAfter,
          autoStartPo,
          autoStartBreak,
          disableBreakTime,
          defaultTimePomodoro: pomodoroTime,
          secondsLeft: pomodoroTime * 60,
        })
      );
    } else {
      dispatch(
        setFocus({
          shortBreakTime,
          longBreakTime,
          breakAfter,
          autoStartPo,
          autoStartBreak,
          disableBreakTime,
          defaultTimePomodoro: pomodoroTime,
        })
      );
    }
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
  const toInfor = async () => {
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
    navigation.navigate("PersonalUser");
  };
  const toPREMIUM = () => {
    navigate("PREMIUM");
  };
  const toProject = () => {
    navigate("Project");
  };

  const handlePomodoroTimeChange = (index) => {
    setIsPomodoroTimePickerVisible(false);

    getRole().then((role) => {
      if (role && role.role === "PREMIUM") {
        setPomodoroTime(index);
      } else {
        navigate("PREMIUM");
      }
    });
  };

  const handleShortBreakTimeChange = (index) => {
    setIsShortBreakTimePickerVisible(false);
    getRole().then((role) => {
      if (role && role.role === "PREMIUM") {
        setShortBreakTime(index);
      } else {
        navigate("PREMIUM");
      }
    });
  };

  const handleLongBreakTimeChange = (index) => {
    setIsLongBreakTimePickerVisible(false);
    getRole().then((role) => {
      if (role && role.role === "PREMIUM") {
        setLongBreakTime(index);
      } else {
        navigate("PREMIUM");
      }
    });
  };

  const handleBreakAfterChange = (index) => {
    setIsBreakAfterPickerVisible(false);
    getRole().then((role) => {
      if (role && role.role === "PREMIUM") {
        setBreakAfter(index);
      } else {
        navigate("PREMIUM");
      }
    });
  };

  const handlePressDevice = async () => {
    getRole().then((role) => {
      if (role && role.role === "PREMIUM") {
        navigate("ManageDevice");
      } else {
        navigate("PREMIUM");
      }
    });
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
      <SafeAreaView>
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
      </SafeAreaView>
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
    try {
      const role = await getRole();
      if (role && role.token === "PREMIUM") {
        const id = Device.osInternalBuildId;
        const ids = [{ id: id }];
        const [rsLogout, rsUpdate] = await Promise.all([
          LogOut(ids).catch((error) => {
            throw new Error("Logout failed");
          }),
          UpdateTimeLastUse().catch((error) => {
            throw new Error("Update time last use fail");
          }),
        ]);

        if (!rsLogout.success) {
          throw new Error(rsLogout.message);
        }
        dispatch(resetFocus())
        await ClearData();
        if (!rsUpdate.success) {
          throw new Error("Update time last use fail");
        }
      } else {
        ClearData();
        const response = await UpdateTimeLastUse();
        if (response.success) {
          Alert.alert("Log out success");
        } else {
          console.log(response.data);
        }
      }
    } catch (error) {
      Alert.alert(error.message || "Failed to perform one or more operations");
    }
    navigation.navigate("Home");
  };
  const submitDelete = async () => {
    const id = await AsyncStorage.getItem("id");
    const rs = await DeleteGuest(id);
    if (!rs.success) {
      console.log(rs.message);
    } else {
      Alert.alert("Smart Study Hub Announcement", "Delete data successfully");
    }
    await AsyncStorage.removeItem("id");
    dispatch(resetFocus());
    await ClearData();
    navigation.navigate("Home");
  };

  const handleHeader = () => {
    if (email) {
      toInfor();
    } else {
      toSignIn();
    }
  };
  return (
    <ScrollView style={s`flex-1 bg-gray`}>
      <Pressable
        onPress={() => handleSaveSettings()}
        style={s` flex-1 bg-white justify-center items-center mb-4 py-4`}
      >
        <Feather style={s`absolute left-4`} size={24} name="x" />
        <Text style={s`font-medium text-2xl`}>Setting</Text>
      </Pressable>
      <View>
        <Pressable
          onPress={() => handleHeader()}
          style={s`flex flex-row h-auto py-4 pl-4 bg-white`}
        >
          <Pressable onPress={() => navigate("PersonalUser")}>
            <View>
              <Image
                source={img ? { uri: img } : require("../../images/avt.jpg")}
                style={s`w-12 h-12 rounded-3xl`}
              />
            </View>
          </Pressable>
          <TouchableOpacity style={s`flex px-2`}>
            <TouchableOpacity style={s`flex flex-row`}>
              <View style={s`mr-2`}>
                {!email ? (
                  <TouchableOpacity
                    style={styles.login}
                    onPress={() => handleHeader()}
                  >
                    <View>
                      <Text style={s` text-lg font-medium`}>
                        Sign In | Sign Up
                      </Text>
                      <View style={s`mt-1`}>
                        <Text>Store your own data</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={s`ml-2 `}
                    onPress={() => handleHeader()}
                  >
                    <View>
                      <Text style={s` text-lg font-medium `}>{name}</Text>
                    </View>
                    <View>
                      <Text style={s`mt-1 font-medium text-gray-700`}>
                        {email}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Pressable>
      </View>

      <View
        style={s`flex flex-row justify-between px-2 mt-6 bg-white py-4`}
        onTouchEnd={() => toPREMIUM()}
      >
        <View style={s`flex flex-row`}>
          <FontAwesome6
            name="crown"
            style={s`text-lg font-medium pr-1 text-yellow-400`}
          />
          <Text style={s`text-yellow-400 text-lg font-medium`}>
            Upgrade to Premium
          </Text>
        </View>

        <View style={s`flex flex-row`}>
          <Text style={s`text-yellow-400 text-lg`}>{preTime} Days</Text>
          <AntDesign style={s`text-lg`} name="right" color="#E6D800" />
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

        {/* <View style={s`flex flex-row justify-between py-2`}>
          <Text style={s`text-lg font-medium`}>Vibration Alert</Text>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={vibrate}
            onValueChange={() => setVibrate(!vibrate)}
          />
        </View> */}
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

        <Pressable
          onPress={handlePressDevice}
          style={s`flex flex-row justify-between py-2`}
        >
          <Text style={s`text-lg font-medium`}>Manage Device</Text>
          <View style={s`flex flex-row`}>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </Pressable>

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
      </View>

      <View style={s`flex flex-col justify-between px-2 mt-6 bg-white py-4`}>
        <TouchableOpacity
          onPress={() => navigate("HelpAndFeedBack")}
          style={s`flex flex-row justify-between py-2`}
        >
          <Text style={s`text-lg font-medium`}>Help and feedback</Text>
          <AntDesign style={s`text-lg`} name="right" />
        </TouchableOpacity>
        {email && (
          <TouchableOpacity
            onPress={() => navigate("Infor")}
            style={s`flex flex-row justify-between py-2`}
          >
            <Text style={s`text-lg font-medium`}>Profile</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </TouchableOpacity>
        )}
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
    fontWeight: "medium",
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
  login: {
    flex: 1,
  },
});
