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
} from "react-native";
import {
  MaterialIcons,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  FontAwesome,
  FontAwesome6,
  EvilIcons,
  Fontisto,
} from "@expo/vector-icons";
import {
  DeleteWork,
  GetDetailWork,
  MarkCompleted,
  RecoverWork,
  UpdateWork,
} from "../../services/Guest/WorkService";
import { GetAllTagOfUser } from "../../services/Guest/TagService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetProjectByStatus } from "../../services/Guest/ProjectService";
import ImageFocus from "../../components/Image_Focus";
import { TextInput } from "react-native-gesture-handler";
import PriorityModal from "../../components/PriorityModal";
import TagSelectionModal from "../../components/TagSelectionModal";
import ChangePomodoro from "../../components/ChangePomodoro";
import DateTimePicker from "../../components/DateTimePicker";
import {
  CreateExtraWork,
  ExtraMarkCompleted,
  RecoverExtraWork,
} from "../../services/Guest/ExtraWork";
import getRole from "../../services/RoleService";
import { setFocus } from "../../slices/focusSlice";
import { useDispatch } from "react-redux";
import RepeatSelection from "./RepeatSelection";
import RepeatWork from "../../services/PREMIUM/RepeatWorkService";

const WorkDetail = ({ route, navigation }) => {
  const id = route.params.id;
  const isMounted = useRef(true);

  const [work, setWork] = useState(null);
  const [listTagSelected, setListTagSelected] = useState([]);
  const [listProject, setlistProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [tagSelectionModalVisible, setTagSelectionModalVisible] =
    useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [pomodoroVisible, setPomodoroVisible] = useState(false);
  const [dateTimePickerVisible, setDateTimePickerVisible] = useState(false);
  const [extraWorkName, setExtraWorkName] = useState("");
  const [note, setNote] = useState(work?.note || "");
  const [isRepeatVisible, setRepeatVisible] = useState(false);
  const dispatch = useDispatch();
  const defaultTime = new Date();
  defaultTime.setHours(23);
  defaultTime.setMinutes(59);
  useEffect(() => {
    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (work?.workName) {
      updateWork();
    }
  }, [work?.typeRepeat]);
  const fetchData = async () => {
    try {
      setNote("");
      setExtraWorkName("");
      const role = await getRole();
      let userId;
      if (role) {
        userId = role.id;
      } else {
        userId = await AsyncStorage.getItem("id");
      }
      const [workResponse, listProjectResponse] = await Promise.all([
        GetDetailWork(id),
        GetProjectByStatus(userId, "ACTIVE"),
      ]);

      if (isMounted.current) {
        if (workResponse.success) {
          console.log(workResponse.data);
          setWork(workResponse.data);
          setListTagSelected(workResponse.data.tags);
          setNote(workResponse.data?.note || "");
        }

        if (listProjectResponse.success) {
          setlistProject(listProjectResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBack = async () => {
    await updateWork();
    navigation.goBack();
  };

  const handleDelete = async () => {
    await updateWork();
    const response = await DeleteWork(id);
    if (response.success) {
      navigation.goBack();
    } else {
      Alert.alert("Error when delete Work", response.message);
    }
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

  const showMoreOptions = () => {
    setMoreOptionsModalVisible(true);
  };

  const hideMoreOptions = () => {
    setMoreOptionsModalVisible(false);
  };

  const handleDeleteWork = () => {
    hideMoreOptions();
    handleDelete();
  };

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

  const handleOpenRepeatSelection = async() => {
    const role = await getRole()
    if(role && role.role==='PREMIUM'){
      setRepeatVisible(true);
    }
    else{
      navigation.navigate('PREMIUM')
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

  const handleChangeName = (text) => {
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

  const handleStartPomodoro = async () => {
    dispatch(
      setFocus({
        workId: work.id,
        workName: work.workName,
        startTime: work?.startTime,
        numberOfPomodoro: work.numberOfPomodoro,
        numberOfPomodorosDone: work.numberOfPomodorosDone,
        pomodoroTime: work.timeOfPomodoro,
        isPause: true,
        isStop: true,
      })
    );
    setMoreOptionsModalVisible(false);
    navigation.navigate("Focus");
  };
  const handleCreatePomodoro = async () => {
    setMoreOptionsModalVisible(false);
    await updateWork();
    navigation.navigate("CreatePomodoro", {
      work: work,
    });
  };
  const stringToNumberArray = (str) => {
    return str.split(",").map(Number);
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
    updateWork.statusWork = "SOMEDAY";
    setWork(updateWork);
  };
  const renderDay = () => {
    const dueDate = work.statusWork;
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let dateStart = new Date(work.dueDate);
    dateStart.setDate(dateStart.getDate());
    let date = dateStart.toLocaleDateString("en-US", options);

    if (dueDate === "TODAY") {
      date = "Today";
    } else if (dueDate === "TOMORROW") {
      date = "Tomorrow";
    }

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
  const updateWork = async () => {
    if (work.workName) {
      try {
        const updatedWorkdata = { ...work };
        updatedWorkdata.note = note;
        updatedWorkdata.tags = listTagSelected.map((tag) => ({ id: tag.id }));
        updatedWorkdata.extraWorks = updatedWorkdata.extraWorks.map(
          (extra) => ({
            id: extra.id,
          })
        );
        const response = await UpdateWork(
          updatedWorkdata.id,
          updatedWorkdata.userId,
          updatedWorkdata.projectId ? updatedWorkdata.projectId : null,
          null,
          updatedWorkdata.workName,
          updatedWorkdata.priority,
          updatedWorkdata.statusWork === "SOMEDAY"
            ? null
            : updatedWorkdata.dueDate,
          updatedWorkdata.timeWillAnnounce
            ? updatedWorkdata.timeWillAnnounce
            : null,
          updatedWorkdata.numberOfPomodoros,
          updatedWorkdata.timeOfPomodoro,
          updatedWorkdata.isRemindered ? updatedWorkdata.isRemindered : false,
          false,
          note,
          updatedWorkdata.status,
          updatedWorkdata.tags,
          updatedWorkdata.extraWorks,
          updatedWorkdata?.typeRepeat ? updatedWorkdata?.typeRepeat : null,
          updatedWorkdata?.unitRepeat ? updatedWorkdata?.unitRepeat : null,
          updatedWorkdata?.amountRepeat ? updatedWorkdata?.amountRepeat : null,
          updatedWorkdata?.daysOfWeekRepeat
            ? updatedWorkdata?.daysOfWeekRepeat
            : null
        );

        if (response.success) {
          console.log(
            "----------------------DATA AFTER UPDATE WORK----------------------"
          );
          console.log(response.data);
          console.log(
            "------------------------------------------------------------------"
          );

          setWork(response.data);
        } else {
          Alert.alert("Update Work Error", response.message);
        }
      } catch (error) {
        console.error("Error updating work:", error);
      }
    } else {
      Alert.alert("Warnning", "Workname can not be null");
    }
  };

  const addExtraWork = async () => {
    if (work.workName) {
      const response = await CreateExtraWork(work.id, extraWorkName);
      if (response.success) {
        setExtraWorkName("");
        await updateWork();
      } else {
        Alert.alert("Create Extra Work Error", response.message);
      }
    }
  };
  const changeWorkState = async () => {
    await updateWork();
    if (work.workName) {
      if (work.status === "ACTIVE") {
        const response = await MarkCompleted(work.id);
        if (response.success) {
          fetchData();
        } else {
          Alert.alert("Complete Work Error", response.message);
        }
      } else {
        const response = await RecoverWork(work.id);
        if (response.success) {
          fetchData();
        } else {
          Alert.alert("Recover Work Error", response.message);
        }
      }
    }
  };

  const handleRepeat = async () => {
    await updateWork();
    if (work.workName) {
      if (work.status === "ACTIVE") {
        const response = await RepeatWork(work.id);
        if (response.success) {
          fetchData();
        } else {
          Alert.alert("Repeat Work Error", response.message);
        }
      } else {
        const response = await RecoverWork(work.id);
        if (response.success) {
          fetchData();
        } else {
          Alert.alert("Recover Work Error", response.message);
        }
      }
    }
  };

  const playExtra = async (item) => {
    await updateWork();
    if (work.workName) {
      if (item.status === "ACTIVE") {
        try {
          dispatch(
            setFocus({
              extraWorkId: item.id,
              extraWorkName: item.extraWorkName,
              isPause: true,
              isStop: true,
              workId: null,
              workName: null,
              startTime: null,
              numberOfPomodoro: null,
              numberOfPomodorosDone: null,
              pomodoroTime: null,
            })
          );
          navigation.navigate("Focus");
        } catch (e) {
          Alert.alert("Error when save work", e);
        }
      }
    }
  };

  const CompletedExtraWork = async (id, status) => {
    await updateWork();
    if (work.workName) {
      if (status === "ACTIVE") {
        const response = await ExtraMarkCompleted(id);
        if (response.success) {
          fetchData();
        } else {
          Alert.alert("Mark complete work Error!", response.message);
        }
      } else {
        const response = await RecoverExtraWork(id);
        if (response.success) {
          fetchData();
        } else {
          Alert.alert("Recover Extrawork Error!", response.message);
        }
      }
    }
  };

  const renderRepeatTime = () => {
    if (work?.typeRepeat !== "CUSTOM") {
      return `Every ${work?.typeRepeat.toLowerCase()}`;
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
          <TouchableOpacity onPress={showMoreOptions}>
            <MaterialIcons name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Project Selection Modal */}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={moreOptionsModalVisible}
          onRequestClose={hideMoreOptions}
        >
          <View style={styles.moreOptionsModalContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonStart}
                onPress={handleStartPomodoro}
              >
                <Text style={styles.startOption}>Start Work</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonCreate}
                onPress={handleCreatePomodoro}
              >
                <Text style={styles.createOption}>Create New Pomodoro</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonMore}
                onPress={handleDeleteWork}
              >
                <Text style={styles.moreOption}>Delete</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonMore}
                onPress={hideMoreOptions}
              >
                <Text style={styles.moreOption}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {work && (
          <View>
            <View style={styles.namecontainer}>
              <View>
                <View style={styles.name}>
                  <TouchableOpacity
                    style={{ justifyContent: "center" }}
                    onPress={() => changeWorkState()}
                  >
                    {work.status === "ACTIVE" ? (
                      work?.typeRepeat ? (
                        <TouchableOpacity onPress={handleRepeat}>
                          <Fontisto
                            name="spinner-refresh"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.cirle}></View>
                      )
                    ) : (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="green"
                      />
                    )}
                  </TouchableOpacity>
                  <View>
                    <TextInput
                      style={{
                        textDecorationLine:
                          work.status === "COMPLETED" ? "line-through" : "none",
                        fontSize: 15,
                        paddingLeft: 10,
                      }}
                      value={work.workName}
                      placeholder="enter Work name"
                      onChange={(text) => handleChangeName(text)}
                    />
                    <View style={styles.tagsContainer}>
                      {listTagSelected?.map((tag) => (
                        <TouchableOpacity
                          onPress={() => DeleteTag(tag.id)}
                          key={tag.id}
                          style={[
                            styles.tag,
                            { backgroundColor: tag.colorCode },
                          ]}
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
                        {work.numberOfPomodorosDone}/
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
                <View>
                  {work.statusWork !== "SOMEDAY" ? (
                    renderDay()
                  ) : (
                    <Text>SOME DAY</Text>
                  )}
                </View>
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
            </View>
            <View style={styles.namecontainer}>
              <View style={{ flex: 1 }}>
                {work.extraWorks.length > 0 &&
                  work.extraWorks.map((item) => (
                    <View style={styles.extra} key={item.id}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            CompletedExtraWork(item.id, item.status)
                          }
                        >
                          {item.status === "COMPLETED" ? (
                            <AntDesign
                              style={{ marginRight: 5 }}
                              name="checkcircle"
                              size={24}
                              color="#00cc00"
                            />
                          ) : (
                            <View
                              style={[styles.cirle, { borderColor: "gray" }]}
                            />
                          )}
                        </TouchableOpacity>
                        <View style={{ paddingLeft: 10 }}>
                          <View
                            style={{
                              alignItems: "center",
                            }}
                          >
                            <Text>{item.extraWorkName}</Text>
                          </View>
                          {item.numberOfPomodoros > 0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              {[...Array(item.numberOfPomodoros)].map(
                                (_, index) => (
                                  <MaterialCommunityIcons
                                    key={index}
                                    name="clock"
                                    size={14}
                                    color="#ff9999"
                                  />
                                )
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                      <View style={{}}>
                        {item.status === "ACTIVE" ? (
                          <TouchableOpacity onPress={() => playExtra(item)}>
                            <AntDesign name="play" size={28} color="#ff3232" />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity>
                            <AntDesign
                              name="checkcircle"
                              size={24}
                              color="#00cc00"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                {work.status === "ACTIVE" && (
                  <View style={styles.addExtraWorkContainer}>
                    <AntDesign name="plus" size={24} color="gray" />
                    <TextInput
                      style={styles.extraWorkInput}
                      placeholder="Add Extra Work"
                      value={extraWorkName}
                      onChangeText={(text) => setExtraWorkName(text)}
                      returnKeyType="done"
                      onSubmitEditing={addExtraWork}
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.namecontainer}>
              <TextInput
                style={styles.noteInput}
                placeholder="Add Note"
                multiline={true}
                numberOfLines={6}
                value={note}
                onChangeText={(text) => setNote(text)}
              />
            </View>
            <View style={{ height: 120 }}></View>
          </View>
        )}
      </ScrollView>
      {work?.workName && (
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
      )}
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

export default WorkDetail;
