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
  TouchableWithoutFeedback,SafeAreaView
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import WorkActive from "../../components/WorkActive";
import WorkDone from "../../components/WorkDone";
import AddWorkModal from "../../components/AddWorkModal";
import HeaderDetail from "../../components/HeaderDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreateWork, SortWork } from "../../services/Guest/WorkService";
import { GetTagDetail } from "../../services/Guest/TagService";
import ImageFocus from "../../components/Image_Focus";
import { useIsFocused } from "@react-navigation/native";
import SortWorkModal from "../../components/SortWorkModal";
import getRole from "../../services/RoleService";
const TagDetail = ({ route, navigation }) => {
  const id = route.params.id;
  const [tag, setTag] = useState(null);
  const [workName, setWorkName] = useState(null);
  const [doneVisible, setDoneVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [closeKeyboard, setCloseKeyboard] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortType, setSortType] = useState("");
  const [isSort, setIsSort] =useState(false)
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

  const handleSortWork = async (type, pro) => {
    setSortModalVisible(false);
    setIsSort(true)
    const body1 = JSON.stringify(pro?.listWorkActive);
    const body2 = JSON.stringify(pro?.listWorkCompleted);
    const response = await SortWork(body1, type);
    const response2 = await SortWork(body2, type);

    if (response.success) {
      const worksSortedArray = response.data || [];
      setTag((pre) =>( {...pre,workActive: worksSortedArray }));
    } else {
      console.log(response.message);
    }
    if (response2.success) {
      const worksSortedArray = response2.data || [];
      setTag((prev) => ({ ...prev, workCompleted: worksSortedArray }));
    } else {
      console.log(response2.message);
    }
    setSortType(type);
  };
  const fetchData = async () => {
    const response = await GetTagDetail(id);
    if (response.success) {
      setTag(response.data);
      if (isSort && sortType) {
        handleSortWork(sortType, response.data);
      }
    } else {
      Alert.alert("Error when get tag detail!", response.message);
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
    numberOfPomodoros,
    tags
  ) => {
    console.log(projectId,
      priority,
      dueDate,
      numberOfPomodoros,
      tags)
    setModalVisible(false);
    Keyboard.dismiss();
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const settings = await AsyncStorage.getItem("Settings");
    let time = 25;
    if (settings) {
      const parsedData = JSON.parse(settings);
      time = parsedData.pomodoroTime;
    }
    if (workName) {
      const tagslist = tags?.map((item) => ({ id: item }));
      const response = await CreateWork(
        id,
        projectId ? projectId : null,
        tagslist,
        workName,
        priority,
        dueDate,
        numberOfPomodoros,
        time,
      );
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

  const handleReload = async () => {
    await fetchData();
  };

  const renderKey = (key) => {
    if (typeof key === "number" && key.toString().length === 13) {
      return new Date(key).toISOString().split("T")[0];
    } else {
      return key;
    }
  };

  return (

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.container}>
          {tag && (
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back-outline" size={24} color="gray" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "400" }}>
                  {tag.tagName}
                </Text>
                <TouchableOpacity onPress={() => setSortModalVisible(true)}>
                  <AntDesign name="filter" size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <View style={styles.body}>
                <View style={styles.detail}>
                  <HeaderDetail
                    totalTimeWork={tag.totalTimeWork}
                    totalWorkActive={tag.totalWorkActive}
                    totalTimePassed={tag.totalTimePassed}
                    totalWorkCompleted={tag.totalWorkCompleted}
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
                {isSort ? (tag.workActive?.map((workItem) => (
                  <View key={workItem?.key}>
                    <Text>{renderKey(workItem?.key)}</Text>
                    {workItem?.worksSorted?.map((item) => (
                      <WorkActive
                    key={item.id}
                    workItem={item}
                    reload={handleReload}
                    navigation={navigation}
                  />
                    ))}
                    </View>
                ))): (tag.listWorkActive?.map((workItem) => (
                  <WorkActive
                    key={workItem.id}
                    workItem={workItem}
                    reload={handleReload}
                    navigation={navigation}
                  />
                )))}
                {tag.listWorkCompleted.length === 0  && (
                <View
                  style={{
                    height: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 24, fontWeight: 700, color: "gray" }}
                  >
                    No Work Active
                  </Text>
                </View>
              )}
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
                  (isSort ? (tag.workCompleted?.map((workItem) => (
                    <View key={workItem?.key}>
                      <Text>{renderKey(workItem?.key)}</Text>
                      {workItem?.worksSorted?.map((item) => (
                        <WorkDone
                        key={item.id}
                        workItem={item}
                        reload={handleReload}
                        navigation={navigation}
                      />
                      ))}
                      </View>
                  ))) : (tag.listWorkCompleted?.map((workItem) => (
                    <WorkDone
                      key={workItem.id}
                      workItem={workItem}
                      reload={handleReload}
                      navigation={navigation}
                    />
                  ))))}
                  {tag.listWorkCompleted.length === 0 && doneVisible && (
                <View
                  style={{
                    height: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 24, fontWeight: 700, color: "gray" }}
                  >
                    No Work Completed
                  </Text>
                </View>
              )}
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
            tagId={id}
          />
        )}
        {sortModalVisible && (
          <SortWorkModal
            isVisible={sortModalVisible}
            page={""}
            onChoose={(type) => {
              handleSortWork(type, tag);
            }}
            onClose={() => setSortModalVisible(false)}
            type={sortType}
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

export default TagDetail;
