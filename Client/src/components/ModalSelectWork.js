import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import WorkItem from "./WorkFocus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  EvilIcons,
  AntDesign,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import {
  GetWorkByPriority,
  GetWorkByType,
} from "../services/Guest/WorkService";
import getRole from "../services/RoleService";
import { useDispatch, useSelector } from "react-redux";
import { setFocus } from "../slices/focusSlice";

const ModalSelectWork = ({ isVisible, play, onClose }) => {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState("Today");
  const [chooseTypeVisible, setChooseTypeVisible] = useState(false);
  const [typeOptions] = useState([
    { name: "Today", icon: <Feather name="sun" size={20} color="#21D375" /> },
    {
      name: "Out Of Date",
      icon: (
        <MaterialIcons
          style={styles.itemRow}
          name="assignment-late"
          size={20}
          color="red"
        />
      ),
    },
    {
      name: "Tomorrow",
      icon: (
        <MaterialCommunityIcons
          name="weather-sunset"
          style={styles.itemRow}
          size={20}
          color="orange"
        />
      ),
    },
    {
      name: "This Week",
      icon: (
        <MaterialCommunityIcons
          name="calendar-range-outline"
          style={styles.itemRow}
          size={20}
          color="purple"
        />
      ),
    },
    {
      name: "Next 7 Days",
      icon: (
        <MaterialCommunityIcons
          name="calendar-arrow-right"
          style={styles.itemRow}
          size={20}
          color="#32CD32"
        />
      ),
    },
    {
      name: "Some Day",
      icon: (
        <MaterialCommunityIcons
          name="calendar-text-outline"
          style={styles.itemRow}
          size={20}
          color="purple"
        />
      ),
    },
    {
      name: "All",
      icon: (
        <MaterialCommunityIcons
          name="select-all"
          style={styles.itemRow}
          size={20}
          color="orange"
        />
      ),
    },
    {
      name: "Task Default",
      icon: <AntDesign name="profile" size={20} color="#ff5722" />,
    },
    {
      name: "Planned",
      icon: (
        <MaterialCommunityIcons
          name="calendar-check-outline"
          style={styles.itemRow}
          size={20}
          color="#87CEFA"
        />
      ),
    },
    {
      name: "Low Priority",
      icon: (
        <Fontisto
          name="flag"
          style={styles.itemRow}
          size={20}
          color="#00FF7F"
        />
      ),
    },
    {
      name: "Normal Priority",
      icon: (
        <Fontisto name="flag" style={styles.itemRow} size={20} color="orange" />
      ),
    },
    {
      name: "High Priority",
      icon: (
        <Fontisto name="flag" style={styles.itemRow} size={20} color="red" />
      ),
    },
  ]);
  const [data, setData] = useState([]);
  const { defaultTimePomodoro } = useSelector((state) => state.focus);

  useEffect(() => {
    fetchDataFPT(selectedType);
  }, [selectedType, isVisible]);

  const fetchDataFPT = async (type) => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    try {
      let result;
      switch (type) {
        case "Today":
          result = await GetWorkByType("TODAY", id);
          break;
        case "OutOfDate":
          result = await GetWorkByType("OUTOFDATE", id);
          break;
        case "Tomorrow":
          result = await GetWorkByType("TOMORROW", id);
          break;
        case "This Week":
          result = await GetWorkByType("THISWEEK", id);
          break;
        case "Next 7 Day":
          result = await GetWorkByType("NEXT7DAY", id);
          break;
        case "Some Day":
          result = await GetWorkByType("SOMEDAY", id);
          break;
        case "All":
          result = await GetWorkByType("ALL", id);
          break;
        case "Task Default":
          result = await GetWorkByType("TASK_DEFAULT", id);
          break;
        case "Planned":
          result = await GetWorkByType("PLANNED", id);
          break;
        case "Low Priority":
          result = await GetWorkByPriority("LOW", id);
          break;
        case "Normal Priority":
          result = await GetWorkByPriority("NORMAL", id);
          break;
        case "High Priority":
          result = await GetWorkByPriority("HIGH", id);
          break;
        default:
          result = await GetWorkByPriority("ALL", id);
          break;
      }

      if (result && result.success) {
        setData(result.data.listWorkActive);
      } else {
        Alert.alert("Error fetching data", result?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onSelect = async (workItem, type, play) => {
    try {
      if (type === "WORK") {
        dispatch(
          setFocus({
            workId: workItem.id,
            workName: workItem.workName,
            startTime: workItem?.startTime,
            numberOfPomodoro: workItem.numberOfPomodoro,
            numberOfPomodorosDone: workItem.numberOfPomodorosDone,
            pomodoroTime: workItem.timeOfPomodoro,
            isPause: true,
            isStop: true,
            secondsLeft: workItem.timeOfPomodoro * 60,
          })
        );
      } else {
        dispatch(
          setFocus({
            workId: null,
            workName: null,
            startTime: null,
            numberOfPomodoro: 0,
            numberOfPomodorosDone: 0,
            pomodoroTime: defaultTimePomodoro,
            isPause: true,
            isStop: true,
            secondsLeft: defaultTimePomodoro * 60,
            extraWorkId: workItem?.extraWorkId,
            extraWorkName: workItem?.extraWorkName,
            extraWorkId: workItem?.id,
          })
        );
      }
      if (play) {
        dispatch(
          setFocus({
            isPause: false,
            isStop: false,
          })
        );
      }
      onClose();
    } catch (e) {
      Alert.alert("Error when save work", e);
    }
  };

  const renderWorkItems = () => {
    if (data.length > 0) {
      return data?.map((workItem) => (
        <TouchableOpacity key={workItem.id} style={styles.workItem}>
          <WorkItem workItem={workItem} onSelect={onSelect} />
        </TouchableOpacity>
      ));
    }
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 80,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "400", color: "red" }}>
          No Work active
        </Text>
      </View>
    );
  };

  const renderChooseTypeModal = () => {
    return (
      <Modal
        transparent
        animationType="slide"
        visible={chooseTypeVisible}
        onRequestClose={() => setChooseTypeVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setChooseTypeVisible(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Type</Text>
            <ScrollView>
              {typeOptions.map((type) => (
                <TouchableOpacity
                  key={type.name}
                  style={styles.chooseTypeItem}
                  onPress={() => {
                    setSelectedType(type.name);
                    fetchDataFPT(type.name);
                    setChooseTypeVisible(false);
                  }}
                >
                  <View style={styles.typeOption}>
                    {type.icon}
                    <Text style={styles.typeOptionText}>{type.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setChooseTypeVisible(true)}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Text style={styles.modalTitle}>{selectedType}</Text>
            </TouchableOpacity>
            <ScrollView style={styles.workList}>{renderWorkItems()}</ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {renderChooseTypeModal()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  workList: {
    overflow: "scroll",
    maxHeight: 400,
    minHeight: 200,
  },
  workItem: {
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: "#ff3232",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  playButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  chooseTypeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeOptionText: {
    marginLeft: 10,
  },
});

export default ModalSelectWork;
