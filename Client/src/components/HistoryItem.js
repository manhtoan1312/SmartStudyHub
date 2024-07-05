import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import WorkCompleted from "./WorkCompleted";
import PomodoroCompleted from "./PomodoroCompleted";
import PomodoroCompletedHistory from "./PomodoroCompletedHistory";
import { Swipeable } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { deleteHistory } from "../services/Guest/HistoryDailyService";

const HistoryItem = ({ item, reload, navigation }) => {
  const renderDay = (day) => {
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let dateStart = new Date(day);
    let date = dateStart.toLocaleDateString("en-US", options);

    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", paddingBottom: 5 }}
      >
        <Text style={{ color: "black", fontSize: 20 }}>{date}</Text>
      </View>
    );
  };
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <Pressable style={styles.rightActions} onPress={() => handleDelete()}>
        <AntDesign name="delete" size={24} color="black" />
      </Pressable>
    );
  };
  const handleDelete = () => {
    Alert.alert(
      "Confirm action",
      "All data related to this item will be deleted, are you sure you want to delete it?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => confirmDelete() },
      ]
    );
  };
  const confirmDelete = async () => {
    const response = await deleteHistory(item.id);
    if (response.success) {
      reload();
    } else {
      Alert.alert("Error!", response.message);
    }
  };
  return (
    <View>
      <Swipeable renderRightActions={renderRightActions}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            paddingLeft: 10,
            paddingTop: 10,
          }}
        >
          {renderDay(item.dates)}
          <View>
            <Text style={{ color: "gray" }}>
              Focus time: {item?.totalTimeFocus ? item?.totalTimeFocus : 0}{" "}
              Minute
            </Text>
            <View style={styles.time}>
              <Text style={{ color: "gray" }}>
                Work Completed:{" "}
                {item?.totalWorksDone ? item?.totalWorksDone : 0} work
              </Text>
              <Text style={{ color: "gray" }}>
                Pomodoro Completed:{" "}
                {item?.totalPomodorosDone ? item?.totalPomodorosDone : 0}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 5,
            }}
          ></View>
        </View>
      </Swipeable>
      {item?.works?.length > 0 && <Text>Works:</Text>}
      {item?.works &&
        item?.works.map((work, index) =>
          work?.id ? (
            <WorkCompleted
              key={work.id}
              workItem={work}
              reload={reload}
              navigation={navigation}
            />
          ) : (
            <View key={index} style={styles.container}>
              <Text style={styles.deletedItem}>{work.workName}</Text>
            </View>
          )
        )}
      {item?.pomodoros?.length > 0 && <Text>Pomodoros:</Text>}
      {item?.pomodoros &&
        item?.pomodoros.map((pomo, index) =>
          pomo?.id ? (
            <PomodoroCompletedHistory
              key={pomo.id}
              item={pomo}
              reload={reload}
            />
          ) : (
            <View key={index} style={styles.container}>
              <Text style={styles.deletedItem}>{pomo.pomodoroName}</Text>
            </View>
          )
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  time: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  rightActions: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    height: 55,
    marginVertical: 5,
  },
  deletedItem: {
    color: "red",
  },
});

export default HistoryItem;
