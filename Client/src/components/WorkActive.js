import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";
import { useState } from "react";
const WorkActive = ({ workItem }) => {
  const [extraVisible, setExtraVisible] = useState(false);
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../sound/DefaultBell.mp3")
    );
    await sound.playAsync();
  }

  const renderDay = () => {
    const currentDate = new Date();
    const dueDate = new Date(workItem.dueDate);
    const options = { weekday: "short", month: "numeric", day: "numeric" };
    let color = "gray";
    let date = dueDate.toLocaleDateString("en-US", options);

    if (dueDate.toDateString() === currentDate.toDateString()) {
      color = "green";
      date = "Today";
    } else if (dueDate > currentDate) {
      if (dueDate.getDate() === currentDate.getDate() + 1) {
        color = "orange";
        date = "Tomorrow";
      }
    } else {
      color = "red";
    }

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="calendar-alt" size={14} color={color} />
        <Text style={{ color: color, paddingLeft: 5 }}>{date}</Text>
      </View>
    );
  };

  const renderCirle = () => {
    let circleColor = "gray";
    if (workItem.priority === "HIGHT") circleColor = "red";
    else if (workItem.priority === "MEDIUM") circleColor = "yellow";
    else if (workItem.priority === "LOW") circleColor = "green";
    return <View style={[styles.circle, { borderColor: circleColor }]} />;
  };

  const hasExtraWorks = workItem.extraWorks && workItem.extraWorks.length > 0;

  return (
    <TouchableOpacity style={{ flexDirection: "column", marginVertical: 5 }}>
      <View style={styles.container}>
        {renderCirle()}
        <View style={styles.content}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.workName}>{workItem.workName} </Text>
            {workItem.tags?.map((item, index) => (
              <Text key={index} style={{ color: item.colorCode }}>
                #{item.tagName}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
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
                  <Text style={{ marginLeft: 5, fontSize: 12, color: "gray" }}>
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
          style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
        >
          <TouchableOpacity onPress={playSound} style={styles.playButton}>
            <Ionicons name="ios-play-circle-sharp" size={26} color="#ff3232" />
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
      {extraVisible && (
        <View
          style={{ backgroundColor: "white", borderRadius: 10, marginTop: 10 }}
        >
          <View style={styles.extraContainer}>
            {workItem.extraWorks.map((item) => (
              <View style={styles.extraWorkItem} key={item.id}>
                <View style={{ flexDirection: "row" }}>
                  {item.status === "ACTIVE" ? (
                    <View style={[styles.circle, { borderColor: "gray" }]} />
                  ) : (
                    <AntDesign name="checkcircle" size={20} color="green" />
                  )}
                  <View style={{ alignItems:'center'}}>
                    <Text>{item.extraWorkName}</Text>
                    {item.numberOfPomodoros > 0 && (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {[...Array(item.numberOfPomodoros)].map((_, index) => (
                          <MaterialCommunityIcons
                            key={index}
                            name="clock"
                            size={14}
                            color="#ff9999"
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={playSound} style={styles.playButton}>
                  <Ionicons
                    name="ios-play-circle-sharp"
                    size={26}
                    color="#ff3232"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
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
    marginRight: 15,
  },
  content: {
    flex: 1,
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
});

export default WorkActive;
