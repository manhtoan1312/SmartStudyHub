import { useEffect, useState } from "react";
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
import DateTimePicker from "./DateTimePicker";
import CalendarPicker from "./CalendarPicker";
import { Dropdown } from "react-native-element-dropdown";
import ColorDropdown from "./ColorDropDown";
import { CreateEvent } from "../services/Guest/EventService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../services/RoleService";

const ModalAddEvent = ({ visible, onClose }) => {
  const initialDate = new Date();
  initialDate.setHours(0, 0, 0, 0);
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState(initialDate.getTime());
  const [endTime, setEndTime] = useState(initialDate.getTime());
  const [isAllDay, setIsAllDay] = useState(false);
  const [place, setPlace] = useState("");
  const [reminder, setReminder] = useState({
    time: 0,
    type: null,
  });
  const [colorCode, setColorCode] = useState("#FFA500");
  const [description, setDescription] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [isStartTimeVisible, setStartTimeVisible] = useState(false);
  const [isEndTimeVisible, setEndTimeVisible] = useState(false);
  const [labelSelected, setLabelSelected] = useState({
    _index: 0,
    label: "None",
    value: 0,
  });
  const handleClickStartTime = () => {
    setStartTimeVisible(true);
  };
  const handleClickEndTime = () => {
    setEndTimeVisible(true);
  };

  const handleDone = async () => {
    if(eventName!==""){
      let id = await AsyncStorage.getItem('id')
      const role = await getRole()
      if(role){
        id= role.id
      }
      const response = await CreateEvent(id,eventName,startTime, endTime, isAllDay, place,
        reminder.type, reminder.type !== null ? reminder.time : null, colorCode,description,isPresent 
      )
      if(response.success){
        console.log(
          "----------------------DATA AFTER CREATE EVENT----------------------"
        );
        console.log(response.data);
        console.log(
          "------------------------------------------------------------------"
        );
        onClose()
      }
      else{
        console.log(response.message)
      }
    }
  };

  const handleSelectStartTime = (time) => {
    setStartTime(time);
    if (time > endTime) {
      const newEndTime = new Date(time);
      newEndTime.setHours(newEndTime.getHours() + 2);
      setEndTime(newEndTime.getTime());
    }
  };

  const handleSelectEndTime = (time) => {
    if (time < startTime) {
      Alert.alert(
        "Warning!!!",
        `The event's end time cannot occur before the event's start time`
      );
    } else {
      setEndTime(time);
    }
  };

  function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (isAllDay) {
      return `${day}/${month}/${year}`;
    } else {
      return `${day}/${month}/${year}, ${hours}:${minutes}`;
    }
  }

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

  const calculateReminderDate = (startTime, value) => {
    if (value === "emaild") {
      return new Date(startTime - 24 * 60 * 60 * 1000);
    } else if (value === "emailw") {
      return new Date(startTime - 7 * 24 * 60 * 60 * 1000);
    } else {
      return new Date(startTime - value);
    }
  };

  const handleSelectReminder = (item) => {
    if (item._index === 0) {
      setReminder({
        time: 0,
        type: null,
      });
      setLabelSelected("");
    } else {
      let type = "SYSTEM";
      if (item.value === "emaild" || item.value === "emailw") {
        type = "EMAIL";
      }
      const reminderDate = calculateReminderDate(startTime, item.value);
      setReminder({ type, dateRemindered: reminderDate });
      setLabelSelected(item);
    }
  };

  const handleSelectColor = (item) => {
    setColorCode(item.value);
  };

  const handleSelectPresent = (item) => {
    setIsPresent(item.value);
  };

  const handleSelectAllDay = () => {
    setIsAllDay(!isAllDay);
    const startOfDay = new Date(startTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startTime);
    endOfDay.setHours(23, 59, 59);
  
    if (!isAllDay) {
      setStartTime(startOfDay.getTime());
      setEndTime(endOfDay.getTime());
    } else {
      // When switching from all-day, revert to the previous specific times
      const currentStartTime = new Date();
      const currentEndTime = new Date();
      currentEndTime.setHours(currentEndTime.getHours() + 2);
  
      setStartTime(currentStartTime.getTime());
      setEndTime(currentEndTime.getTime());
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-back-outline" size={24} color="#454545" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Create A New Event</Text>
            </View>
            <TouchableOpacity onPress={handleDone}>
              <Text style={[eventName !== "" && styles.grayText]}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            <View style={styles.row}>
              <View style={{flex:1}}>
                <View style={{ paddingLeft: 25 }}>
                  <TextInput
                    style={{ fontSize: 20 }}
                    value={eventName}
                    onChangeText={(e) => setEventName(e)}
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
                  value={isAllDay}
                  onValueChange={() => handleSelectAllDay()}
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
                    {formatDateTime(new Date(startTime))}
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
                    {formatDateTime(new Date(endTime))}
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
                    value={place}
                    onChangeText={(e) => setPlace(e)}
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
                    {reminder.type === null ? "Add Notification" : "Notify:"}
                  </Text>
                </View>
                <Dropdown
                  style={styles.dropdown}
                  data={listNotifyTime}
                  labelField="label"
                  valueField="value"
                  placeholder=""
                  value={labelSelected.value}
                  onChange={(item) => handleSelectReminder(item)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowOption}>
                <View style={styles.dayText}>
                  <View
                    style={[styles.block, { backgroundColor: colorCode }]}
                  ></View>
                  <Text style={{ color: "gray", paddingLeft: 10 }}>Color:</Text>
                </View>
                <View style={styles.dayText}>
                  <ColorDropdown
                    selectedColor={colorCode}
                    onSelectColor={handleSelectColor}
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
                    value={description}
                    onChangeText={(e) => setDescription(e)}
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
                  value={isPresent}
                  onChange={(item) => handleSelectPresent(item)}
                />
              </View>
            </View>
          </ScrollView>
          {isAllDay ? (
            <CalendarPicker
              isVisible={isStartTimeVisible}
              onSelectDate={handleSelectStartTime}
              onClose={() => setStartTimeVisible(false)}
            />
          ) : (
            <DateTimePicker
              onSelectTime={handleSelectStartTime}
              visible={isStartTimeVisible}
              onClose={() => setStartTimeVisible(false)}
              defaultTime={new Date(startTime)}
            />
          )}
          {isAllDay ? (
            <CalendarPicker
              isVisible={isEndTimeVisible}
              onSelectDate={handleSelectEndTime}
              onClose={() => setEndTimeVisible(false)}
            />
          ) : (
            <DateTimePicker
              onSelectTime={handleSelectEndTime}
              visible={isEndTimeVisible}
              onClose={() => setEndTimeVisible(false)}
              defaultTime={new Date(endTime)}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "95%",
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

export default ModalAddEvent;
