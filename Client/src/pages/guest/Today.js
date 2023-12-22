import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Keyboard,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import WorkActive from "../../components/WorkActive";
import WorkDone from "../../components/WorkDone";
import AddWorkModal from "../../components/AddWorkModal";
import HeaderDetail from "../../components/HeaderDetail";
import { GetDetailProject } from "../../services/Guest/ProjectService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateWork, GetWorkByType } from "../../services/Guest/WorkService";
import ImageFocus from "../../components/Image_Focus";
import { useIsFocused } from "@react-navigation/native";
const Today = ({ navigation }) => {
  const [project, setProject] = useState(null);
  const [workName, setWorkName] = useState(null);
  const [doneVisible, setDoneVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [closeKeyboard, setCloseKeyboard] = useState(false);
  const [preName, setPreName] = useState(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);
  useEffect(() => {
    fetchData();
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        setKeyboardHeight(keyboardHeight);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchData = async () => {
    const id = await AsyncStorage.getItem("id");
    const response = await GetWorkByType("TODAY", id);
    if (response.success) {
      setProject(response.data);
    } else {
      Alert.alert("Error when get Today work!", response.message);
      navigation.navigate("Home");
    }
  };

  const handleClosekeyboard = () => {
    setCloseKeyboard(true);
    Keyboard.dismiss();
  };

  const handleDone = async (
    projectId,
    priority,
    dueDate,
    timeWillStart,
    numberOfPomodoros,
    tags
  ) => {
    setModalVisible(false);
    Keyboard.dismiss();
    const id = await AsyncStorage.getItem("id");
    const settings = await AsyncStorage.getItem("settings");
    let time = 25;
    if (settings) {
      const parsedData = JSON.parse(settings);
      time = parsedData.pomodoroTime;
    }
    if (workName) {
      const tagslist = tags.map((id) => ({ id: id }));
      const response = await CreateWork(
        id,
        projectId,
        tagslist,
        workName,
        priority,
        dueDate,
        numberOfPomodoros,
        time,
        timeWillStart
      );
        console.log(response)
      if (!response.success) {
        Alert.alert("Create Work Error", response.message);
      } else {
        fetchData();
      }
      setWorkName("");
    } else {
      Alert.alert("Warning", "You must enter work name");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        {project && (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={24} color="gray" />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: "400" }}>TODAY</Text>
              <AntDesign name="filter" size={24} color="gray" />
            </View>
            <View style={styles.body}>
              <View style={styles.detail}>
                <HeaderDetail
                  totalTimeWork={project.totalTimeWork}
                  totalWorkActive={project.totalWorkActive}
                  totalTimePassed={project.totalTimePassed}
                  totalWorkCompleted={project.totalWorkCompleted}
                />
              </View>
              <TouchableOpacity style={styles.input}>
                <AntDesign name="plus" size={24} color="black" />
                <TextInput
                  style={{ paddingLeft: 10 }}
                  placeholder="Add a Work..."
                  value={workName}
                  onChangeText={(text) => setWorkName(text)}
                  onFocus={() => {
                    setModalVisible(true);
                    setCloseKeyboard(false);
                  }}
                />
              </TouchableOpacity>
              {project.listWorkActive?.map((workItem) => (
                  <WorkActive
                    key={workItem.id}
                    workItem={workItem}
                    reload={fetchData}
                    navigation={navigation}
                  />
              ))}
              <TouchableOpacity
                style={styles.buttonComplete}
                onPress={() => setDoneVisible(!doneVisible)}
              >
                <Text style={{ fontSize: 12, color: "#666666" }}>
                  {doneVisible
                    ? "Hide completed tasks"
                    : "Displays completed tasks"}
                </Text>
                <AntDesign
                  name={doneVisible ? "up" : "down"}
                  size={15}
                  color="#666666"
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
              {doneVisible &&
                project.listWorkCompleted?.map((workItem) => (
                  <WorkDone
                    key={workItem.id}
                    workItem={workItem}
                    reload={fetchData}
                    navigation={navigation}
                  />
                ))}
            </View>
          </>
        )}
      </ScrollView>
      {modalVisible && (
        <AddWorkModal
          onDone={handleDone}
          closeKeyboard={closeKeyboard}
          keyboardHeight={keyboardHeight}
          handlecloseKeyboard={handleClosekeyboard}
          project={project}
          type="TODAY"
        />
      )}
      <ImageFocus />
    </KeyboardAvoidingView>
  );
  x;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  input: {
    flexDirection: "row",
    backgroundColor: "white",
    marginVertical: 10,
    paddingVertical: 18,
    paddingLeft: 10,
    borderRadius: 10,
  },
  body: {
    marginHorizontal: 10,
  },
  detail: {
    marginTop: 10,
  },
  buttonComplete: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 3,
    alignItems: "stretch",
    flex: 1,
    marginHorizontal: 100,
    borderRadius: 10,
  },
});

export default Today;
