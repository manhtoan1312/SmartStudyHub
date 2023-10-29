import { useState } from "react";
import { Switch, View, SafeAreaView, Text } from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { s } from "react-native-wind";
function Project({ navigation }) {
  const [outOfDate, setOutOfDate] = useState(false);
  const [tomorow, setTomorow] = useState(false);
  const [thisWeek, setThisWeek] = useState(false);
  const [next7Day, setnext7Day] = useState(false);
  const [hightPriority, setHightPriority] = useState(false);
  const [mediumPriority, setMediumPriority] = useState(false);
  const [lowPriority, setLowPriority] = useState(false);
  const [planed, setPlaned] = useState(false);
  const [all, setAll] = useState(false);
  const [someDay, setSomeDay] = useState(false);
  const [event, setEvent] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <SafeAreaView>
      <View
        style={s` flex-1 bg-white justify-center items-center py-4 border-b-2 border-b-gray-200`}
      >
        <FontAwesome
          style={s`absolute left-1`}
          name="angle-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={s`font-medium text-2xl`}>Dự Án</Text>
      </View>
      <View style={s`flex flex-col bg-white px-3`}>
        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>Quá hạn</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={outOfDate}
            onValueChange={() => setOutOfDate(!outOfDate)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="weather-sunset"
              size={24}
              color="orange"
            />
            <Text style={s`h-full flex items-center pl-2`}>Ngày mai</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={tomorow}
            onValueChange={() => setTomorow(!tomorow)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="calendar-weekend-outline"
              size={24}
              color="purple"
            />
            <Text style={s`h-full flex items-center pl-2`}>Tuần này</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={thisWeek}
            onValueChange={() => setThisWeek(!thisWeek)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="calendar-arrow-right"
              size={24}
              color="#00FF7F"
            />
            <Text style={s`h-full flex items-center pl-2`}>7 ngày tới</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={next7Day}
            onValueChange={() => setnext7Day(!next7Day)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <Feather name="flag" size={24} color="red" />
            <Text style={s`h-full flex items-center pl-2`}>Độ ưu tiên Cao</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={hightPriority}
            onValueChange={() => setHightPriority(!hightPriority)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <Feather name="flag" size={24} color="yellow" />
            <Text style={s`h-full flex items-center pl-2`}>Độ ưu tiên Trung Bình</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={mediumPriority}
            onValueChange={() => setMediumPriority(!mediumPriority)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <Feather name="flag" size={24} color="green" />
            <Text style={s`h-full flex items-center pl-2`}>Độ ưu tiên Thấp</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={lowPriority}
            onValueChange={() => setLowPriority(!lowPriority)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={24}
              color="blue"
            />
            <Text style={s`h-full flex items-center pl-2`}>Đã lên kế hoạch</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={planed}
            onValueChange={() => setPlaned(!planed)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="select-all"
              size={24}
              color="orange"
            />
            <Text style={s`h-full flex items-center pl-2`}>Tất cả</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={all}
            onValueChange={() => setAll(!all)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="calendar-text-outline"
              size={24}
              color="purple"
            />
            <Text style={s`h-full flex items-center pl-2`}>Ngày nào đó</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={someDay}
            onValueChange={() => setSomeDay(!someDay)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialIcons name="event" size={24} color="#00FF7F" />
            <Text style={s`h-full flex items-center pl-2`}>Sự kiện</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={event}
            onValueChange={() => setEvent(!event)}
          />
        </View>

        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`} >
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={24}
              color="green"
            />
            <Text style={s`h-full flex items-center pl-2`}>Đã hoàn thành</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={done}
            onValueChange={() => setDone(!done)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Project;
