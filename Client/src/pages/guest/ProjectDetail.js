import { useEffect, useState } from "react";
import HeaderDetail from "../../components/HeaderDetail";
import { GetDetailProject } from "../../services/Guest/ProjectService";
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  FlatList,
  SectionList,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import WorkActive from "../../components/WorkActive";
const ProjectDetail = ({ route, navigation }) => {
  const id = route.params.id;
  const [project, setProject] = useState(null);
  const [listTag, setListTag] = useState(null);
  const [workName, setWorkName] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetDetailProject(id);
      if (response.success) {
        setProject(response.data);
      } else {
        Alert.alert("Error!", response.message);
        navigation.navigate("Home");
      }
    };
    fetchData();
  }, [id]);
  return (
    <ScrollView style={styles.container}>
      {project && (
        <>
          <View style={styles.header}>
            <Ionicons name="chevron-back-outline" size={24} color="gray" />
            <Text style={{ fontSize: 18, fontWeight: "400" }}>
              {project.projectName}
            </Text>
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
            <View style={styles.input}>
              <AntDesign name="plus" size={24} color="black" />
              <TextInput
                style={{ paddingLeft: 10 }}
                placeholder="Add a Work..."
                value={workName}
                onChangeText={(text) => setWorkName(text)}
              />
            </View>
            {project.listWorkActive?.map((workItem) => (
              <WorkActive key={workItem.id} workItem={workItem} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
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
});

export default ProjectDetail;
