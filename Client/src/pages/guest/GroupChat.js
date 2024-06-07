import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getChat } from "../../services/Guest/ChatSocket";
import getRole from "../../services/RoleService";
import SockJS from "sockjs-client";

const PAGE_SIZE = 20;

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
  const websocketRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      let uId = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        uId = role.id;
      }
      setId(uId);
      await fetchMessages(0, true);
      flatListRef.current.scrollToEnd({ animated: true });
    };
    fetchData();

    connect();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const connect = () => {
    websocketRef.current = new WebSocket(
      "wss://api-smart-study-hub.onrender.com/ws"
    );
    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      websocketRef.current.send(JSON.stringify({ userId: id, type: "JOIN" }));
    };

    websocketRef.current.onmessage = (event) => {
      console.log(event);
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [message, ...prevMessages]);
    };

    websocketRef.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

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
            initial
              ? result.data.reverse()
              : [...result.data.reverse(), ...prevMessages]
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
      setMessages(result.data);
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

  const sendMessage = () => {
    if (inputMessage !== "" && websocketRef.current) {
      const chatMessage = {
        id: id,
        content: inputMessage,
        type: "CHAT",
      };

      websocketRef.current.send(JSON.stringify(chatMessage));
      setInputMessage("");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderChatItem = ({ item }) => {
    if (item.type === "JOIN" || item.type === "LEAVE") {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 10, color: "gray" }}>
            {new Date(item.dateSent).toLocaleString()}
          </Text>
          <Text style={{ padding: 2 }}>
            {item.sender} {item.type === "JOIN" ? "joined" : "left"} group chat
          </Text>
        </View>
      );
    }
    if (item.userId == id) {
      return (
        <View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 10, color: "gray" }}>
              {new Date(item.dateSent).toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 10,
              paddingBottom: 10,
              justifyContent: "center",
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  marginLeft: 10,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingRight: 10,
                }}
              >
                <Text style={{ fontWeight: "bold", paddingRight: 5 }}>You</Text>
                <View
                  style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: "#FFA500",
                    borderRadius: 20,
                    maxWidth: 250,
                    minWidth: 20,
                    justifyContent: "flex-start",
                    flex: 1,
                  }}
                >
                  <Text style={{ color: "white" }}>{String(item.content)}</Text>
                </View>
              </View>
              <View style={{ justifyContent: "flex-end" }}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 10, color: "gray" }}>
            {new Date(item.dateSent).toLocaleString()}
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ justifyContent: "flex-end" }}>
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            </View>
            <View
              style={{
                marginLeft: 10,
                justifyContent: "center",
                paddingRight: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", paddingLeft: 5 }}>
                {item.sender}
              </Text>
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: "#ccc",
                  borderRadius: 20,
                  maxWidth: 250,
                }}
              >
                <Text>{String(item.content)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Group Chat</Text>
        <AntDesign name="left" size={24} color="white" />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onStartReached={handleLoadMore}
        onStartReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {loading && !endList && <ActivityIndicator size="large" />}
            {endList && (
              <View
                style={
                  messages.length === 0 && {
                    justifyContent: "center",
                    alignItems: "center",
                    height: 700,
                  }
                }
              >
                <Text style={styles.headerText}>
                  This is the Beginning of Group Chat
                </Text>
              </View>
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
            flex: 1,
          }}
        />
        <Pressable
          style={[
            styles.button,
            inputMessage === "" ? styles.disableButton : styles.activeButton,
          ]}
          onPress={sendMessage}
        >
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
    justifyContent: "space-between",
    paddingBottom: 20,
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
  activeButton: {
    backgroundColor: "#FFA500",
  },
});

export default GroupChat;
