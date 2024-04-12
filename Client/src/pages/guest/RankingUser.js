import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, TouchableHighlight } from "react-native";
import { RankByFocusAllTime, RankByMonth } from "../../services/GuestService";
import RankingBody from "../../components/RankingBody";
import { MaterialIcons } from "@expo/vector-icons";
import RankingUserItem from "../../components/RankingUserItem";

function RankingUser({navigation}) {
  const [mode, setMode] = useState(1);
  const [list30Days, setList30Days] = useState([]);
  const [listAll, setListAll] = useState([]);

  const fetchData30Days = async () => {
    const response = await RankByMonth();
    if (response.success) {
      setList30Days(response.data);
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  const fetchDataAll = async () => {
    const response = await RankByFocusAllTime();
    if (response.success) {
      setListAll(response.data);
    } else {
      Alert.alert("Error!!", response.message);
    }
  };

  useEffect(() => {
    fetchData30Days();
    fetchDataAll();
  }, []);

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
          <Text style={[styles.modeText, mode === 2 && { color: 'gray' }]}>Last 30 days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode(2)}
          style={[styles.mode, mode === 2 && styles.modeSelected]}
        >
          <Text style={[styles.modeText, mode === 1 && { color: 'gray' }]}>All</Text>
        </TouchableOpacity>
      </View>
      <RankingBody listUser={mode === 1 ? list30Days.allUsers : listAll.allUsers} />
      <View style={styles.user}>
        <RankingUserItem user={mode === 1 ? list30Days.userCurrent : listAll.userCurrent}/>
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
    backgroundColor: 'white',
    paddingTop: 10,
  },
  modeSelected: {
    borderColor: "#FA6408",
    borderBottomWidth: 2,
    color: "black",
    height: 40
  },
  modeText: {
    fontSize: 16
  },
  mode: {
    width: '50%',
    alignItems: 'center',
  },
  user: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: "#FA6408",
  }
});

export default RankingUser;
