import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import io from "socket.io-client";
import { getChat } from "../../services/Guest/ChatSocket";
import { AntDesign } from "@expo/vector-icons";
import getRole from "../../services/RoleService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PAGE_SIZE = 10;

const GroupChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [endList, setEndList] = useState(false);
  const [id, setId] = useState(null);
  const flatListRef = useRef(null);
  const socket = io("https://api-smart-study-hub.onrender.com");

  useEffect(() => {
    const fetchID = async () => {
      let uId = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        uId = role.id;
      }
      setId(uId);
    };
    fetchID();
    fetchMessages(0, true);

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async (page, initial = false) => {
    try {
      if (endList || loading) return;
      setLoading(true);
      const result = await getChat(page, PAGE_SIZE);
      setLoading(false);
      setInitialLoading(false);

      if (result.success) {
        if (result.data.length === 0) {
          setEndList(true);
        } else {
          setMessages((prevMessages) =>
            initial ? result.data : [...prevMessages, ...result.data]
          );
        }
      } else {
        setEndList(true);
        console.error("Error fetching chat data:", result.message);
      }
    } catch (e) {
      setEndList(true);
      console.log(e);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(0);
    setEndList(false);
    const result = await getChat(0, PAGE_SIZE);
    setRefreshing(false);

    if (result.success) {
      setMessages(
        result.data.reverse().sort((a, b) => a.dateSent - b.dateSent)
      );
    } else {
      console.error("Error refreshing chat data:", result.message);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !initialLoading && !endList) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  };

  const sendMessage = async () => {
    if(inputMessage!==""){
        let image = await AsyncStorage.getItem("img");
    if (!image) {
      image =
        "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png";
      await AsyncStorage.setItem(
        "img",
        "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png"
      );
    }
    const message = {
      content: inputMessage,
      userId: id,
      type: "CHAT",
      sender: "Your Name",
      imageUrl: image,
      dateSent: new Date().getTime(),
    };

    socket.emit("sendMessage", message);
    setInputMessage("");
    }

  };

  const handleBack = () => {
    socket.disconnect();
    navigation.goBack();
  };

  const renderChatItem = ({ item }) => (
    <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: "bold" }}>{item.sender}</Text>
        <Text>{item.content}</Text>
        <Text style={{ fontSize: 10, color: "gray" }}>
          {new Date(item.dateSent).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} // Adjust this value as needed
    >
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <AntDesign name="left" size={24} color="gray" />
        </Pressable>
        <Text style={{ fontSize: 18 }}>Group Chat</Text>
        <AntDesign name="plus" size={24} color="white" />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        inverted
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {loading && !endList && <ActivityIndicator size="large" />}
            {endList && (
              <Text style={styles.headerText}>
                This is the Beginning of Group Chat
              </Text>
            )}
          </View>
        }
      />
      <View style={styles.buttonContainer}>
        <TextInput
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
          style={{
            borderBottomWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            margin: 10,
            flex:1
          }}
        />
        <Pressable style={[styles.button, inputMessage==="" ? styles.disableButton : styles.activeButton]} onPress={sendMessage}>
          <Text style={{ color: "white" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent:"space-between",
    paddingBottom: 20
  },
  button: {
    height: 40,
    width: 60,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disableButton: {
    backgroundColor: "gray",
  },
  activeButton:{
    backgroundColor: "#FFA500",
  }
});

export default GroupChat;
