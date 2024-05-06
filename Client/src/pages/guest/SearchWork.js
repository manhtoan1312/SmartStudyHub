import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Text,
  Alert,
  FlatList,SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchByWorkName } from "../../services/Guest/WorkService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WorkActive from "../../components/WorkActive";
import WorkDone from "../../components/WorkDone";
import getRole from "../../services/RoleService";
import { useIsFocused } from "@react-navigation/native";

const SearchWork = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [work, setWork] = useState(null);
  const inputRef = useRef(null);
  const isFocused = useIsFocused();
  const [isSearched, setIsSearched] = useState(false)
  let typingTimeout = null;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused && isSearched) {
        await handleSearch(searchText)
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);

  const handleSearch = async (text) => {
    const role = await getRole();
    let id;
    if (role) {
      id = role.id;
    } else {
      id = await AsyncStorage.getItem("id");
    }
    const response = await SearchByWorkName(id, text);
    if (response.success) {
      setWork(response.data);
    } else {
      Alert.alert(
        "An error happened when searching for work",
        response.message
      );
    }
    Keyboard.dismiss();
  };
  

  const handleTyping = (text) => {
    setIsSearched(true)
    setSearchText(text);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      handleSearch(text); 
    }, 1000);
  };
  

  const handleCancel = () => {
    navigation.goBack();
    setSearchText("");
  };

  const handleClearText = () => {
    setSearchText("");
    setWork(null)
  };

  const renderItem = ({ item }) => {
    if (item.status === "ACTIVE") {
      return (
        <WorkActive
          workItem={item}
          reload={()=>handleSearch(searchText)}
          navigation={navigation}
        />
      );
    } else {
      return (
        <WorkDone
          workItem={item}
          reload={() =>handleSearch(searchText)}
          navigation={navigation}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.searchIcon}>
            <Ionicons name="md-search" size={20} color="black" />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={(text) => handleTyping(text)}
            // onSubmitEditing={() => handleSearch(searchText)}
            // returnKeyType="search"
            // returnKeyLabel="Search"
          />
          {searchText !== "" && (
            <TouchableOpacity
              onPress={() => handleClearText()}
              style={styles.clearIcon}
            >
              <Ionicons name="md-close" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => handleCancel()} style={styles.cancelContainer}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
      {work && work.length > 0 ? (
        <FlatList
          data={work}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
        />
      ) : (
        <Text style={styles.noMatchText}>No match found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "grey",
    flex: 1,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  searchIcon: {
    paddingHorizontal: 8,
  },
  clearIcon: {
    paddingLeft: 8,
  },
  cancelContainer: {
    paddingHorizontal: 12,
  },
  flatList: {
    marginTop: 20,
  },
  noMatchText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
});

export default SearchWork;
