import React, { useEffect, useState } from "react";
import { getAllTransactionPayment } from "../../services/UserService";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Pressable
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const TransactionPayment = ({ navigation }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllTransactionPayment();
      if (response.success) {
        setData(response.data);
      } else {
        Alert.alert("Error getting transactions", response.message);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    const date = new Date(item.payDate);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Transaction No: {item.transactionNo}</Text>
        <Text style={styles.itemText}>Order ID: {item.orderId}</Text>
        <Text style={styles.itemText}>Method Payment: {item.methodPayment}</Text>
        <Text style={styles.itemText}>Type Payment: {item.typePayment}</Text>
        <Text style={styles.itemText}>Info: {item.info}</Text>
        <Text style={styles.itemText}>Amount: {item.amount} {item.unit}</Text>
        <Text style={styles.itemText}>Pay Date: {formattedDate}</Text>
        <Text style={styles.itemText}>Status: {item.status}</Text>
        <Text style={styles.itemText}>Package: {item.packagePremium}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>List of Transactions</Text>
        <Pressable>
          <Text style={{ color: "white" }}>Report</Text>
        </Pressable>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
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
  headerText: {
    paddingLeft: 10,
    fontWeight: "700",
    fontSize: 18,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default TransactionPayment;
