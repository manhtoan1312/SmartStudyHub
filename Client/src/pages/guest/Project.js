import React, { useState, useEffect } from "react";
import { Switch, View, SafeAreaView, Text,Alert } from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,EvilIcons
} from "@expo/vector-icons";
import { s } from "react-native-wind";
import AsyncStorage from "@react-native-async-storage/async-storage";
function Project({ navigation }) {
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
  const [deleted, setDeleted] = useState(true);
  useEffect(() => {
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
          setDeleted(parsedData.deleted);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleBackBtn = async () => {
    try {
      const projectData = {
        outOfDate,
        tomorow,
        thisWeek,
        next7Day,
        hightPriority,
        mediumPriority,
        lowPriority,
        planed,
        all,
        someDay,
        event,
        done,
        deleted
      };
      await AsyncStorage.setItem("projectData", JSON.stringify(projectData));
      navigation.goBack();
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
  return (
    <SafeAreaView>
      <View style={s`bg-white justify-center items-center py-4 border-b-2 border-b-gray-200`}>
      <FontAwesome
        style={s`absolute left-6`}
        name="angle-left"
        size={32}
        onPress={() => handleBackBtn()}
      />
      <Text style={s`font-medium text-2xl`}>Projects</Text>
    </View>
      <View style={s`flex flex-col bg-white px-3`}>
        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>Out of Date</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={outOfDate}
            onValueChange={() => setOutOfDate(!outOfDate)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="weather-sunset"
              size={24}
              color="orange"
            />
            <Text style={s`h-full flex items-center pl-2`}>Tomorrow</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={tomorow}
            onValueChange={() => setTomorow(!tomorow)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-weekend-outline"
              size={24}
              color="purple"
            />
            <Text style={s`h-full flex items-center pl-2`}>This Week</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={thisWeek}
            onValueChange={() => setThisWeek(!thisWeek)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-right"
              size={24}
              color="#00FF7F"
            />
            <Text style={s`h-full flex items-center pl-2`}>Next 7 Days</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={next7Day}
            onValueChange={() => setnext7Day(!next7Day)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <Feather name="flag" size={24} color="red" />
            <Text style={s`h-full flex items-center pl-2`}>High Priority</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={hightPriority}
            onValueChange={() => setHightPriority(!hightPriority)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <Feather name="flag" size={24} color="yellow" />
            <Text style={s`h-full flex items-center pl-2`}>Medium Priority</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={mediumPriority}
            onValueChange={() => setMediumPriority(!mediumPriority)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <Feather name="flag" size={24} color="green" />
            <Text style={s`h-full flex items-center pl-2`}>Low Priority</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={lowPriority}
            onValueChange={() => setLowPriority(!lowPriority)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={24}
              color="blue"
            />
            <Text style={s`h-full flex items-center pl-2`}>Planned</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={planed}
            onValueChange={() => setPlaned(!planed)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="select-all"
              size={24}
              color="orange"
            />
            <Text style={s`h-full flex items-center pl-2`}>All</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={all}
            onValueChange={() => setAll(!all)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-text-outline"
              size={24}
              color="purple"
            />
            <Text style={s`h-full flex items-center pl-2`}>Someday</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={someDay}
            onValueChange={() => setSomeDay(!someDay)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialIcons name="event" size={24} color="#00FF7F" />
            <Text style={s`h-full flex items-center pl-2`}>Event</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={event}
            onValueChange={() => setEvent(!event)}
          />
        </View>
  
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={24}
              color="green"
            />
            <Text style={s`h-full flex items-center pl-2`}>Done</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={done}
            onValueChange={() => setDone(!done)}
          />
        </View>
        <View style={s`flex flex-row justify-between py-2`}>
          <View style={s`flex flex-row`}>
          <EvilIcons name="trash" size={24} color="red" />
            <Text style={s`h-full flex items-center pl-2`}>Deleted</Text>
          </View>
          <Switch
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={"white"}
            value={deleted}
            onValueChange={() => setDeleted(!deleted)}
          />
        </View>

      </View>
    </SafeAreaView>
  );
  
}


export default Project;
