import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { GetAllTagOfUser } from "../services/Guest/TagService";
import { GetProjectByStatus } from "../services/Guest/ProjectService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "react-native-modal-datetime-picker";

const AddWorkModal = ({
  onDone,
  closeKeyboard,
  handlecloseKeyboard,
  project,
  priority,
  type,
  tagId,
}) => {
  const [workName, setWorkName] = useState(null);
  const [pomodoroEstimate, setPomodoroEstimate] = useState(1);
  const [selectedClockIndex, setSelectedClockIndex] = useState(-1);
  const [listproject, setListProject] = useState([]);
  const [tag, setListTag] = useState(null);
  const [isPriorityModalVisible, setIsPriorityModalVisible] = useState(false);
  const [prioritSelect, setPriority] = useState(priority ? priority : "NONE");
  const [isProjectListModalVisible, setIsProjectListModalVisible] =
    useState(false);
  const [selectedProject, setSelectedProject] = useState(
    project ? project : { id: null, projectName: "Mission" }
  );
  const [selectedTag, setSelectedTag] = useState(tagId ? [tagId] : []);
  const [isTagListModalVisible, setIsTagListModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [onDateChange, setOnDateChange] = useState(false);
  const navigation = useNavigation();
  const fetchData = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await GetAllTagOfUser(id);
    const rs = await GetProjectByStatus(id, "ACTIVE");
    if (response.success) {
      setListTag(response.data);
    } else {
    }
    if (rs.success) {
      setListProject(rs.data);
    } else {
    }
  };
  useEffect(() => {
    fetchData();
    setSelectedDate(getDefaultTime(type));
  }, [type]);

  const getDefaultTime = (type) => {
    const defaultTime = new Date();
    defaultTime.setSeconds(0);
    defaultTime.setMilliseconds(0);

    if (type === "TODAY") {
      defaultTime.setHours(8);
      defaultTime.setMinutes(30);
    } else if (type === "TOMORROW") {
      defaultTime.setDate(defaultTime.getDate() + 1);
      defaultTime.setHours(8);
      defaultTime.setMinutes(30);
    } else if (type === "NEXT7DAY") {
      defaultTime.setDate(defaultTime.getDate() + 7);
      defaultTime.setHours(8);
      defaultTime.setMinutes(30);
    } else if (type === "THISWEEK") {
      defaultTime.setDate(defaultTime.getDate() + (7 - defaultTime.getDay()));
      defaultTime.setHours(8);
      defaultTime.setMinutes(30);
    } else {
      defaultTime.setDate(defaultTime.getDate() + 1);
      defaultTime.setHours(8);
      defaultTime.setMinutes(30);
    }

    return defaultTime;
  };

  const handleDonePress = () => {
    const selectedDateWithoutTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + 1
    );
    if (!prioritSelect) {
      setPriority("NONE");
    }
    if (type === "SOMEDAY") {
      onDone(
        selectedProject.id,
        prioritSelect,
        null,
        selectedDate.getTime(),
        selectedClockIndex == -1 ? 0 : selectedClockIndex,
        selectedTag.map((tag) => tag.id)
      );
    } else {
      onDone(
        selectedProject.id,
        prioritSelect,
        selectedDateWithoutTime.getTime() - 1,
        selectedDate.getTime(),
        selectedClockIndex == -1 ? 0 : selectedClockIndex,
        selectedTag.map((tag) => tag.id)
      );
    }
  };

  const handleTouchablePress = () => {
    handlecloseKeyboard();
  };

  const handleClockSelect = (index) => {
    setSelectedClockIndex(index);
  };

  const handlePrioritySelect = (selectedPriority) => {
    setPriority(selectedPriority);
    setIsPriorityModalVisible(false);
  };

  const handleProjectListPress = () => {
    setIsProjectListModalVisible(true);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setIsProjectListModalVisible(false);
  };

  const colorFlag = () => {
    if (prioritSelect === "LOW") {
      return "green";
    } else if (prioritSelect === "NORMAL") {
      return "yellow";
    } else if (prioritSelect === "HIGH") {
      return "red";
    } else {
      return "gray";
    }
  };

  const iconDay = () => {
    if (type === "TODAY") {
      return (
        <TouchableOpacity onPress={() => showTimePicker()}>
          <Ionicons name="sunny" size={24} color="green" />
        </TouchableOpacity>
      );
    } else if (type === "TOMORROW") {
      return (
        <TouchableOpacity onPress={() => showTimePicker()}>
          <MaterialCommunityIcons
            name="weather-sunset"
            size={24}
            color="orange"
          />
        </TouchableOpacity>
      );
    } else if (type === "NEXT7DAY") {
      return (
        <TouchableOpacity onPress={() => showTimePicker()}>
          <FontAwesome name="calendar-check-o" size={24} color="blue" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => showTimePicker()}>
          <AntDesign name="calendar" size={24} color="purple" />
        </TouchableOpacity>
      );
    }
  };

  const renderPriorityModal = () => {
    if (isPriorityModalVisible && closeKeyboard) {
      return (
        <View style={styles.priorityModal}>
          <View style={styles.priorityRow}>
            {renderPriorityButton("HIGH", "red")}
            {renderPriorityButton("NORMAL", "yellow")}
          </View>
          <View style={styles.priorityRow}>
            {renderPriorityButton("LOW", "green")}
            {renderPriorityButton("NONE", "gray")}
          </View>
        </View>
      );
    }
    return null;
  };

  const renderPriorityButton = (text, backgroundColor) => {
    return (
      <View style={{}}>
        <TouchableOpacity
          style={[styles.priorityButton, { backgroundColor }]}
          onPress={() => {
            setPriority(text);
          }}
        >
          <FontAwesome name="flag" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.priorityText}>{text}</Text>
      </View>
    );
  };

  const selectMission = () => {
    setSelectedProject({
      id: null,
      projectName: "Mission",
      colorCode: "#0000FF",
    });
    setIsProjectListModalVisible(false);
  };

  const renderProjectListModal = () => {
    if (isProjectListModalVisible && listproject && listproject.length > 0) {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isProjectListModalVisible}
          onRequestClose={() => setIsProjectListModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.projectListModal}>
              <TouchableOpacity
                style={styles.projectListItem}
                onPress={() => selectMission()}
              >
                <View
                  style={[styles.cirleSmall, { backgroundColor: "blue" }]}
                ></View>
                <Text style={styles.projectListItemText}>Mission</Text>
              </TouchableOpacity>
              <FlatList
                data={listproject}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.projectListItem}
                    onPress={() => handleProjectSelect(item)}
                  >
                    <View
                      style={[
                        styles.cirleSmall,
                        { backgroundColor: item.colorCode },
                      ]}
                    ></View>
                    <Text style={styles.projectListItemText}>
                      {item.projectName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.projectListItem}
                onPress={() => {
                  setIsProjectListModalVisible(false);
                  navigation.navigate("AddProject");
                }}
              >
                <Text style={{ color: "red" }}>+ Add a Project</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsProjectListModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  };

  const handleTagListPress = () => {
    setIsTagListModalVisible(true);
  };

  const handleTagSelect = (tag) => {
    const isSelected = selectedTag.some((t) => t.id === tag.id);

    if (isSelected) {
      const updatedTags = selectedTag.filter((t) => t.id !== tag.id);
      setSelectedTag(updatedTags);
    } else {
      setSelectedTag([...selectedTag, tag]);
    }
  };

  const renderTagModal = () => {
    if (isTagListModalVisible && tag && tag.length > 0) {
      return (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isTagListModalVisible}
          onRequestClose={() => setIsTagListModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.projectListModal}>
              <FlatList
                data={tag}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.projectListItem,
                      {
                        backgroundColor: selectedTag.some(
                          (t) => t.id === item.id
                        )
                          ? "#FFDDDD"
                          : "transparent",
                      },
                    ]}
                    onPress={() => handleTagSelect(item)}
                  >
                    <Feather name="tag" size={24} color={item.colorCode} />
                    <Text style={styles.projectListItemText}>
                      {item.tagName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.projectListItem}
                onPress={() => {
                  setIsTagListModalVisible(false);
                  navigation.navigate("AddTag");
                }}
              >
                <Text style={{ color: "red" }}>+ Add a Tag</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsTagListModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  const showTimePicker = () => {
    setOnDateChange(true);
    setShowPicker(true);
  };
  const handleDateTimeConfirm = (dateTime) => {
    setOnDateChange(true);
    setSelectedDate(dateTime);
    hideDateTimePicker();
  };

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={handleTouchablePress}
    >
      <View
        style={{
          paddingBottom: 50,
          backgroundColor: "white",
        }}
      >
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Estimate Number of Pomodoro</Text>
          <View style={styles.iconContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.iconButton}
                onPress={() => handleClockSelect(index)}
              >
                <MaterialCommunityIcons
                  name="clock-time-five"
                  size={24}
                  color={selectedClockIndex >= index ? "#ff6666" : "#b2b2b2"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.projectInfoContainer}>
              {iconDay()}
              <Feather
                style={{ marginLeft: 15 }}
                name="flag"
                size={24}
                color={colorFlag()}
                onPress={() => {
                  setIsPriorityModalVisible(true);
                  handlecloseKeyboard();
                }}
              />
              <TouchableOpacity onPress={handleTagListPress}>
                <Feather
                  style={{ marginLeft: 15 }}
                  name="tag"
                  size={24}
                  color={
                    selectedTag?.colorCode ? selectedTag?.colorCode : "gray"
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.projectTextContainer}
                onPress={handleProjectListPress}
              >
                <View
                  style={[
                    styles.cirle,
                    {
                      backgroundColor: selectedProject?.colorCode
                        ? selectedProject?.colorCode
                        : "blue",
                    },
                  ]}
                ></View>
                <Text style={styles.projectNameText}>
                  {selectedProject?.projectName
                    ? selectedProject?.projectName
                    : "Mission"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => handleDonePress()}
              style={styles.doneContainer}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderPriorityModal()}
        {renderProjectListModal()}
        {renderTagModal()}

        {showPicker && (
          <DateTimePicker
            isVisible={true}
            mode="datetime"
            date={selectedDate}
            onConfirm={(value) => handleDateTimeConfirm(value)}
            onCancel={hideDateTimePicker}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  modal: {
    paddingVertical: 10,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 12,
    marginBottom: 10,
    color: "gray",
    textAlign: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    padding: 10,
    borderRadius: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  projectInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectTextContainer: {
    marginLeft: 35,
    flexDirection: "row",
    justifyContent: "center",
  },
  projectNameText: {
    marginLeft: 10,
    flex: 1,
    marginTop: 5,
  },
  doneContainer: {
    position: "absolute",
    top: 0,
    right: 10,
  },
  doneText: {
    fontSize: 16,
    color: "green",
  },
  cirle: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  priorityModal: {
    flexDirection: "column",
    alignContent: "space-around",
  },
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  priorityButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    padding: 10,
    width: 50,
    height: 50,
  },
  priorityText: {
    color: "gray",
    marginTop: 5,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  projectListModal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
  },
  projectListItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
  },
  cirleSmall: {
    height: 15,
    width: 15,
    borderRadius: 7,
    marginRight: 5,
    alignItems: "center",
  },
});

export default AddWorkModal;
