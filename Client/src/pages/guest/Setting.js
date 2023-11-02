import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { s } from "react-native-wind";
import { AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";
export default function Setting({ navigation }) {
  const [preTime, SetpreTime] = useState(0);
  const [workSound, setWorkSound] = useState("Đồng hồ đếm giờ");
  const [breakSound, setBreakSound] = useState("Đồng hồ đếm giờ");
  const [focusSound, setFocusSound] = useState("Không");
  const [vibrate, setVibrate] = useState(true);
  const [pomodoroTime, setPomodoroTime] = useState("25 phút");
  const [shortBreakTime, setShortBreakTime] = useState("5 phút");
  const [longBreakTime, setLongBreakTime] = useState("15 phút");
  const [breakAfter, setBreakAfter] = useState("4 Pomodoro");
  const [autoStartPo, setAutoStartPo] = useState(false);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [disableBreakTime, setDisableBreakTime] = useState(false);
  const [appNotification, setAppNotification] = useState(
    "Công việc của ngày hôm nay"
  );
  const [notifyEveryday, setNotifyEveryday] = useState(true);
  const [group, setGroup] = useState(true);
  const [ratings, SetRatings] = useState(true);
  const [plan, setPlan] = useState(true);
  const handleSaveSettings = () => {};

  return (
      <ScrollView style={s`flex-1 bg-gray`}>
        <View style={s` flex-1 bg-white justify-center items-center my-2`}>
          <Feather
            style={s`absolute left-1`}
            size={24}
            name="x"
            onPress={() => navigation.goBack()}
          />
          <Text style={s`font-medium text-2xl`}>Cài Đặt</Text>
        </View>
        <View style={s`flex-1 flex-row py-4 pl-4 bg-white`}>
          <View>
            <Image
              source={require("../../images/avt.jpg")}
              style={s`w-12 h-12 rounded-3xl`}
            />
          </View>
          <View style={s`flex flex-col px-3`}>
            <View style={s`flex flex-row items-center`}>
              <View style={s`mr-2`}>
                <Text style={s` text-lg font-medium`} onPress={() => navigation.navigate('Login')}>Đăng Nhập | Đăng Ký</Text>
              </View>
            </View>

            <View style={s`mt-1`}>
              <Text>Đồng bộ hóa tất cả các thiết bị</Text>
            </View>
          </View>
        </View>

        <View style={s`flex flex-row justify-between px-2 mt-6 bg-white py-4`}>
          <View style={s`flex flex-row`}>
            <FontAwesome5
              name="crown"
              style={s`text-lg font-medium pr-1 text-yellow-400`}
            />
            <Text style={s`text-yellow-400 text-lg font-medium`}>
              Nâng cấp lên Prenium
            </Text>
          </View>

          <View style={s`flex flex-row`}>
            <Text style={s`text-red-500 text-lg`}>{preTime} Ngày</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-row justify-between px-2 mt-6 bg-white py-4`}>
          <Text style={s` text-lg font-medium`}>Dự Án</Text>
          <AntDesign
            style={s`text-lg font-medium`}
            name="right"
            onPress={() => navigation.navigate("Project")}
          />
        </View>

        <View style={s`flex flex-col px-2 mt-6 bg-white py-2`}>
          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s` text-lg font-medium`}>Chuông báo làm việc</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg `}>{workSound}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s` text-lg font-medium`}>Chuông báo nghỉ</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{breakSound}</Text>
              <AntDesign style={s`text-lg `} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s` text-lg font-medium`}>
              Tiếng động giúp tập trung
            </Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{focusSound}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Báo Rung</Text>
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
            <Text style={s`text-lg font-medium`}>Thời lượng Pomodoro</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{pomodoroTime}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Thời lượng giải lao ngắn</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{shortBreakTime}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Thời lượng giải lao dài</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{longBreakTime}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Thời lượng Pomodoro</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{pomodoroTime}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Giải lao dài sau</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{breakAfter}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>
              Tự động bắt đầu Pomodoro kế tiếp
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
              Tự động bắt đầu lượt giải lao
            </Text>
            <Switch
              trackColor={{ false: "gray", true: "red" }}
              thumbColor={"white"}
              value={autoStartBreak}
              onValueChange={() => setAutoStartBreak(!autoStartBreak)}
            />
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Vô hiệu hóa giải lao</Text>
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
            <Text style={s`text-lg font-medium`}>Giao diện</Text>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Thông báo ứng dụng</Text>
            <View style={s`flex flex-row`}>
              <Text style={s`text-gray-500 text-lg`}>{appNotification}</Text>
              <AntDesign style={s`text-lg`} name="right" />
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Báo nhắc hàng ngày</Text>
            <Switch
              trackColor={{ false: "gray", true: "red" }}
              thumbColor={"white"}
              value={notifyEveryday}
              onValueChange={() => setNotifyEveryday(!notifyEveryday)}
            />
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Báo nhắc hàng ngày</Text>
            <Switch
              trackColor={{ false: "gray", true: "red" }}
              thumbColor={"white"}
              value={notifyEveryday}
              onValueChange={() => setNotifyEveryday(!notifyEveryday)}
            />
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Nhóm</Text>
            <Switch
              trackColor={{ false: "gray", true: "red" }}
              thumbColor={"white"}
              value={group}
              onValueChange={() => setGroup(!group)}
            />
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Xếp hạng</Text>
            <Switch
              trackColor={{ false: "gray", true: "red" }}
              thumbColor={"white"}
              value={ratings}
              onValueChange={() => SetRatings(!ratings)}
            />
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Trồng cây</Text>
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
            <Text style={s`text-lg font-medium`}>Hướng dẫn sử dụng</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Giúp đỡ và phản hồi</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>

          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Thông tin ứng dụng</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>

        <View style={s`flex flex-col justify-between px-2 mt-6 bg-white py-4`}>
          <View style={s`flex flex-row justify-between py-2`}>
            <Text style={s`text-lg font-medium`}>Đồng bộ ngay</Text>
            <AntDesign style={s`text-lg`} name="right" />
          </View>
        </View>
      </ScrollView>
    
  );
}
