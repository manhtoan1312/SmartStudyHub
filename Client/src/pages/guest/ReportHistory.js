import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { GetReportList } from "../../services/Guest/ReportService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getRole from "../../services/RoleService";

const ReportHistory = ({ navigation }) => {
  const [page, setPage] = useState(0);
  const size = 10;
  const [reportList, setReportList] = useState();
  const [isMoreData, setIsMoreData] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      let id = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        id = role.id;
      }
      const response = await GetReportList(id, page, size);
      if (response.success) {
        if (response.data) {
          setReportList(response.data);
          setPage((pre) => pre + 1);
        } else {
          setIsMoreData(false);
        }
      } else {
        Alert.alert("Error when fetch Report list", response.message);
      }
    };
    fetchData();
  }, []);

  const renderIcon = (item) => {
    if (item.typeReport === "REPORTUSER") {
      return (
        <Image
          style={{ width: 50, height: 50, resizeMode: "cover" }}
          source={require("../../images/reportUser.png")}
          resizeMode="cover"
        ></Image>
      );
    }
    if (item.typeReport === "REPORTPROBLEM") {
      return (
        <Image
          style={{ width: 50, height: 50, resizeMode: "cover" }}
          source={require("../../images/problem.png")}
          resizeMode="cover"
        ></Image>
      );
    }
    if (item.typeReport === "HELP") {
      return (
        <Image
          style={{ width: 50, height: 50, resizeMode: "cover" }}
          source={require("../../images/help.webp")}
          resizeMode="cover"
        ></Image>
      );
    }
    if (item.typeReport === "FEEDBACK") {
      return (
        <Image
          style={{ width: 50, height: 50, resizeMode: "cover" }}
          source={require("../../images/feedback.png")}
          resizeMode="cover"
        ></Image>
      );
    }
  };
  const renderReport = (item) => {
    return (
      <Pressable
        onPress={() => navigation.navigate("ReportDetail", { id: item.id })}
        style={styles.itemContainer}
      >
        <View style={styles.itemImage}>{renderIcon(item)}</View>
        <View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item?.title} </Text>
            <Text style={styles.itemType}>#{item?.typeReport}</Text>
          </View>
          <Text style={styles.itemDescription}>{item?.descriptionDetail}</Text>
        </View>
      </Pressable>
    );
  };
  const loadMoreData = async () => {
    if (isMoreData) {
      let id = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        id = role.id;
      }
      const response = await GetReportList(id, page, size);
      if (response.success) {
        if (response.data) {
          setReportList((pre) => [...pre, ...response.data]);
          setPage((pre) => pre + 1);
        } else {
          setIsMoreData(false);
        }
      } else {
        Alert.alert("Error when fetch Report list", response.message);
      }
    }
  };
  return (
    <View style={{}}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Feedback And Report History</Text>
        <MaterialIcons name="more-vert" size={24} color="white" />
      </View>
      <View>
        {reportList ? (
          <FlatList
            data={reportList}
            renderItem={(item) => renderReport(item.item)}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={<View style={{ height: 100 }} />}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.3}
            style={{ marginBottom: 50 }}
          />
        ) : (
          <View
            style={{
              height: 500,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: 700, color: "gray" }}>
              No report sent
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

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
    color: "#333",
    fontWeight: "600",
  },
  itemContainer: {
    backgroundColor: "white",
    height: 80,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "gray",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: {
    color: "#333",
    fontWeight: "600",
  },
  itemType: {
    color: "#555",
  },
  itemDescription: {
    color: "#555",
  },
  itemInfo: {
    color: "#555",
    flexDirection: "row",
  },
});

export default ReportHistory;
