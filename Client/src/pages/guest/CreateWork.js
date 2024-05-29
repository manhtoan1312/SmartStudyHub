import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
  SafeAreaView,
  Switch,
  Pressable,
} from "react-native";
import {
  MaterialIcons,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  FontAwesome6,
  Fontisto,
} from "@expo/vector-icons";
import { CreateWork, RecoverWork } from "../../services/Guest/WorkService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetProjectByStatus } from "../../services/Guest/ProjectService";
import ImageFocus from "../../components/Image_Focus";
import { TextInput } from "react-native-gesture-handler";
import PriorityModal from "../../components/PriorityModal";
import TagSelectionModal from "../../components/TagSelectionModal";
import ChangePomodoro from "../../components/ChangePomodoro";
import DateTimePicker from "../../components/DateTimePicker";
import getRole from "../../services/RoleService";
import { useDispatch } from "react-redux";
import RepeatSelection from "./RepeatSelection";
import CalendarPicker from "../../components/CalendarPicker";

const CreateWorkPage = ({ navigation }) => {
  const initialDate = new Date();
  const initEnd = new Date(initialDate);
  initEnd.setHours(initEnd.getHours() + 2);
  const [work, setWork] = useState({
    workName: "",
    projectId: null,
    dueDate: initEnd.getTime(),
    priority: "NONE",
    timeOfPomodoro: 25,
    numberOfPomodoros: 0,
    isRemindered: null,
    timeWillAnnounce: null,
    typeRepeat: null,
    unitRepeat: null,
    amountRepeat: null,
    daysOfWeekRepeat: null,
    dateEndRepeat: null,
    tags: [],
    note: "",
  });
  const [listTagSelected, setListTagSelected] = useState([]);
  const [listProject, setlistProject] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [tagSelectionModalVisible, setTagSelectionModalVisible] =
    useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [pomodoroVisible, setPomodoroVisible] = useState(false);
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [isRepeatVisible, setRepeatVisible] = useState(false);
  const [isSelectEndDateVisible, setSelectEndDateVisible] = useState(false);
  const [isEndDateRepeat, setEndDateRepeat] = useState(false);

  const defaultTime = new Date();
  defaultTime.setHours(23);
  defaultTime.setMinutes(59);
  const fetchData = async () => {
    try {
      const role = await getRole();
      let userId;
      if (role) {
        userId = role.id;
      } else {
        userId = await AsyncStorage.getItem("id");
      }
      const [listProjectResponse] = await Promise.all([
        GetProjectByStatus(userId, "ACTIVE"),
      ]);

      if (listProjectResponse.success) {
        setlistProject(listProjectResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleBack = async () => {
    navigation.goBack();
  };

  const handleUpdateProject = (project) => {
    if (work) {
      const updatedWork = { ...work };
      if (project) {
        updatedWork.projectId = project?.id;
        updatedWork.projectName = project?.projectName;
      } else {
        updatedWork.projectId = null;
        updatedWork.projectName = null;
      }
      setWork(updatedWork);
    }
    setModalVisible(false);
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.projectItem,
        item.id === work?.projectId && styles.selectedProject,
      ]}
      onPress={() => handleUpdateProject(item)}
    >
      <View
        style={[styles.statusCircle, { backgroundColor: item.colorCode }]}
      ></View>
      <Text>{item.projectName}</Text>
    </TouchableOpacity>
  );

  const showPriorityModal = () => {
    setPriorityModalVisible(true);
  };

  const hidePriorityModal = () => {
    setPriorityModalVisible(false);
  };

  const showTagSelectionModal = () => {
    setTagSelectionModalVisible(true);
  };

  const hideTagSelectionModal = () => {
    setTagSelectionModalVisible(false);
  };

  const showDateTimePicker = () => {
    setDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisible(false);
  };

  const openSelectDueDate = () => {
    setCalendarVisible(true);
  };

  const handleOpenRepeatSelection = async () => {
    const role = await getRole();
    if (role && role.role === "PREMIUM") {
      setRepeatVisible(true);
    } else {
      navigation.navigate("PREMIUM");
    }
  };

  const handleSelectDueDate = (date) => {
    const selectedDateObject = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let statusWork = "TODAY";
    if (today.getTime() > selectedDateObject.getTime()) {
      statusWork = "OUTOFDATE";
    } else if (
      selectedDateObject.getFullYear() === tomorrow.getFullYear() &&
      selectedDateObject.getMonth() === tomorrow.getMonth() &&
      selectedDateObject.getDate() === tomorrow.getDate()
    ) {
      statusWork = "TOMORROW";
    }

    selectedDateObject.setHours(23);
    selectedDateObject.setMinutes(59);
    selectedDateObject.setSeconds(0);
    const updateWork = { ...work };
    updateWork.dueDate = selectedDateObject.getTime();
    updateWork.statusWork = statusWork;
    setWork(updateWork);
  };

  const handleSelectPriority = (priority) => {
    const updateWork = { ...work };
    updateWork.priority = priority;
    setWork(updateWork);
    hidePriorityModal();
  };

  const  handleChangeName = (text) => {
    console.log(text)
    const updateWork = { ...work };
    updateWork.workName = text;
    setWork(updateWork);
  };
  const handleSelectTag = (taglist) => {
    setListTagSelected(taglist);
    setTagSelectionModalVisible(false);
  };

  const handleDateTimePicked = (timeInMilliseconds) => {
    const updateWork = { ...work };
    updateWork.timeWillAnnounce = timeInMilliseconds;
    updateWork.isRemindered = true;
    setWork(updateWork);
  };

  const deleteTimeRemindered = () => {
    const updateWork = { ...work };
    updateWork.timeWillAnnounce = null;
    updateWork.isRemindered = false;
    setWork(updateWork);
  };

  const colorflag = () => {
    if (work) {
      if (work?.priority === "HIGH") {
        return "red";
      }
      if (work?.priority === "NORMAL") {
        return "#e6e600";
      }
      if (work?.priority === "LOW") {
        return "green";
      }
      return "gray";
    }
    return "gray";
  };
  const DeleteTag = (id) => {
    const updatedList = listTagSelected.filter((tag) => tag.id !== id);
    setListTagSelected(updatedList);
  };
  const changePomodoro = (time, pomo) => {
    const updateWork = { ...work };
    updateWork.numberOfPomodoros = time;
    updateWork.timeOfPomodoro = pomo;
    setWork(updateWork);
    setPomodoroVisible(false);
  };
  const deleteDueDate = () => {
    const updateWork = { ...work };
    updateWork.dueDate = initEnd.getTime()
    setWork(updateWork);
  };
  const renderDay = () => {
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let dateStart = new Date(work.dueDate);
    dateStart.setDate(dateStart.getDate());
    let date = dateStart.toLocaleDateString("en-US", options);
    return (
      <TouchableOpacity
        onPress={() => deleteDueDate()}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <FontAwesome5 name="calendar-alt" size={14} color="gray" />
        <Text style={{ padding: 5 }}>{date}</Text>
        <View>
          <AntDesign name="closecircle" size={20} color="gray" />
        </View>
      </TouchableOpacity>
    );
  };
  const handleChangeRepeat = async (type, unit, amount, day) => {
    console.log(type, unit, amount, day);
    setRepeatVisible(false);
    const workUpdate = { ...work };
    workUpdate.typeRepeat = type;
    if (type === "CUSTOM") {
      workUpdate.unitRepeat = unit;
      workUpdate.amountRepeat = amount;
      const string = day.join(", ");
      workUpdate.daysOfWeekRepeat = string;
    }
    setWork(workUpdate);
  };

  function renderTime() {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(work.timeWillAnnounce);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}`;
    const result = `${formattedTime}, ${dayOfWeek}, ${formattedDate}`;
    return (
      <TouchableOpacity
        onPress={() => deleteTimeRemindered()}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Text style={{ padding: 5 }}>{result}</Text>
        <View>
          <AntDesign name="closecircle" size={20} color="gray" />
        </View>
      </TouchableOpacity>
    );
  }
  const AddWorkFunc = async () => {
    if (work.workName && work.dueDate) {
      try {
        const updatedWorkdata = { ...work };
        updatedWorkdata.tags = listTagSelected.map((tag) => ({ id: tag.id }));
        let id = await AsyncStorage.getItem("id");
        const role = await getRole();
        if (role) {
          id = role.id;
        }
        console.log(work)
        const response = await CreateWork(
          id,
          updatedWorkdata.projectId ? updatedWorkdata.projectId : null,
          updatedWorkdata.tags,
          updatedWorkdata.workName,
          updatedWorkdata.priority,
          updatedWorkdata.dueDate,
          updatedWorkdata.numberOfPomodoros,
          updatedWorkdata.timeOfPomodoro,
          updatedWorkdata?.typeRepeat ? updatedWorkdata?.typeRepeat : null,
          updatedWorkdata?.unitRepeat ? updatedWorkdata?.unitRepeat : null,
          updatedWorkdata?.amountRepeat ? updatedWorkdata?.amountRepeat : null,
          updatedWorkdata?.daysOfWeekRepeat
            ? updatedWorkdata?.daysOfWeekRepeat
            : null,
          updatedWorkdata.isRemindered ? updatedWorkdata.isRemindered : false,
          updatedWorkdata.timeWillAnnounce
            ? updatedWorkdata.timeWillAnnounce
            : null,
          updatedWorkdata.note,
          updatedWorkdata?.dateEndRepeat ? updatedWorkdata.dateEndRepeat : null
        );

        if (response.success) {
          console.log(
            "----------------------DATA CREATE WORK----------------------"
          );
          console.log(response.data);
          console.log(
            "------------------------------------------------------------------"
          );

          navigation.goBack();
        } else {
          Alert.alert("Create Work Error", response.message);
        }
      } catch (error) {
        console.error("Error creating work:", error);
      }
    } else {
      Alert.alert("Warnning", "Workname and due date can not be null");
    }
  };

  const renderRepeatTime = () => {
    if (work?.typeRepeat !== "CUSTOM") {
      return `${work?.typeRepeat.toLowerCase()}`;
    } else {
      const arr = stringToNumberArray(work?.daysOfWeekRepeat);
      const str = `Every${
        work?.amountRepeat !== 1 ? ` ${work?.amountRepeat}` : ""
      } ${
        work?.unitRepeat !== "WEEK" ||
        arr.length < 7 ||
        work?.amountRepeat !== 1
          ? String(work?.unitRepeat).toLowerCase()
          : "day"
      } ${
        work?.unitRepeat === "WEEK" &&
        arr.length > 1 &&
        arr.length < 7 &&
        renderAtTime(arr)
      }`;
      return str;
    }
  };
  const renderAtTime = (arr) => {
    const optionWeek = [
      {
        label: "Monday",
        key: 2,
      },
      {
        label: "Tuesday",
        key: 3,
      },
      {
        label: "Wednesday",
        key: 4,
      },
      {
        label: "Thursday",
        key: 5,
      },
      {
        label: "Friday",
        key: 6,
      },
      {
        label: "Saturday",
        key: 7,
      },
      {
        label: "Sunday",
        key: 8,
      },
    ];
    const days = optionWeek
      .filter((day) => arr.includes(day.key))
      .map((day) => day.label);
    let formattedDays = days.join(", ");
    const lastIndex = formattedDays.lastIndexOf(", ");
    if (lastIndex !== -1) {
      formattedDays =
        formattedDays.substring(0, lastIndex) +
        " and" +
        formattedDays.substring(lastIndex + 1);
    }
    return `at ${formattedDays}.`;
  };

  const deleteRepeat = () => {
    setWork({
      ...work,
      typeRepeat: null,
      unitRepeat: null,
      daysOfWeekRepeat: null,
      amountRepeat: null,
    });
    setEndDateRepeat(false);
  };

  const changeNote = (text) => {
    setWork({
      ...work,
      note: text,
    });
  };

  const renderEndDate = () => {
    if (work?.dateEndRepeat) {
      return new Date(work?.dateEndRepeat).toISOString().split("T")[0];
    } else {
      const updateWorkItem = { ...work };
      const defaultTime = new Date();
      defaultTime.setSeconds(0);
      defaultTime.setMilliseconds(0);
      let hoursToAdd = 2;
      let currentHours = defaultTime.getHours();
      let newHours = currentHours + hoursToAdd;
      if (newHours >= 24) {
        newHours = 23;
        defaultTime.setMinutes(59);
      }
      defaultTime.setHours(newHours);
      updateWorkItem.dateEndRepeat = defaultTime.getTime();
      setWork(updateWorkItem);
      return new Date(defaultTime).toISOString().split("T")[0];
    }
  };

  const handleOpenEndDateRepeat = () => {
    setSelectEndDateVisible(!isSelectEndDateVisible);
  };

  const handleSelectRepeatEndDate = (date) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(23, 59);
    const endOfDayTimestamp = selectedDate.getTime();
    const updateWorkItem = { ...work };
    updateWorkItem.dateEndRepeat = endOfDayTimestamp;
    setWork(updateWorkItem);
    setSelectEndDateVisible(false);
  };

  useEffect(() => {
    if (!isEndDateRepeat) {
      const updateWorkItem = { ...work };
      updateWorkItem.dateEndRepeat = null;
      setWork(updateWorkItem);
    }
  }, [isEndDateRepeat]);

  const stringToNumberArray = (str) => {
    return String(str).split(",").map(Number);
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* WorkHeader Component */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBack()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.projectName}>
              {work?.projectName || "Task"}
            </Text>
            <AntDesign name="down" size={15} color="white" />
          </TouchableOpacity>
          <Pressable onPress={() => AddWorkFunc()}>
            <Text style={{ color: "white", fontSize: 16 }}>Create</Text>
          </Pressable>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View>
              <View style={styles.projectHeader}>
                <Text style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
                  Choose Project
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.projectItem,
                  work?.projectId === null && styles.selectedProject,
                ]}
                onPress={() => handleUpdateProject(null)}
              >
                <MaterialIcons name="home-work" size={24} color="#7f7fff" />
                <Text>Task</Text>
              </TouchableOpacity>
              <FlatList
                data={listProject}
                renderItem={renderProjectItem}
                keyExtractor={(item) => item.id?.toString()}
              />
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {tagSelectionModalVisible && (
          <TagSelectionModal
            isVisible={tagSelectionModalVisible}
            onSelectTag={handleSelectTag}
            onClose={hideTagSelectionModal}
            selectedTags={listTagSelected}
            navigation={navigation}
          />
        )}
        <PriorityModal
          visible={priorityModalVisible}
          onSelectPriority={handleSelectPriority}
          onClose={hidePriorityModal}
        />
        {work && (
          <ChangePomodoro
            visible={pomodoroVisible}
            initPomo={work.numberOfPomodoros}
            initTime={work.timeOfPomodoro}
            onClose={() => setPomodoroVisible(false)}
            onSubmit={changePomodoro}
          />
        )}

        {work && (
          <DateTimePicker
            visible={dateTimePickerVisible}
            onSelectTime={handleDateTimePicked}
            onClose={hideDateTimePicker}
            defaultTime={defaultTime}
          />
        )}

        {work && (
          <DateTimePicker
            visible={calendarVisible}
            onSelectTime={handleSelectDueDate}
            onClose={() => setCalendarVisible(false)}
            defaultTime={work?.dueDate ? work?.dueDate : defaultTime}
          />
        )}

        <View>
          <View style={styles.namecontainer}>
            <View>
              <View style={styles.name}>
                <TouchableOpacity
                  style={{ justifyContent: "center" }}
                  onPress={() => changeWorkState()}
                >
                  <View style={styles.cirle}></View>
                </TouchableOpacity>
                <View>
                  <TextInput
                    style={{
                      fontSize: 15,
                      paddingLeft: 10,
                    }}
                    value={work.workName}
                    placeholder="enter Work name"
                    onChangeText={(text) => handleChangeName(text)}
                  />
                  <View style={styles.tagsContainer}>
                    {listTagSelected?.map((tag) => (
                      <TouchableOpacity
                        onPress={() => DeleteTag(tag.id)}
                        key={tag.id}
                        style={[styles.tag, { backgroundColor: tag.colorCode }]}
                      >
                        <Text style={styles.tagText}>{tag.tagName} </Text>

                        <View style={{ justifyContent: "center" }}>
                          <Ionicons name="close" size={12} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      onPress={() => showTagSelectionModal()}
                      style={[styles.tag, { backgroundColor: "green" }]}
                    >
                      <Text style={styles.tagText}>+ Add Tag</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => showPriorityModal()}>
              <FontAwesome6 name="flag" size={24} color={colorflag()} />
            </TouchableOpacity>
          </View>

          <View style={styles.bodycontainer}>
            <View>
              <TouchableOpacity
                onPress={() => setPomodoroVisible(true)}
                style={styles.content}
              >
                <View>
                  <View style={styles.name}>
                    <AntDesign name="clockcircle" size={24} color="gray" />
                    <View style={{ justifyContent: "center" }}>
                      <Text style={{ paddingLeft: 15 }}>Pomodoro</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={styles.pomodoroContainer}>
                    <MaterialCommunityIcons
                      name="clock-check"
                      size={14}
                      color="#ff3232"
                    />
                    <Text style={styles.pomodoroText}>
                      0/
                    </Text>
                    <MaterialCommunityIcons
                      name="clock"
                      size={14}
                      color="#ff9999"
                    />
                    <Text style={[styles.pomodoroText, { marginRight: 5 }]}>
                      {work.numberOfPomodoros}
                    </Text>
                  </View>
                  <View style={styles.pomodoroContainer}>
                    <MaterialCommunityIcons
                      name="clock"
                      size={14}
                      color="#ff9999"
                    />
                    <Text style={{ color: "gray" }}>
                      ={work.timeOfPomodoro}M
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => openSelectDueDate()}
              style={styles.content}
            >
              <View>
                <TouchableOpacity style={styles.name}>
                  <AntDesign name="calendar" size={24} color="gray" />
                  <View style={{ justifyContent: "center" }}>
                    <Text style={{ paddingLeft: 15 }}>Due Date</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>{renderDay()}</View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => showDateTimePicker()}
              style={styles.content}
            >
              <View>
                <View style={styles.name}>
                  <Entypo name="bell" size={24} color="gray" />
                  <View style={{ justifyContent: "center" }}>
                    <Text style={{ paddingLeft: 15 }}>Remindered</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text>{work.isRemindered ? renderTime() : "None"}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenRepeatSelection}
              style={styles.content}
            >
              <View>
                <View style={styles.name}>
                  <Fontisto name="spinner-refresh" size={24} color="gray" />
                  <View style={{ justifyContent: "center" }}>
                    <Text style={{ paddingLeft: 15 }}>Repeat</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: 200,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: work?.typeRepeat ? 12 : 14,
                    paddingRight: work?.typeRepeat ? 5 : 0,
                  }}
                >
                  {work?.typeRepeat ? renderRepeatTime() : "None"}
                </Text>
                {work?.typeRepeat && (
                  <TouchableOpacity onPress={deleteRepeat}>
                    <AntDesign name="closecircle" size={22} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
            {work?.typeRepeat && (
              <TouchableOpacity
                style={styles.content}
                onPress={handleOpenEndDateRepeat}
              >
                <View>
                  <View style={styles.name}>
                    <Entypo name="bell" size={24} color="gray" />
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ paddingLeft: 15 }}>Date End Repeat</Text>
                      {isEndDateRepeat && <Text>: {renderEndDate()}</Text>}
                    </View>
                  </View>
                </View>
                <View>
                  <Switch
                    trackColor={{ false: "gray", true: "red" }}
                    thumbColor={"white"}
                    value={isEndDateRepeat}
                    onValueChange={() => setEndDateRepeat(!isEndDateRepeat)}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.namecontainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Add Note"
              multiline={true}
              numberOfLines={6}
              value={work.note}
              onChangeText={(text) => changeNote(text)}
            />
          </View>
          <View style={{ height: 120 }}></View>
        </View>
      </ScrollView>

      <RepeatSelection
        visible={isRepeatVisible}
        unitRepeat={work?.unitRepeat ? work?.unitRepeat : null}
        amountRepeat={work?.amountRepeat ? work?.amountRepeat : null}
        daysOfWeekRepeat={
          work?.daysOfWeekRepeat
            ? stringToNumberArray(work?.daysOfWeekRepeat)
            : []
        }
        typeRepeat={work?.typeRepeat ? work?.typeRepeat : null}
        onClose={handleChangeRepeat}
      />

      <CalendarPicker
        isVisible={isSelectEndDateVisible}
        onSelectDate={handleSelectRepeatEndDate}
        inititalDate={work?.dateEndRepeat}
        onClose={() => setSelectEndDateVisible(false)}
      />

      <ImageFocus />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ff7f7f",
    padding: 20,
  },
  projectName: {
    color: "#fff",
    fontSize: 18,
    paddingRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 20,
  },
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  selectedProject: {
    backgroundColor: "#ffcccc",
  },
  cancelButton: {
    padding: 15,
    textAlign: "center",
    fontSize: 18,
    color: "red",
    paddingBottom: 40,
    backgroundColor: "white",
  },
  moreOptionsModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  moreOption: {
    padding: 15,
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
  buttonMore: {
    width: 300,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "red",
    backgroundColor: "white",
  },
  buttonContainer: {
    alignItems: "center",
    borderRadius: 20,
  },
  projectHeader: {
    backgroundColor: "#ff9999",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 10,
    backgroundColor: "transparent",
    borderColor: "green",
  },
  cirle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: "green",
    borderWidth: 2,
  },
  namecontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "white",
    alignContent: "space-between",
    alignItems: "center",
  },
  bodycontainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  name: {
    flexDirection: "row",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    width: 320,
    paddingLeft: 10,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },

  tag: {
    borderRadius: 10,
    padding: 5,
    marginRight: 5,
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 5,
  },

  tagText: {
    color: "#fff",
  },
  pomodoroContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pomodoroText: {
    marginLeft: 2,
    fontSize: 12,
  },
  extraContainer: {
    marginLeft: 20,
    borderLeftColor: "lightgray",
    borderLeftWidth: 2,
    marginVertical: 10,
  },
  extraWorkItem: {
    width: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightActions: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addExtraWorkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  extraWorkInput: {
    paddingLeft: 10,
  },
  extra: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  buttonStart: {
    width: 300,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "white",
  },
  buttonCreate: {
    width: 300,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "white",
  },

  startOption: {
    padding: 15,
    textAlign: "center",
    fontSize: 18,
    color: "green",
  },
  createOption: {
    padding: 15,
    textAlign: "center",
    fontSize: 18,
    color: "green",
  },
});

export default CreateWorkPage;
