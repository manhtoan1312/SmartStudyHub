import { useEffect, useState } from "react";
import {
  GetDetailProject,
  GetProjectByStatus,
} from "../../services/Guest/ProjectService";
import getRole from "../../services/RoleService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchByWorkName } from "../../services/Guest/WorkService";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { flex } from "react-native-wind/dist/styles/flex/flex";

const CreatePomodoro = ({ route, navigation }) => {
  const [projectList, setProjectList] = useState([]);
  const [workList, setWorkList] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    id: route.params.work.projectId,
    projectName: route.params.work.projectName,
  });
  const [selectedWork, setSelectedWork] = useState(route.params.work);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [pomodoroTime, setPomodoroTime] = useState(
    route.params.work.timeOfPomodoro
  );
  const fetchData = async () => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const response = await GetProjectByStatus(id, "ACTIVE");
    if (response.success) {
      setProjectList(response.data);
    }
  };

  useEffect(() => {
    fetchWork = async () => {
      const role = await getRole();
      let id;
      if (role) {
        id = role.id;
      } else {
        id = await AsyncStorage.getItem("id");
      }
      let response;
      if (selectedProject === "") {
        response = await SearchByWorkName(id, "");
      } else {
        response = await GetDetailProject(selectedProject.id);
      }
      if (response.success) {
        setWorkList(response.data);
      }
    };
  }, [selectedProject]);
  useEffect(() => {
    fetchData();
  }, []);

  function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  }

  const handleWork = () => {
    setSelectedWork(null);
  };
  const handleProject = () => {
    setSelectedProject(null);
    setSelectedWork(null);
  };
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#454545" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Create New Pomodoro</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.title}>Done</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <TouchableOpacity style={styles.rowOption}>
          <Text style={{ fontSize: 16 }}>Project Name</Text>
          <TouchableOpacity style={styles.select} onPress={handleProject}>
            <Text style={styles.name}>
              {selectedProject ? selectedProject.projectName : "None"}
            </Text>
            {selectedProject ? (
              <AntDesign
                style={{ paddingLeft: 10 }}
                name="closecircle"
                size={20}
                color="#888888"
              />
            ) : (
              <MaterialIcons name="navigate-next" size={20} color="#888888" />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowOption}>
          <Text style={{ fontSize: 16 }}>Work Name</Text>
          <TouchableOpacity style={styles.select} onPress={handleWork}>
            <Text style={styles.name}>
              {selectedWork ? selectedWork.workName : "None"}
            </Text>
            {selectedWork ? (
              <AntDesign
                style={{ paddingLeft: 10 }}
                name="closecircle"
                size={20}
                color="#888888"
              />
            ) : (
              <MaterialIcons name="navigate-next" size={20} color="#888888" />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowOption}>
          <Text style={{ fontSize: 16 }}>Start Time</Text>
          <TouchableOpacity style={styles.select}>
            <Text style={styles.name}>
              {formatDateTime(new Date(startTime))}
            </Text>
            <MaterialIcons name="navigate-next" size={20} color="#888888" />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowOption}>
          <Text style={{ fontSize: 16 }}>Pomodoro Time</Text>
          <TouchableOpacity style={styles.select}>
            <Text style={styles.name}>{pomodoroTime} Minute</Text>
            <MaterialIcons name="navigate-next" size={20} color="#888888" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#454545",
  },
  body: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  rowOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  name: {
    color: "#888888",
    fontSize: 16,
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CreatePomodoro;
