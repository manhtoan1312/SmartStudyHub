import { useEffect, useState } from "react";
import {
  GetDetailProject,
  GetProjectByStatus,
} from "../../services/Guest/ProjectService";
import getRole from "../../services/RoleService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GetWorkByProjectAndStatus,
} from "../../services/Guest/WorkService";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Touchable,
  Alert,SafeAreaView
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import DateTimePicker from "../../components/DateTimePicker";
import PomodoroPickerModal from "../../components/PomodoroPickerModal";
import ChooseProjectModal from "../../components/ChooseProjectModal";
import ChooseWorkModal from "../../components/ChooseWorkModal";
import { CreatePomodoro as addPomodoro } from "../../services/Guest/PomodoroService";
const CreatePomodoro = ({ route, navigation }) => {
  const [projectList, setProjectList] = useState([]);
  const [workList, setWorkList] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    id: route.params.work?.projectId ? route.params.work?.projectId : 0,
    projectName: route.params.work?.projectName
      ? route.params.work?.projectName
      : "Task Default",
  });
  const [selectedWork, setSelectedWork] = useState(route.params.work);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [pomodoroTime, setPomodoroTime] = useState(
    route.params.work?.timeOfPomodoro ? route.params.work?.timeOfPomodoro : 25
  );
  const [isProjectVisible, setProjectVisible] = useState(false);
  const [isWorkVisible, setWorkVisible] = useState(false);
  const [isStartTimeVisible, setStartTimeVisible] = useState(false);
  const [isPomodoroVisible, setPomodoroVisible] = useState(false);
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

  fetchWork = async () => {
    if (selectedProject?.id !== -1) {
      const role = await getRole();
      let id;
      if (role) {
        id = role.id;
      } else {
        id = await AsyncStorage.getItem("id");
      }
      if (selectedProject?.id === 0) {
        const response = await GetWorkByProjectAndStatus("ACTIVE", id);
        const response2 = await GetWorkByProjectAndStatus("COMPLETED", id);
        if (response.success && response2.success) {
          setWorkList({
            active: response.data,
            completed: response2.data,
          });
        }
      } else {
        const response = await GetDetailProject(selectedProject?.id);
        if (response.success) {
          setWorkList({
            active: response.data.listWorkActive,
            completed: response.data.listWorkCompleted,
          });
        }
      }
    }
  };
  useEffect(() => {
    fetchWork();
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
    setSelectedWork({ id: -1, workName: "None" });
  };
  const handleProject = () => {
    setSelectedProject({ id: -1, projectName: "None" });
    setSelectedWork({ id: -1, workName: "None" });
  };

  const handleClickProject = () => {
    setProjectVisible(!isProjectVisible);
    setWorkVisible(false);
    setStartTimeVisible(false);
    setPomodoroVisible(false);
  };
  const handleClickWork = () => {
    if (selectedProject?.id !== -1) {
      setProjectVisible(false);
      setWorkVisible(!isWorkVisible);
      setStartTimeVisible(false);
      setPomodoroVisible(false);
    }
  };
  const handleClickStartTime = () => {
    setProjectVisible(false);
    setWorkVisible(false);
    setStartTimeVisible(!isStartTimeVisible);
    setPomodoroVisible(false);
  };
  const handleClickPomodoro = () => {
    setProjectVisible(false);
    setWorkVisible(false);
    setStartTimeVisible(false);
    setPomodoroVisible(true);
  };

  const handleSelectTime = (time) => {
    setStartTime(time);
  };
  const handleSelectPomodoro = (value) => {
    setPomodoroTime(value);
  };
  const handleSelectProject = (value) => {
    setProjectVisible(false);
    setSelectedProject(value);
  };

  const handleSelectWork = (value) => {
    setSelectedWork(value);
    setWorkVisible(false);
  };

  const handleDone = async () => {
    if (!(selectedProject?.id !== -1 &&
      selectedWork?.id === -1)) {
      const role = await getRole();
      let id;
      if (role) {
        id = role.id;
      } else {
        id = await AsyncStorage.getItem("id");
      }
      const wId = selectedWork?.id ===-1 ? null : selectedWork?.id
      const endTime = startTime + pomodoroTime*60000;
   const response = await addPomodoro(id, wId,null,pomodoroTime, startTime, endTime)
   if(response.success) {
    navigation.goBack()
   }
   else{
    Alert.alert("Error when create new pomodoro", response.message)
   }
    }
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
        <TouchableOpacity onPress={handleDone}>
          <Text
            style={[
              styles.title,
              selectedProject?.id !== -1 &&
                selectedWork?.id === -1 &&
                styles.grayText,
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <TouchableOpacity style={styles.rowOption} onPress={handleClickProject}>
          <Text style={{ fontSize: 16 }}>Project Name</Text>
          <TouchableOpacity style={styles.select} onPress={handleProject}>
            <Text style={styles.name}>{selectedProject.projectName}</Text>
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
        <TouchableOpacity style={styles.rowOption} onPress={handleClickWork}>
          <Text
            style={{
              fontSize: 16,
              color: selectedProject?.id !== -1 ? "black" : "#888888",
            }}
          >
            Work Name
          </Text>
          <TouchableOpacity style={styles.select} onPress={handleWork}>
            <Text style={styles.name}>{selectedWork?.workName}</Text>
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
        <TouchableOpacity
          style={styles.rowOption}
          onPress={handleClickStartTime}
        >
          <Text style={{ fontSize: 16 }}>Start Time</Text>
          <View style={styles.select}>
            <Text style={styles.name}>
              {formatDateTime(new Date(startTime))}
            </Text>
            <MaterialIcons name="navigate-next" size={20} color="#888888" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowOption}
          onPress={handleClickPomodoro}
        >
          <Text style={{ fontSize: 16 }}>Pomodoro Time</Text>
          <View style={styles.select}>
            <Text style={styles.name}>{pomodoroTime} Minute</Text>
            <MaterialIcons name="navigate-next" size={20} color="#888888" />
          </View>
        </TouchableOpacity>
      </View>
      <ChooseWorkModal
        visible={isWorkVisible}
        selectedWork={selectedWork}
        onSelect={handleSelectWork}
        workList={workList}
        onClose={() => setWorkVisible(false)}
      />
      <ChooseProjectModal
        visible={isProjectVisible}
        selectedProject={selectedProject}
        onSelect={handleSelectProject}
        projectList={projectList}
        onClose={() => setProjectVisible(false)}
      />
      <DateTimePicker
        onSelectTime={handleSelectTime}
        visible={isStartTimeVisible}
        onClose={() => setStartTimeVisible(false)}
        defaultTime={new Date(startTime)}
      />
      <PomodoroPickerModal
        visible={isPomodoroVisible}
        selectedValue={pomodoroTime}
        onClose={() => setPomodoroVisible(false)}
        onSelect={handleSelectPomodoro}
      />
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
  grayText: {
    color: "#888888",
  },
});

export default CreatePomodoro;
