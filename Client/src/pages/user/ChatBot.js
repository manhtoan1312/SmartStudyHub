import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, FlatList, Alert, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetMessage } from "../../services/PREMIUM/BotChatService";
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

  const fetchData = async () => {
    const response = await GetMessage();
    if (response.success) {
      setListMessage((pre) => [...pre, ...response.data]);
    } else {
      Alert.alert("Error when getting messages", response.message);
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

  const renderItem = ({ item }) => {
    const isUser = item.role === "user";
    const messageContainerStyle = isUser
      ? styles.userMessageContainer
      : styles.assistantMessageContainer;
    const messageTextStyle = isUser ? styles.userMessageText : styles.assistantMessageText;
    const avatar = isUser ? image : "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png";

    return (
      <View style={styles.messageContainer}>
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>{new Date().toLocaleString()}</Text>
        </View>
        <View style={messageContainerStyle}>
          {!isUser && (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          )}
          <View style={styles.messageTextContainer}>
            <Text style={messageTextStyle}>{item.content}</Text>
          </View>
          {isUser && (
            <Image source={{ uri: avatar }} style={styles.avatar} />
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
  messageContainer: {
    marginBottom: 10,
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
    alignItems: "center",
  },
  assistantMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  messageTextContainer: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 20,
  },
  userMessageText: {
    backgroundColor: "#FFA500",
    color: "white",
  },
  assistantMessageText: {
    backgroundColor: "#ccc",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
});

export default ChatBot;
