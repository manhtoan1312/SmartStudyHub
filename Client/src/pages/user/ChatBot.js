import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetMessage, SendMessage } from "../../services/PREMIUM/BotChatService";
import getRole from "../../services/RoleService";
import { AntDesign } from "@expo/vector-icons";

const ChatBot = ({ navigation }) => {
  const [listMessage, setListMessage] = useState([
    {
      index: -1,
      role: "system",
      content: "This is the starting point of the conversation",
    },
  ]);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(
    "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png"
  );
  const [inputMessage, setInputMessage] = useState("");

  const fetchData = async () => {
    const response = await GetMessage();
    if (response.success) {
      setListMessage((pre) => [...pre, ...response.data]);
    } else {
      Alert.alert("Error when getting messages", "Unknown Error");
    }

    const role = await getRole();
    const savedImage = await AsyncStorage.getItem("img");
    if (savedImage) {
      setImage(savedImage);
    }
    if (role) {
      setName(role.name);
    } else {
      Alert.alert("Token has expired, please log in again");
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;
    const newMessage = {
      role: "user",
      content: inputMessage,
    };
    setListMessage((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");

    const response = await SendMessage(newMessage);
    if (response.success) {
      const assistantMessages = response.data.map((choice) => choice.message);
      setListMessage((pre) => [...pre, ...assistantMessages]);
    } else {
      Alert.alert("Error when sending message", response.message);
    }
  };

  const renderItem = ({ item }) => {
    if (item.role === "system") {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.headerText}>{item.content}</Text>
        </View>
      );
    }

    const isUser = item.role === "user";
    const messageContainerStyle = isUser
      ? styles.userMessageContainer
      : styles.assistantMessageContainer;
    const messageTextStyle = isUser
      ? styles.userMessageText
      : styles.assistantMessageText;
    const bubbleStyle = isUser
      ? styles.userMessageBubble
      : styles.botMessageBubble;
    const avatar = isUser
      ? image
      : {};
    const senderName = isUser ? "You" : "Assistant";

    return (
      <View>
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>
            {new Date().toLocaleString()}
          </Text>
        </View>
        <View style={messageContainerStyle}>
          {!isUser && (
            <View style={{ marginRight: 10 }}>
              <Image source={isUser ? { uri: avatar  } : require("../../images/gpt.png")} style={styles.avatar} />
            </View>
          )}
          <View style={styles.messageTextContainer}>
            <View
              style={isUser && { alignItems: "flex-end", paddingRight: 10 }}
            >
              <Text style={styles.senderName}>{senderName}</Text>
            </View>
            <View style={bubbleStyle}>
              <Text style={messageTextStyle}>{item.content}</Text>
            </View>
          </View>
          {isUser && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleBack = () => {
    navigation.goBack();
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
        <Text style={styles.title}>Chat Bot</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={listMessage}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
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
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  chatContainer: {
    padding: 10,
  },
  systemMessageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  timestampContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  timestampText: {
    fontSize: 10,
    color: "gray",
  },
  userMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  assistantMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingBottom: 10,
  },
  messageTextContainer: {
    maxWidth: "80%",
    marginTop: 10,
  },
  senderName: {
    fontWeight: "bold",
    paddingLeft: 5,
  },
  userMessageBubble: {
    marginTop: 5,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#FFA500",
    alignSelf: "flex-end",
  },
  botMessageBubble: {
    marginTop: 5,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#ccc",
    alignSelf: "flex-start",
  },
  userMessageText: {
    color: "white",
  },
  assistantMessageText: {
    color: "black",
  },
  avatarContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  disableButton: {
    backgroundColor: "gray",
  },
  activeButton: {
    backgroundColor: "#FFA500",
  },
});

export default ChatBot;
