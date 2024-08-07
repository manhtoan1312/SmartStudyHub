import { useEffect, useState } from "react";
import { getInforGuest } from "../../services/Guest/getDataService";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
  Modal,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import PomodoroHeader from "../../components/PomodoroHeader";
import WorkStatisticalHeader from "../../components/WorkStatisticalHeader";
import ModalReportUser from "../../components/ModalReportUser";
import ReportUserSubmit from "../../components/ReportUserSubmit";
import { CreateReport } from "../../services/Guest/ReportService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../../services/RoleService";

const ViewPersonalUser = ({ route, navigation }) => {
  const { id } = route.params;
  const [infor, setInfo] = useState({});
  const [reportVisible, setReportVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [title, setTitle] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    const response = await getInforGuest(id);
    if (response.success) {
      setInfo(response.data);
    } else {
      console.log("Error:", response.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePressReport = () => {
    setReportVisible(true);
  };

  const handleSubmitTitle = (text) => {
    setReportVisible(false);
    setSubmitVisible(true);
    setTitle(text);
  };

  const handleSubmitReport = async (desc) => {
    setSubmitVisible(false);
    let userId = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      userId = role.id;
    }
    const response = await CreateReport(userId, {
      userWasReportedId: id,
      title: title,
      descriptionDetail: desc,
      typeReport: "REPORTUSER",
    });
    if (response.success) {
      Alert.alert("Send Report successfully!");
    } else {
      Alert.alert("Send Report fail!", response.message);
    }
  };

  const handleAvatarPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.dateText}>User Information</Text>
        <Pressable onPress={handlePressReport}>
          <Text style={{ color: "red" }}>Report</Text>
        </Pressable>
      </View>
      {infor?.coverImage ? (
        <Image
          resizeMode="cover"
          style={styles.coverImage}
          source={{ uri: infor?.coverImage }}
        />
      ) : (
        <View style={styles.image}>
          <Text style={{ color: "#333", fontWeight: "500", fontSize: 18 }}>
            No Cover Image
          </Text>
        </View>
      )}
      <View style={styles.avtContainter}>
        <Pressable style={styles.avtBorder} onPress={handleAvatarPress}>
          <Image
            style={styles.avt}
            resizeMode="cover"
            source={{ uri: infor?.imageUrl }}
          />
        </Pressable>
        <Text>
          {infor?.firstName} {infor?.lastName}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PomodoroHeader id={id} />
        <WorkStatisticalHeader id={id} />
        {infor?.role !== "GUEST" && (
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoRow}>
              <Entypo name="email" size={20} color="black" />
              <Text style={styles.userInfoText}>{infor?.email}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Entypo name="phone" size={20} color="black" />
              <Text style={styles.userInfoText}>
                {infor?.phoneNumber ? infor?.phoneNumber : "None"}
              </Text>
            </View>
            <View style={styles.userInfoRow}>
              <Entypo name="calendar" size={20} color="black" />
              <Text style={styles.userInfoText}>
                {infor?.dateOfBirth
                  ? new Date(infor.dateOfBirth).toLocaleDateString()
                  : "None"}
              </Text>
            </View>
            <View style={styles.userInfoRow}>
              <Entypo name="location" size={20} color="black" />
              <Text style={styles.userInfoText}>
                {infor?.address ? infor?.address : "None"}
              </Text>
            </View>
            <View style={styles.userInfoRow}>
              <Entypo name="user" size={20} color="black" />
              <Text style={styles.userInfoText}>{infor?.role}</Text>
            </View>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Image
            style={styles.fullScreenImage}
            resizeMode="contain"
            source={{ uri: infor?.imageUrl }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ModalReportUser
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        id={id}
        onSubmit={handleSubmitTitle}
      />
      <ReportUserSubmit
        visible={submitVisible}
        onClose={() => setSubmitVisible(false)}
        title={title}
        onSubmit={handleSubmitReport}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 200,
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  avtContainter: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    marginBottom: 10,
  },
  avtBorder: {
    width: 90,
    height: 90,
    borderRadius: 50,
    padding: 2,
    borderColor: "orange",
    borderWidth: 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avt: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "90%",
    height: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "700",
  },
});

export default ViewPersonalUser;
