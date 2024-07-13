import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { s } from "react-native-wind";
import getRole from "../../services/RoleService";
import { PayVNPay, getUserInfor, PayPaypal } from "../../services/UserService";
import { useIsFocused } from "@react-navigation/native";
import * as Link from "expo-linking";
function PREMIUM({ navigation }) {
  const [infor, setInfor] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const isFocused = useIsFocused();
  const [checkRole, setCheckRole] = useState(false);
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { url } = event;
      const parsedUrl = Link.parse(url);
      const { hostname, queryParams } = parsedUrl;
      if (queryParams?.status === "SUCCESS") {
        fetchData()
        Alert.alert('Payment success!!')
        const role = await getRole();
        if (role.role !== "PREMIUM") {
          Alert.alert(
            "Payment success!",
            "Please login again to access new advantages"
          );
        }
      } else if (queryParams?.status === "FAIL") {
        Alert.alert("Payment fail!", "We got an error in your payment action");
      }
    };

    Link.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    const subscription = Link.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);
  const fetchData = async () => {
    const role = await getRole();
    if (role) {
      setCheckRole(true);
      const response = await getUserInfor();
      if (response.success) {
        setInfor(response.data);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [navigation]);

  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);

  const packages = {
    THREEMONTHS: {
      name: "Three Months",
      price: 1.99,
      description: "Pay the 3-month Premium account registration bill on",
    },
    ONEYEAR: {
      name: "One Year",
      price: 4.99,
      description: "Pay the Lifetime Premium account registration bill on",
    },
  };

  const openModal = (packageType) => {
    setSelectedPackage(packageType);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPackage(null);
  };

  const handlePaymentOption = async (option) => {
    if (checkRole) {
      const packageDetails = packages[selectedPackage];
      const orderDate = new Date().toLocaleDateString();
      const orderInfor = `${packageDetails.description} ${orderDate}`;
      const payAmount = parseInt(packageDetails.price * 25000);
      const packageType = selectedPackage;
      let response;
      if (option === "PayPal") {
        response = await PayPaypal(orderInfor, payAmount, packageType);
      } else {
        response = await PayVNPay(orderInfor, payAmount, packageType);
      }
      if (response.success) {
        Linking.openURL(response.data);
      } else {
        Alert.alert("Payment fail!", response.message);
      }

      console.log(
        `Selected package: ${selectedPackage}, Payment option: ${option}`
      );
    } else {
      navigation.navigate("Login");
    }
    closeModal();
  };

  const handlePressPayment = () => {
    if (checkRole) {
      navigation.navigate("Transaction");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ position: "relative" }}>
        <View
          style={s`bg-white flex-row justify-between items-center p-4 border-b-2 border-b-gray-200`}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <FontAwesome name="angle-left" size={30} color="#333" />
          </Pressable>
          <Text style={s`font-medium text-2xl text-yellow-400`}>
            Upgrade to Premium
          </Text>
          <Pressable onPress={handlePressPayment}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={checkRole ? "#333" : "white"}
            />
          </Pressable>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={s`flex flex-col bg-white px-3`}>
          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons name="more" size={24} color="lightblue" />
              <Text style={s`h-full flex items-center pl-2`}>
                More Theme and Sound
              </Text>
            </View>
          </View>
          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialIcons
                name="dashboard-customize"
                size={24}
                color="black"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Customize Theme and Sound
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#CCCC00"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Detailed statistical reports.
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={24}
                color="#DC143C"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Unlimited number of projects.
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons
                name="label-outline"
                size={24}
                color="#FF6347"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Create labels for tasks.
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons
                name="cellphone-lock"
                size={24}
                color="#4169E1"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Strict mode: Flip the phone face down.
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={24}
                color="#33CC99"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Schedule for tasks.
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons
                name="folder-outline"
                size={24}
                color="#CC66FF"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Create folders for projects.
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons name="timer" size={24} color="#6633FF" />
              <Text style={s`h-full flex items-center pl-2`}>
                Customize Pomodoro timer duration for tasks.
              </Text>
            </View>
          </View>

          <View style={s`flex flex-row justify-between py-2 mt-2`}>
            <View style={s`flex flex-row`}>
              <MaterialCommunityIcons
                name="pencil-plus-outline"
                size={24}
                color="#CC0000"
              />
              <Text style={s`h-full flex items-center pl-2`}>
                Add and edit Pomodoro records manually.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.payContainer}>
        <View style={styles.dueDate}>
          {infor?.dueDatePremium !== undefined && (
            <Text style={styles.dueDateText}>
              Remaining time to use the premium version: {infor?.dueDatePremium}
              Day
            </Text>
          )}
        </View>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openModal("THREEMONTHS")}
            >
              <Text style={styles.buttonText}>Three Months</Text>
              <Text style={styles.buttonText}>1.99 USD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openModal("ONEYEAR")}
            >
              <Text style={styles.buttonText}>One Year</Text>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={styles.buttonText}>4.99 USD </Text>
                <Text style={styles.sale}>9.99 USD</Text>
              </View>
              <View style={styles.discount}>
                <Text style={styles.textDiscount}>-50%</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => handlePaymentOption("PayPal")}
            >
              <Text style={styles.modalButtonText}>PayPal</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => handlePaymentOption("VNPay")}
            >
              <Text style={styles.modalButtonText}>VNPay</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  payContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingBottom: 20,
  },
  dueDate: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  dueDateText: {
    color: "#E6D800",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#FA6408",
    width: 150,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
  },
  sale: {
    textDecorationLine: "line-through",
    color: "white",
    marginLeft: 5,
  },
  discount: {
    paddingHorizontal: 4,
    marginTop: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textDiscount: {
    color: "white",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FA6408",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "gray",
  },
});

export default PREMIUM;
