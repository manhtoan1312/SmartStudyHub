import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GetAllTagOfUser } from "../services/Guest/TagService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TagModal = ({
  isVisible,
  onSelectTag,
  onClose,
  selectedTags,
  navigation,
}) => {
  const [selectedTagIds, setSelectedTagIds] = useState(
    selectedTags.map((tag) => tag.id)
  );
  const [tagList, setTagList] = useState([]);
  useEffect(() => {
    const fecthData = async () => {
      const id = await AsyncStorage.getItem("id");
      const response = await GetAllTagOfUser(id);
      if (response?.success) {
        setTagList(response?.data);
      }
    };
    fecthData();
  }, []);
  const handleToggleTag = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };
  const handleComplete = () => {
    const selectedTags = tagList.filter((tag) =>
      selectedTagIds.includes(tag.id)
    );
    onSelectTag(selectedTags);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}
            >
              Tag
            </Text>
          </View>

          <ScrollView>
            {tagList &&
              tagList?.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => handleToggleTag(tag.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: selectedTagIds.includes(tag.id)
                      ? "#ffcccc"
                      : "transparent",
                    padding: 8,
                    marginBottom: 8,
                    borderRadius: 8,
                  }}
                >
                  <AntDesign
                    name="tag"
                    size={24}
                    color={tag.colorCode}
                    style={{ marginRight: 8 }}
                  />
                  <Text>{tag.tagName}</Text>
                  {selectedTagIds.includes(tag.id) && (
                    <AntDesign
                      name="checkcircle"
                      size={24}
                      color="#ff3232"
                      style={{ position: "absolute", right: 8 }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                padding: 8,
                marginBottom: 8,
                borderRadius: 8,
              }}
              onPress={() => {
                onClose();
                navigation.navigate("AddTag");
              }}
            >
              <Text>+ Create New Tag</Text>
            </TouchableOpacity>
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#ddd",
                marginRight: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleComplete}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: "#007BFF",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TagModal;
