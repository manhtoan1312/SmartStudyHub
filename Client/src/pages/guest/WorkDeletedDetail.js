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
} from "react-native";
import {
  MaterialIcons,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import {
  DeleteWork,
  DeleteWorkComplete,
  GetDetailWork,
  MarkCompleted,
  RecoverWork,
  UpdateWork,
} from "../../services/Guest/WorkService";
import { GetAllTagOfUser } from "../../services/Guest/TagService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetProjectByStatus } from "../../services/Guest/ProjectService";
import ImageFocus from "../../components/Image_Focus";
import {
  CreateExtraWork,
  ExtraMarkCompleted,
  RecoverExtraWork,
} from "../../services/Guest/ExtraWork";

const WorkDeletedDetail = ({ route, navigation }) => {
  const id = route.params.id;
  const isMounted = useRef(true);

  const [work, setWork] = useState(null);
  const [moreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false);
  useEffect(() => {
    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = async () => {
    try {
      const [workResponse, listProjectResponse] = await Promise.all([
        GetDetailWork(id),
      ]);

      if (isMounted.current) {
        if (workResponse.success) {
          setWork(workResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDelete = async () => {
    const response = await DeleteWorkComplete(id);
    if (response.success) {
      navigation.goBack();
    } else {
      Alert.alert("Error when delete Work", response.message);
    }
  };

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

  const renderDay = () => {
    const dueDate = work.statusWork;
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let dateStart = new Date(work.dueDate);
    dateStart.setDate(dateStart.getDate() - 1);
    let date = dateStart.toLocaleDateString("en-US", options);

    if (dueDate === "TODAY") {
      date = "Today";
    } else if (dueDate === "TOMORROW") {
      date = "Tomorrow";
    }

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="calendar-alt" size={14} color="gray" />
        <Text style={{ padding: 5 }}>{date}</Text>
      </View>
    );
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ padding: 5 }}>{result}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBack()}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Text style={styles.projectName}>
              {work?.projectName || "Mission"}
            </Text>
            <AntDesign name="down" size={15} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={showMoreOptions}>
            <MaterialIcons name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={moreOptionsModalVisible}
          onRequestClose={hideMoreOptions}
        >
          <View style={styles.moreOptionsModalContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonMore}
                onPress={handleDeleteWork}
              >
                <Text style={styles.moreOption}>Recover work</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.moreOptionsModalContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonMore}
                onPress={handleDeleteWork}
              >
                <Text style={styles.moreOption}>Delete completely</Text>
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
                  <TouchableOpacity style={{ justifyContent: "center" }}>
                    <AntDesign name="closecircle" size={24} color="red" />
                  </TouchableOpacity>
                  <View>
                    <Text
                      style={{
                        textDecorationLine: "line-through",
                        fontSize: 15,
                        paddingLeft: 10,
                      }}
                    >
                      {work.workName}
                    </Text>

                    <View style={styles.tagsContainer}>
                      {work.tags?.map((tag) => (
                        <TouchableOpacity
                          key={tag.id}
                          style={[
                            styles.tag,
                            { backgroundColor: tag.colorCode },
                          ]}
                        >
                          <Text style={styles.tagText}>{tag.tagName} </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="ios-flag" size={24} color={colorflag()} />
              </TouchableOpacity>
            </View>

            <View style={styles.bodycontainer}>
              <View>
                <TouchableOpacity style={styles.content}>
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
              <TouchableOpacity style={styles.content}>
                <View>
                  <View style={styles.name}>
                    <AntDesign name="calendar" size={24} color="gray" />
                    <View style={{ justifyContent: "center" }}>
                      <Text style={{ paddingLeft: 15 }}>Due Date</Text>
                    </View>
                  </View>
                </View>
                <View>
                  {work.statusWork !== "SOMEDAY" ? (
                    renderDay()
                  ) : (
                    <Text>None</Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.content}>
                <View>
                  <View style={styles.name}>
                    <Entypo name="bell" size={24} color="gray" />
                    <View style={{ justifyContent: "center" }}>
                      <Text style={{ paddingLeft: 15 }}>Remindered</Text>
                    </View>
                  </View>
                </View>
                <View>
                  {work.isRemindered ? renderTime() : <Text>False</Text>}
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.namecontainer}>
              <View>
                {work.extraWorksDeleted.length > 0 &&
                  work.extraWorksDeleted.map((item) => (
                    <View style={styles.content} key={item.id}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity>
                          <AntDesign name="closecircle" size={24} color="red" />
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
                    </View>
                  ))}
              </View>
            </View>
            <View style={styles.namecontainer}>
              <Text style={styles.noteInput}>{work.note}</Text>
            </View>
          </View>
        )}
      </ScrollView>
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
});

export default WorkDeletedDetail;
