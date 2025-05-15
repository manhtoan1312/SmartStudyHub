import React, { useEffect, useState } from "react";
import { AntDesign, Entypo, FontAwesome6 } from "@expo/vector-icons";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import WorkActive from "../../components/WorkActive";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../../services/RoleService";
import {
  deleteAllHistory,
  getHistoryDaily,
} from "../../services/Guest/HistoryDailyService";
import HistoryItem from "../../components/HistoryItem";

const HistoryDaily = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isMore, setIsMore] = useState(true);
  const size = 2;

  const fetchData = async () => {
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
    let id = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      id = role.id;
    }
    const response = await getHistoryDaily(id, 0, size);
    if (response.success) {
      setData(response.data);
      setPage(1);
    } else {
      setIsMore(false);
    }
  };

  const onEndList = () => {
    if (isMore) {
      fetchData();
    }
  };

  useEffect(() => {
    if (isMore) {
      fetchData();
    }
  }, []);
  const handleDelete = () => {
    Alert.alert(
      "Confirm action",
      "All your's history activity will be delete, are you sure you want to delete it?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => confirmDelete() },
      ]
    );
  };
  const confirmDelete = async () => {
    let id = await AsyncStorage.getItem("id");
    const role = await getRole();
    if (role) {
      id = role.id;
    }
    const response = await deleteAllHistory(id);
    if (response.success) {
      setData([]);
      fetchDataNew();
    } else {
      Alert.alert("Error!", response.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.dateText}>History Daily</Text>
        <Pressable onPress={() => handleDelete()}>
          <FontAwesome6 name="trash" size={24} color="black" />
        </Pressable>
      </View>
      <View style={{ paddingTop: 20 }}>
        {data.length > 0 ? (
          <FlatList
            contentContainerStyle={styles.list}
            data={data}
            renderItem={({ item }) => (
              <HistoryItem
                item={item}
                reload={fetchDataNew}
                navigation={navigation}
              />
            )}
            ListFooterComponent={<View style={{ height: 100 }} />}
            onEndReached={onEndList}
            onEndReachedThreshold={0.3}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View
            style={{
              height: 100,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 200,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 700, color: "gray" }}>
              You Do Not Have Any History In App
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 500, color: "gray" }}>
              Let's do something
            </Text>
          </View>
        )}
      </View>
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
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  list: {
    paddingHorizontal: 16,
  },
  textBody: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 700,
  },
});

export default HistoryDaily;
