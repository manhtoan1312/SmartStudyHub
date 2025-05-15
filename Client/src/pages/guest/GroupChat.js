import React, { useState, useEffect, useRef } from "react";
const TextEncodingPolyfill = require("text-encoding");
const { TextDecoder, TextEncoder } = TextEncodingPolyfill;
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
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getChat } from "../../services/Guest/ChatSocket";
import getRole from "../../services/RoleService";

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
  const stompClientRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      let uId = await AsyncStorage.getItem("id");
      const role = await getRole();
      if (role) {
        uId = role.id;
      }
      setId(uId);
      await fetchMessages(0, true);
      // Scroll to bottom after fetching initial messages
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 500);
      connect(uId);
    };
    fetchData(0);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const connect = (userId) => {
    const socket = new SockJS("https://api-smart-study-hub.onrender.com/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket connected");
        stompClient.subscribe("/topic/public", onMessageReceived);
        sendJoinMessage(stompClient, userId);
      },
      onStompError: (error) => {
        console.error("WebSocket error:", error);
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const sendJoinMessage = (stompClient, userId) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify({ userId, type: "JOIN" }),
      });
    } else {
      console.error("WebSocket is not connected. Please Retry again...");
    }
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
          // Scroll to bottom after fetching initial messages
          if (initial && flatListRef.current) {
            setTimeout(() => {
              flatListRef.current.scrollToEnd({ animated: true });
            }, 500);
          }
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

  const handleLoadMore = () => {
    if (!loading && !initialLoading && !endList) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  };

  const sendMessage = () => {
    if (inputMessage !== "") {
      if (stompClientRef.current && stompClientRef.current.connected) {
        const chatMessage = {
          userId: id,
          content: inputMessage,
          type: "CHAT",
        };

        stompClientRef.current.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(chatMessage),
        });
        setInputMessage("");
      } else {
        console.error("WebSocket is not connected. Retrying in 1 second...");
        setTimeout(sendMessage, 1000);
      }
    }
  };

  const onMessageReceived = (message) => {
    const receivedMessage = JSON.parse(message.body);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
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
            <Pressable
              onPress={() =>
                navigation.navigate("ViewUser", { id: item.userId })
              }
              style={{ justifyContent: "flex-end" }}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            </Pressable>
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
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="account-group-outline"
            style={styles.itemRow}
            size={20}
            color="black"
          />
          <Text style={styles.title}>Group Chat</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderChatItem}
        keyExtractor={(item, index) => index.toString()}
        onStartReached={handleLoadMore}
        onStartReachedThreshold={0.5}
        ListFooterComponent={() => <View style={{ height: 20 }}></View>}
        ListHeaderComponent={() => (
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
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message"
          style={styles.input}
        />
        <Pressable
          onPress={sendMessage}
          style={[
            styles.sendButton,
            inputMessage.length !== 0
              ? styles.activeButton
              : styles.disableButton,
          ]}
        >
          <AntDesign name="right" size={24} color="black" />
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
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginLeft: 10,
    borderRadius: 20,
  },
  title: {
    fontWeight: "700",
    paddingLeft: 10,
    fontSize: 18,
  },
});

export default GroupChat;
