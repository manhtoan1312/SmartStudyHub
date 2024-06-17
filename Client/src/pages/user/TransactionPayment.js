import React, { useEffect, useState } from "react";
import { getAllTransactionPayment } from "../../services/UserService";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for PayPal and VNPay icons

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
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    const backgroundColor = item.packagePremium === "FOREVER" ? "#fff8e1" : "#fff";
    const getIcon = (method) => {
      switch (method) {
        case "PAYPAL":
          return <FontAwesome name="paypal" size={24} color="#2790C3" style={styles.icon} />;
        case "VNPAY":
          return <FontAwesome name="credit-card" size={24} color="#2790C3" style={styles.icon} />;
        default:
          return null;
      }
    };

    return (
      <View style={[styles.itemContainer, { backgroundColor }]}>
        {getIcon(item.methodPayment)}
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
    position: "relative", 
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  icon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

export default TransactionPayment;
