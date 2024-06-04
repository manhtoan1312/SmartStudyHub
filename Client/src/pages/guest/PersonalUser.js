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
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import PomodoroHeader from "../../components/PomodoroHeader";
import WorkStatisticalHeader from "../../components/WorkStatisticalHeader";
import { getHistoryDaily } from "../../services/Guest/HistoryDailyService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../../services/RoleService";
import HistoryItem from "../../components/HistoryItem";
import { useIsFocused } from "@react-navigation/native";

const PersonalUser = ({ route, navigation }) => {
  const [id, setId] = useState(1);
  const [infor, setInfo] = useState({});
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isMore, setIsMore] = useState(true);
  const size = 2;
  const isFocused = useIsFocused();
  const fetchDataHistory = async () => {
    let id = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      id = role.id;
    }
    const response = await getHistoryDaily(id, page, size);
    if (response.success) {
      const updatedList = [...data, ...response.data];
      setData(updatedList);
      setPage((prevPage) => prevPage + 1);
    } else {
      setIsMore(false);
    }
  };

  const fetchDataNew = async () => {
    const response = await getHistoryDaily(id, 0, size);
    if (response.success) {
      setData(response.data);
      setPage(1);
    } else {
      setIsMore(false);
    }
  };

  const fetchData = async () => {
    let idUser = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      idUser = role.id;
    }
    setId(idUser);
    const response = await getInforGuest(idUser);
    if (response.success) {
      setInfo(response.data);
    } else {
      console.log("Error:", response.message);
    }
  };

  useEffect(() => {
    fetchData();
    if (isMore) {
      fetchDataHistory();
    }
  }, []);
  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);
  const handlePressMore = () => {
    navigation.navigate("Infor");
  };
  const handleClickAvt = () => {
    if (infor.role !== "GUEST") {
      navigation.navigate("Infor");
    } else {
      navigation.navigate("Login");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.dateText}>User Information</Text>
        <Pressable onPress={handlePressMore}>
          {infor.role !== "GUEST" ? (
            <AntDesign name="right" size={24} color="black" />
          ) : (
            <></>
          )}
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
        <Pressable onPress={() => handleClickAvt()} style={styles.avtBorder}>
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
        <PomodoroHeader />
        <WorkStatisticalHeader />
        <View>
          {data.length > 0 ? (
            data.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                reload={fetchDataNew}
                navigation={navigation}
              />
            ))
          ) : (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>
                You Do Not Have Any History In App
              </Text>
              <Text style={styles.noDataSubText}>Let's do something</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Shadow for iOS
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
    marginBottom:10
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
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  noData: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: "700",
    color: "gray",
  },
  noDataSubText: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
  },
});

export default PersonalUser;
