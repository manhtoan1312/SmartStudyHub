import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  AntDesign,
  EvilIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import { DeleteWork, MarkCompleted } from "../services/Guest/WorkService";
import { Audio } from "expo-av";
import {
  ExtraMarkCompleted,
  MarkDelete,
  RecoverExtraWork,
} from "../services/Guest/ExtraWork";
import { Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ExtraDeleted from "./ExtraDeleted";
import ExtraCompleted from "./ExtraCompleted";
import ExtraActive from "./ExtraActive";

const WorkactiveDL = ({ workItem, reload, navigation }) => {
  const [extraVisible, setExtraVisible] = useState(false);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../sound/Done.mp3")
    );
    await sound.playAsync();
  }

  const renderDay = () => {
    const dueDate = workItem.statusWork;
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let color = "gray";
    let dateStart = new Date(workItem.dueDate);
    dateStart.setDate(dateStart.getDate() - 1);
    let date = dateStart.toLocaleDateString("en-US", options);

    if (dueDate === "TODAY") {
      color = "green";
      date = "Today";
    } else if (dueDate === "TOMORROW") {
      color = "orange";
      date = "Tomorrow";
    } else if (dueDate === "OUTOFDATE") {
      color = "red";
    }

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="calendar-alt" size={14} color={color} />
        <Text style={{ color: color, paddingLeft: 5 }}>{date}</Text>
      </View>
    );
  };

  const CompletedWork = async () => {
    const response = await MarkCompleted(workItem.id);
    if (response.success) {
      playSound();
      reload();
    } else {
      Alert.alert("Mark complete work Error!", response.message);
    }
  };
  const CompletedExtraWork = async (id, status) => {
    if (status === "ACTIVE") {
      const response = await ExtraMarkCompleted(id);
      if (response.success) {
        playSound();
        reload();
      } else {
        Alert.alert("Mark complete work Error!", response.message);
      }
    } else {
      const response = await RecoverExtraWork(id);
      if (response.success) {
        reload();
      } else {
        Alert.alert("Recover Extrawork Error!", response.message);
      }
    }
  };
  const renderCirle = () => {
    let circleColor = "gray";
    if (workItem.priority === "HIGH") circleColor = "red";
    else if (workItem.priority === "NORMAL") circleColor = "yellow";
    else if (workItem.priority === "LOW") circleColor = "green";
    return (
      <TouchableOpacity
        onPress={() => CompletedWork()}
        style={[styles.circle, { borderColor: circleColor }]}
      />
    );
  };

  const hasExtraWorks = workItem.extraWorks && workItem.extraWorks.length > 0;

  const updateWork = () => {
    navigation.navigate("UpdateWork", { id: workItem.id });
  };
  const renderRightActionsForWork = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <TouchableOpacity
        style={styles.rightActions}
        onPress={() => handleDelete()}
      >
        <AntDesign name="delete" size={24} color="black" />
      </TouchableOpacity>
    );
  };
  const renderRightActionsForExtraWork = (itemId) => (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <TouchableOpacity
        style={styles.rightActions}
        onPress={() => handleDeleteExtraWork(itemId)}
      >
        <AntDesign name="delete" size={24} color="black" />
      </TouchableOpacity>
    );
  };

  const handleDeleteExtraWork = async (id) => {
    const response = await MarkDelete(id);
    if (response.success) {
      console.log(response.data);
      reload();
    } else {
      Alert.alert("Error when delele extra work", response.message);
    }
  };

  const handlePlay = async () => {
    try {
      await AsyncStorage.setItem("work", JSON.stringify(workItem));
      await AsyncStorage.setItem("workType", "WORK");
      await AsyncStorage.setItem("stop", "true");
      navigation.navigate("Focus");
    } catch (e) {
      Alert.alert("Error when save work", e);
    }
  };
  const playExtra = async (item) => {
    if (item.status === "ACTIVE") {
      try {
        await AsyncStorage.setItem("work", JSON.stringify(item));
        await AsyncStorage.setItem("workType", "EXTRA");
        await AsyncStorage.setItem("stop", "true");
        navigation.navigate("Focus");
      } catch (e) {
        Alert.alert("Error when save work", e);
      }
    }
  };
  const handleDelete = async () => {
    const response = await DeleteWork(workItem.id);
    if (response.success) {
      reload();
    } else {
      Alert("Error when delele work", response.message);
    }
  };
  return (
    <View>
      <Swipeable renderRightActions={renderRightActionsForWork}>
        <TouchableOpacity
          onPress={() => updateWork()}
          style={{ flexDirection: "column", marginVertical: 5 }}
        >
          <View style={styles.container}>
            {renderCirle()}
            <View style={styles.content}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <Text style={styles.workName}>{workItem.workName} </Text>
                {workItem.tags?.map((item, index) => (
                  <Text key={index} style={{ color: item.colorCode }}>
                    #{item.tagName}
                  </Text>
                ))}
              </View>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                {workItem.numberOfPomodoros !== 0 && (
                  <View style={styles.pomodoroContainer}>
                    <MaterialCommunityIcons
                      name="clock-check"
                      size={14}
                      color="#ff3232"
                    />
                    <Text style={styles.pomodoroText}>
                      {workItem.numberOfPomodorosDone}/
                    </Text>
                    <MaterialCommunityIcons
                      name="clock"
                      size={14}
                      color="#ff9999"
                    />
                    <Text style={[styles.pomodoroText, { marginRight: 5 }]}>
                      {workItem.numberOfPomodoros}
                    </Text>
                  </View>
                )}
                {workItem.statusWork !== "SOMEDAY" && renderDay()}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 5,
                  }}
                >
                  {hasExtraWorks && (
                    <>
                      <Ionicons
                        name="md-git-branch-outline"
                        style={{ transform: [{ rotate: "90deg" }] }}
                        size={14}
                        color="gray"
                      />
                      <Text
                        style={{ marginLeft: 5, fontSize: 12, color: "gray" }}
                      >
                        {`${
                          workItem.extraWorks.filter(
                            (extraWork) => extraWork.status === "COMPLETED"
                          ).length
                        }/${workItem.extraWorks.length}`}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => handlePlay()}
                style={styles.playButton}
              >
                <Ionicons
                  name="ios-play-circle-sharp"
                  size={26}
                  color="#ff3232"
                />
              </TouchableOpacity>
              {hasExtraWorks && (
                <TouchableWithoutFeedback
                  onPress={() => setExtraVisible(!extraVisible)}
                >
                  <AntDesign
                    name={extraVisible ? "up" : "down"}
                    size={20}
                    color="gray"
                    style={{ marginLeft: 5, paddingTop: 3 }}
                  />
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
      <View>
        {extraVisible && (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <View style={styles.extraContainer}>
              {workItem.extraWorks?.map((item) => (
                <View key={item.id}>
                {item.status === "ACTIVE" && (
                  <ExtraActive extra={item} reload={reload} navigation={navigation} />
                )}
                {item.status === "COMPLETED" && (
                  <ExtraCompleted
                    extra={item}
                    reload={reload}
                    navigation={navigation}
                  />
                )}
              </View>
              ))}
              {workItem?.extraWorksDeleted?.map((item) => (
                <View key={item}>
                  <ExtraDeleted extra={item} reload={reload} />
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    height: 55,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: "#ff3232",
    borderWidth: 2,
    marginRight: 5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  workName: {
    fontSize: 14,
    fontWeight: "400",
  },
  pomodoroContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pomodoroText: {
    marginLeft: 2,
    fontSize: 12,
  },
  playButton: {
    marginLeft: 10,
  },

  extraContainer: {
    marginLeft: 20,
    borderLeftColor: "lightgray",
    borderLeftWidth: 2,
    marginVertical: 10,
  },
  extraWorkItem: {
    paddingLeft: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginRight: 10,
  },
  rightActions: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WorkactiveDL;
