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

import { GetProjectByStatus } from "../services/Guest/ProjectService";
import { GetAllTagOfUser } from "../services/Guest/TagService";
import {
  GetWorkByPriority,
  GetWorkByType,
} from "../services/Guest/WorkService";
import { justifyContent } from "react-native-wind/dist/styles/flex/justify-content";

const ModalSelectWork = ({ isVisible, play, onClose }) => {
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedType, setSelectedType] = useState("Today");
  const [chooseTypeVisible, setChooseTypeVisible] = useState(false);
  const [typeOptions] = useState([
    "Today",
    "OutOfDate",
    "Tomorrow",
    "ThisWeek",
    "Next7Day",
    "SomeDay",
    "All",
    "TaskDefault",
    "Planned",
    "LowPriority",
    "NORMALPriority",
    "HighPriority",
  ]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDataFPT(selectedType);
  }, [selectedType, isVisible]);
  const fetchDataFPT = async (type) => {
    const id = await AsyncStorage.getItem("id");
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
        case "ThisWeek":
          result = await GetWorkByType("THISWEEK", id);
          break;
        case "Next7Day":
          result = await GetWorkByType("NEXT7DAY", id);
          break;
        case "SomeDay":
          result = await GetWorkByType("SOMEDAY", id);
          break;
        case "All":
          result = await GetWorkByType("ALL", id);
          break;
        case "TaskDefault":
          result = await GetWorkByType("TASK_DEFAULT", id);
          break;
        case "Planned":
          result = await GetWorkByType("PLANNED", id);
          break;
        case "LowPriority":
          result = await GetWorkByPriority("LOW", id);
          break;
        case "NORMALPriority":
          result = await GetWorkByPriority("NORMAL", id);
          break;
        case "HighPriority":
          result = await GetWorkByPriority("HIGH", id);
          break;
        default:
          break;
      }

      if (result && result.success) {
        setData(result.data.listWorkActive);
      } else {
        Alert.alert("Error fetching data", result.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


const onSelect = async (workItem, type) => {
    try{
        await AsyncStorage.setItem('work', JSON.stringify(workItem))
        await AsyncStorage.setItem('workType', type)
        onClose()
    }
    catch(e) {
        Alert.alert("Error when save work", e)
    }
}
  const renderWorkItems = () => {
    if (data.length > 0) {
      return data?.map((workItem) => (
        <TouchableOpacity
          key={workItem.id}
          style={styles.workItem}
        >
          <WorkItem workItem={workItem} onSelect={onSelect}/>
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
        <Text style={{ fontSize: 20, fontWeight: 400, color:'red' }}>No Work active</Text>
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
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Type</Text>
            <ScrollView>
              {typeOptions.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.chooseTypeItem}
                  onPress={() => {
                    setSelectedType(type);
                    fetchDataFPT(type);
                    setChooseTypeVisible(false);
                  }}
                >
                  <Text>{type}</Text>
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
});

export default ModalSelectWork;
