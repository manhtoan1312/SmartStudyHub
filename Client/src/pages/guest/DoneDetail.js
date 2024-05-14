import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetWorkCompleted } from "../../services/Guest/WorkService";
import { useEffect, useState } from "react";
import { GetPomodoro } from "../../services/Guest/PomodoroService";
import {
  GetProjectByStatus,
  GetProjectCompletedNewVision,
} from "../../services/Guest/ProjectService";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import WorkCompleted from "../../components/WorkCompleted";
import ImageFocus from "../../components/Image_Focus";
import PomodoroCompleted from "../../components/PomodoroCompleted";
import ProjectDone from "../../components/ProjectDone";
import { useIsFocused } from "@react-navigation/native";
import getRole from "../../services/RoleService";

const DoneDetail = ({ navigation }) => {
  const [listwork, setListWork] = useState();
  const [listPomodoro, setListPomodoro] = useState();
  const [listProject, setListProject] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Pomodoro");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);
  const fetchData = async () => {
    fetchWork();
    fetchPomodoro();
    fetchProject();
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchWork = async () => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const response = await GetWorkCompleted(id);
    if (response.success) {
      setListWork(response.data);
    } else {
      console.log("loi work: ", response.message);
    }
  };
  const fetchPomodoro = async () => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const Po = await GetPomodoro(id);
    if (Po.success) {
      translatePomodoro(Po.data);
    } else {
      console.log("loi po: ", Po.message);
    }
  };
  const fetchProject = async () => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const Project = await GetProjectCompletedNewVision(id);
    if (Project.success) {
      setListProject(Project.data);
    } else {
      console.log("loi project: ", Project.message);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    toggleModal();
  };
  const handleCreatePomodoro = () => {
    navigation.navigate("CreatePomodoro", {
      work: {
        id: -1,
        projectId: -1,
        workName: "None",
        projectName: "None",
      },
    });
  };
  const translatePomodoro = (listPo) => {
    if (listPo) {
      const dateArray = [];

      listPo.forEach((item) => {
        const date = item.date;
        const existingItem = dateArray.find((el) => isSameDay(el.date, date));

        if (existingItem) {
          existingItem.pomodoros.push(...item.pomodoros);
          existingItem.timeFocus += item.timeFocus;
          existingItem.totalWorkCompleted += item.totalWorkCompleted;
        } else {
          const newItem = {
            date: date,
            pomodoros: item.pomodoros,
            timeFocus: item.timeFocus,
            totalWorkCompleted: item.totalWorkCompleted,
          };
          dateArray.push(newItem);
        }
      });

      setListPomodoro(dateArray);
    }
  };

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

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        {/* Category */}
        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.categoryText}>{selectedCategory}</Text>
        </TouchableOpacity>

        {/* Three dots button */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={handleCreatePomodoro}
            style={{ marginRight: 10 }}
          >
            <MaterialCommunityIcons
              name="clock-edit-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModal}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for category options */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <TouchableOpacity style={styles.modal}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Pomodoro")}
          >
            <AntDesign
              name="clockcircleo"
              style={styles.icon}
              size={18}
              color="black"
            />
            <Text style={styles.modalText}>Pomodoro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Work")}
          >
            <FontAwesome style={styles.icon} name="tasks" size={24} color="black" />
            <Text style={styles.modalText}>Work</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Project")}
          >
            <Octicons
              name="project"
              style={styles.icon}
              size={18}
              color="black"
            />
            <Text style={styles.modalText}>Project</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => toggleModal()}
          >
            <Text style={[styles.modalText, { paddingLeft: 30 }]}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Content based on selected category */}
      {selectedCategory === "Work" && (
        <ScrollView>
          {listwork?.map((item) => (
            <View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  paddingLeft: 10,
                  paddingTop: 10,
                }}
              >
                {renderDay(item.date)}
                <View style={styles.time}>
                  <Text style={{ color: "gray" }}>
                    Focus time: {item?.timeFocus} Minute
                  </Text>
                  <Text style={{ color: "gray" }}>
                    Work Completed: {item.totalWorkCompleted}{" "}
                    {item.totalWorkCompleted > 1 ? "Missions" : "Mission"}
                  </Text>
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
              {item?.works.map((work) => (
                <WorkCompleted
                  key={work.id}
                  workItem={work}
                  reload={fetchData}
                  navigation={navigation}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {selectedCategory === "Pomodoro" && (
        <ScrollView>
          {listPomodoro?.map((item, index) => (
            <PomodoroCompleted
              key={index}
              pomoItem={item}
              reload={fetchData}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      )}

      {selectedCategory === "Project" && (
        <ScrollView>
          {listProject?.map((item, index) => (
            <View key={index}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  paddingLeft: 10,
                  paddingTop: 10,
                }}
              >
                {renderDay(item.date)}
                <View >
                  <Text style={{ color: "gray" }}>
                    Time work: {item?.timeFocus} Minute
                  </Text>
                  <View style={styles.time}>
                    <Text style={{ color: "gray" }}>
                      Work Completed: {item.totalWorkCompleted}
                      {item.totalWorkCompleted > 1 ? "Missions" : "Mission"}
                    </Text>
                    <Text style={{ color: "gray" }}>
                      Project Completed: {item.totalProjectCompleted}
                      {item.totalProjectCompleted > 1 ? "Projects" : "Project"}
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
              {item?.projects?.map((project, pIndex) => (
                <ProjectDone
                  key={pIndex}
                  projectItem={project}
                  reload={fetchData}
                  navigation={navigation}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <ImageFocus />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  categoryText: {
    color: "black",
    fontSize: 18,
    fontWeight: 600,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalItem: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    flexDirection: "row",
  },
  modalText: {
    fontSize: 18,
  },
  icon: {
    paddingRight: 15,
  },
  time: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
});

export default DoneDetail;
