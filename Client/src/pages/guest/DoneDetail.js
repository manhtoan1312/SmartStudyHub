import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetWorkCompleted } from "../../services/Guest/WorkService";
import { useEffect, useState } from "react";
import { GetPomodoro } from "../../services/Guest/PomodoroService";
import { GetProjectByStatus } from "../../services/Guest/ProjectService";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { AntDesign, FontAwesome5, MaterialIcons, Octicons } from "@expo/vector-icons";
import WorkCompleted from "../../components/WorkCompleted";
import ImageFocus from "../../components/Image_Focus";
import PomodoroCompleted from "../../components/PomodoroCompleted";
import ProjectDone from "../../components/ProjectDone";
import { useIsFocused } from "@react-navigation/native";

const DoneDetail = ({ navigation }) => {
  const [listwork, setListWork] = useState();
  const [listPomodoro, setListPomodoro] = useState();
  const [listProject, setListProject] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Work");
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
    const id = await AsyncStorage.getItem("id");
    const response = await GetWorkCompleted(id);
    if (response.success) {
      setListWork(response.data);
    } else {
      console.log("loi work: ", response.message);
    }
  };
  const fetchPomodoro = async () => {
    const id = await AsyncStorage.getItem("id");
    const Po = await GetPomodoro(id);
    if (Po.success) {
      translatePomodoro(Po.data);
    } else {
      console.log("loi po: ", Po.message);
    }
  };
  const fetchProject = async () => {
    const id = await AsyncStorage.getItem("id");
    const Project = await GetProjectByStatus(id, "COMPLETED");
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
        <TouchableOpacity onPress={toggleModal}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Modal for category options */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <TouchableOpacity style={styles.modal}>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Work")}
          >
            <FontAwesome5 name="tasks" style={styles.icon} size={18} color="black" />
            <Text style={styles.modalText}>Work</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Pomodoro")}
          >
            <AntDesign name="clockcircleo" style={styles.icon} size={18} color="black" />
            <Text style={styles.modalText}>Pomodoro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => handleCategorySelect("Project")}
          >
            <Octicons name="project" style={styles.icon} size={18} color="black" />
            <Text style={styles.modalText}>Project</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => toggleModal()}
          >
            <Text style={[styles.modalText, {paddingLeft:30}]}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Content based on selected category */}
      {selectedCategory === "Work" && (
        <ScrollView>
          {listwork?.map((item) => (
            <WorkCompleted
              key={item.id}
              workItem={item}
              reload={fetchData}
              navigation={navigation}
            />
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
            <ProjectDone
              key={index}
              projectItem={item}
              reload={fetchData}
              navigation={navigation}
            />
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
    flexDirection:'row'
  },
  modalText: {
    fontSize: 18,
  },
  icon:{
    paddingRight:15
  }
});

export default DoneDetail;
