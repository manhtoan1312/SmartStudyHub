import { useEffect, useState } from "react";
import { UpdateEvent, getEventDetail } from "../../services/Guest/EventService";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Modal,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
  Entypo,
  Octicons,
} from "@expo/vector-icons";
import ColorDropdown from "../../components/ColorDropDown";
import CalendarPicker from "../../components/CalendarPicker";
import DateTimePicker from "../../components/DateTimePicker";
import { Dropdown } from "react-native-element-dropdown";

const EventDetail = ({ route, navigation }) => {
  const { id } = route.params;
  const [event, setEvent] = useState(null);
  const [isStartTimeVisible, setStartTimeVisible] = useState(false);
  const [isEndTimeVisible, setEndTimeVisible] = useState(false);
  const [notifyValue, setNotifyValue] = useState('')
  const fetchData = async () => {
    const response = await getEventDetail(id);
    if (response.success) {
      setEvent(response.data);
    } else {
      Alert.alert("error!", response.message);
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=> {
    if(event?.dateRemindered && event?.typeRemindered){
      console.log(renderRepeat())
      setNotifyValue(renderRepeat())
    }
  },[event?.dateRemindered,event?.typeRemindered])

  const changeData = (key, value) => {
    setEvent((prevEvent) => ({ ...prevEvent, [key]: value }));
  };

  const handleSelectStartTime = (time) => {
    const sTime = new Date(time).getTime();
    changeData('startTime',sTime);
    if (sTime > event.endTime) {
      if (isAllDay) {
        const newEndTime = new Date(time);
        newEndTime.setHours(23,59)
        changeData('endTime',newEndTime);
      } else {
        const newEndTime = new Date(time);
        newEndTime.setHours(newEndTime.getHours() + 2);
        changeData('endTime',newEndTime);
      }
    }
  };

  const handleSelectEndTime = (time) => {
    const eTime = new Date(time);
    if (eTime.getTime() < event.startTime) {
      Alert.alert(
        "Warning!!!",
        `The event's end time cannot occur before the event's start time`
      );
    } else {
      if (isAllDay) {
        eTime.setHours(23, 59);
      }
      changeData('endTime', eTime.getTime());
    }
  };

  const listNotifyTime = [
    { label: "None", value: 0 },
    { label: "before 30 minutes", value: 30 * 60 * 1000 },
    { label: "before 1 hour", value: 60 * 60 * 1000 },
    { label: "before 2 hours", value: 2 * 60 * 60 * 1000 },
    { label: "before 5 hours", value: 5 * 60 * 60 * 1000 },
    { label: "before 1 day", value: 24 * 60 * 60 * 1000 },
    { label: "before 1 day in email", value: "emaild" },
    { label: "before 1 week in email", value: "emailw" },
  ];

  const comeList = [
    { label: "are present", value: true },
    { label: "absent", value: false },
  ];

  const handleDone = async () => {
    console.log(event)
    const response = await UpdateEvent(
      id,
      event.eventName,
      event.startTime,
      event.endTime,
      event.isAllDay,
      event.place,
      event.typeRemindered,
      event.dateRemindered,
      event.colorCode,
      event.descriptions,
      event.isPresent
    );
    if (response.success) {
      console.log(
        "----------------------DATA AFTER UPDATE EVENT----------------------"
      );
      console.log(response.data);
      console.log(
        "------------------------------------------------------------------"
      );
      navigation.goBack();
    } else {
      Alert.alert("Error when update event!", response.message);
    }
  };

  const renderRepeat = () => {
    if (event.typeRemindered === null) {
      return 0;
    } else if (event.typeRemindered === "EMAIL") {
      if (event.dateRemindered - event.startTime === 24 * 60 * 60 * 1000) {
        return "emaild";
      } else {
        return "emailw";
      }
    } else {
      return event.startTime -event.dateRemindered;
    }
  };

  const handleClickStartTime = () => {
    setStartTimeVisible(true);
  };
  const handleClickEndTime = () => {
    setEndTimeVisible(true);
  };

  function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (event.isAllDay) {
      return `${day}/${month}/${year}`;
    } else {
      return `${day}/${month}/${year}, ${hours}:${minutes}`;
    }
  }

  const handleSelectReminder = (item) => {
    if (item.value === 0) {
      changeData("typeRemindered", null);
      changeData("dateRemindered", null);
    } else {
      let type = "SYSTEM";
      if (item.value === "emaild" || item.value === "emailw") {
        type = "EMAIL";
      }
      const reminderDate = calculateReminderDate(event.startTime, item.value);
      changeData("typeRemindered", type);
      changeData("dateRemindered", reminderDate);
    }
  };

  const calculateReminderDate = (startTime, reminderValue) => {
    if (typeof reminderValue === "string") {
      if (reminderValue === "emaild") {
        return startTime - 24 * 60 * 60 * 1000;
      } else if (reminderValue === "emailw") {
        return startTime - 7 * 24 * 60 * 60 * 1000;
      }
    }
    return startTime - reminderValue;
  };
  return (
    <View style={styles.modalContainer}>
      {event?.eventName && (
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={24} color="#454545" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Event Detail</Text>
            </View>
            <TouchableOpacity onPress={handleDone}>
              <Text style={[event.eventName === "" ? styles.grayText : {color:'black'}]}>Update</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <View style={{ paddingLeft: 25 }}>
                  <TextInput
                    style={{ fontSize: 20 }}
                    value={event?.eventName}
                    onChangeText={(e) => changeData("eventName", e)}
                    placeholder="Add Event Name"
                  />
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowOption}>
                <View style={styles.dayText}>
                  <Feather name="clock" size={24} color="black" />
                  <Text style={{ color: "gray", paddingLeft: 10 }}>
                    All Day
                  </Text>
                </View>
                <Switch
                  trackColor={{ false: "gray", true: "red" }}
                  thumbColor={"white"}
                  value={event?.isAllDay}
                  onValueChange={() => changeData("isAllDay", !event.isAllDay)}
                />
              </View>
              <TouchableOpacity
                style={styles.rowOption}
                onPress={handleClickStartTime}
              >
                <Text style={{ color: "gray", paddingLeft: 10 }}>
                  Start Time
                </Text>
                <View style={styles.select}>
                  <Text style={styles.name}>
                    {formatDateTime(new Date(event.startTime))}
                  </Text>
                  <MaterialIcons
                    name="navigate-next"
                    size={20}
                    color="#888888"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowOption}
                onPress={handleClickEndTime}
              >
                <Text style={{ color: "gray", paddingLeft: 10 }}>End Time</Text>
                <View style={styles.select}>
                  <Text style={styles.name}>
                    {formatDateTime(new Date(event.endTime))}
                  </Text>
                  <MaterialIcons
                    name="navigate-next"
                    size={20}
                    color="#888888"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <View style={styles.rowOption}>
                <View style={styles.dayText}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={24}
                    color="gray"
                  />
                  <TextInput
                    style={{ paddingLeft: 10, fontSize: 16 }}
                    value={event.place}
                    onChangeText={(e) => changeData("place", e)}
                    placeholder="Add a place"
                  />
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowOption}>
                <View style={styles.dayText}>
                  <Entypo name="bell" size={24} color="gray" />
                  <Text style={{ color: "gray", paddingLeft: 10 }}>
                    {event.typeRemindered === null ? "Add Notification" : "Notify:"}
                  </Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  data={listNotifyTime}
                  labelField="label"
                  valueField="value"
                  placeholder=""
                  value={notifyValue}
                  onChange={(item) => handleSelectReminder(item)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowOption}>
                <View style={styles.dayText}>
                  <View
                    style={[styles.block, { backgroundColor: event.colorCode }]}
                  ></View>
                  <Text style={{ color: "gray", paddingLeft: 10 }}>Color:</Text>
                </View>
                <View style={styles.dayText}>
                  <ColorDropdown
                    selectedColor={event.colorCode}
                    onSelectColor={(e) => changeData("colorCode", e.value)}
                  />
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowOption}>
                <View style={styles.dayText}>
                  <Octicons name="three-bars" size={24} color="gray" />
                  <TextInput
                    style={{ paddingLeft: 10, fontSize: 16 }}
                    value={event.descriptions}
                    onChangeText={(e) => changeData("descriptions", e)}
                    placeholder="Add description"
                  />
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowOption}>
                <View style={styles.dayText}>
                  <MaterialIcons name="work" size={24} color="gray" />
                  <Text style={{ color: "gray", paddingLeft: 10 }}>
                    Present:
                  </Text>
                </View>

                <Dropdown
                  style={styles.dropdown}
                  data={comeList}
                  labelField="label"
                  valueField="value"
                  value={event.isPresent}
                  onChange={(item) => changeData("isPresent", item.value)}
                />
              </View>
            </View>
          </ScrollView>
          {event.isAllDay ? (
            <CalendarPicker
              inititalDate={event.startTime}
              isVisible={isStartTimeVisible}
              onSelectDate={(e) => handleSelectStartTime(e)}
              onClose={() => setStartTimeVisible(false)}
            />
          ) : (
            <DateTimePicker
              onSelectTime={(e) => handleSelectStartTime(e)}
              visible={isStartTimeVisible}
              onClose={() => setStartTimeVisible(false)}
              defaultTime={new Date(event.startTime)}
            />
          )}
          {event.isAllDay ? (
            <CalendarPicker
              inititalDate={event.endTime}
              isVisible={isEndTimeVisible}
              onSelectDate={(e) => handleSelectEndTime(e)}
              onClose={() => setEndTimeVisible(false)}
            />
          ) : (
            <DateTimePicker
              onSelectTime={(e) => handleSelectEndTime(e)}
              visible={isEndTimeVisible}
              onClose={() => setEndTimeVisible(false)}
              defaultTime={new Date(event.endTime)}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    bottom: 0,
    backgroundColor: "#F0F2F5",
  },
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#454545",
  },
  body: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  rowOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  name: {
    color: "#888888",
    fontSize: 16,
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
  },
  grayText: {
    color: "#888888",
  },
  row: {
    borderBottomWidth: 2,
    borderColor: "#E7E7E7",
    paddingVertical: 5,
  },
  dayText: {
    alignItems: "center",
    flexDirection: "row",
  },
  block: {
    width: 16,
    height: 16,
    borderRadius: 5,
  },
  dropdown: {
    width: 200,
  },
});

export default EventDetail;
