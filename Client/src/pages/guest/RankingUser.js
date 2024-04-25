import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableHighlight,
} from "react-native";
import { RankByFocusAllTime, RankByMonth } from "../../services/GuestService";
import RankingBody from "../../components/RankingBody";
import { MaterialIcons } from "@expo/vector-icons";
import RankingUserItem from "../../components/RankingUserItem";

function RankingUser({ navigation }) {
  const [mode, setMode] = useState(1);
  const [list30Days, setList30Days] = useState([]);
  const [listAll, setListAll] = useState([]);
  const [allPage, setAllPage] = useState(0);
  const [page30, setPage30] = useState(0);
  const [pageSize] = useState(10);
  const [allLength, setAllLength] = useState(0);
  const [length30, setLength30] = useState(0);

  const fetchData30Days = async () => {
    const response = await RankByMonth(page30, pageSize);
    if (response.success) {
      setList30Days(response.data);
      setLength30(response.data.totalUsers);   
      setPage30(prevPage => prevPage + 1);
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  const fetchDataAll = async () => {
    const response = await RankByFocusAllTime(allPage, pageSize);
    if (response.success) {
      setListAll(response.data);
      setAllLength(response.data.totalUsers);
      setAllPage(prevPage => prevPage + 1);
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  const fetchDataAllNext = async () => {
    if (pageSize * allPage >= allLength) {
    } else {
      const response = await RankByFocusAllTime(allPage, pageSize);
      if (response.success) {
        const updatedListAll = { ...listAll };
        updatedListAll.allUsers = [
          ...listAll.allUsers,
          ...response.data.allUsers,
        ];
        setListAll(updatedListAll);
        setAllPage(prevPage => prevPage + 1);
      } else {
        Alert.alert("Error!!", response.message);
      }
    }
  };

  const fetchData30Next = async () => {
    if (pageSize * page30 >= length30) {
      
    } else {
      const response = await RankByMonth(page30, pageSize);
      if (response.success) {
        const updatedList30 = { ...list30Days };
        updatedList30.allUsers = [
          ...list30Days.allUsers,
          ...response.data.allUsers,
        ];
        setList30Days(updatedList30);
        setPage30(prevPage => prevPage + 1);
      } else {
        Alert.alert("Error!!", response.message);
      }
    }
  };

  useEffect(() => {
    fetchData30Days();
    fetchDataAll();
  }, []);

  const loadMoreData = async () => {
    if (mode === 2) {
      fetchDataAllNext();
    } else {
      fetchData30Next();
    }
  };
  return (
    <View style={{ backgroundColor: "#eeeeee", flex: 1, height: "100%" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Focus Time Rankings</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => setMode(1)}
          style={[styles.mode, mode === 1 && styles.modeSelected]}
        >
          <Text style={[styles.modeText, mode === 2 && { color: "gray" }]}>
            Last 30 days
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode(2)}
          style={[styles.mode, mode === 2 && styles.modeSelected]}
        >
          <Text style={[styles.modeText, mode === 1 && { color: "gray" }]}>
            All
          </Text>
        </TouchableOpacity>
      </View>
      {mode === 1 ? (
        <View>
          <RankingBody
            listUser={list30Days.allUsers}
            onEndList={loadMoreData}
          />
        </View>
      ) : (
        <RankingBody listUser={listAll.allUsers} onEndList={loadMoreData} />
      )}
      <View style={styles.user}>
        <RankingUserItem user={mode===1 ? list30Days.userCurrent : listAll.userCurrent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 18,
  },
  bar: {
    flexDirection: "row",
    color: "#F1EDED",
    backgroundColor: "white",
    paddingTop: 10,
  },
  modeSelected: {
    borderColor: "#FA6408",
    borderBottomWidth: 2,
    color: "black",
    height: 40,
  },
  modeText: {
    fontSize: 16,
  },
  mode: {
    width: "50%",
    alignItems: "center",
  },
  user: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FA6408",
  },
});

export default RankingUser;
