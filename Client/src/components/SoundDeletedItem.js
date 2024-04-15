import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SoundDeletedItem = ({ sound,onRecover, onDelete }) => {

  const handleLongPress = () => {
    onDelete(sound);
  };

  const handlePress = () => {
    onRecover(sound)
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#fee4d4" : "transparent",
        },
        styles.addItem,
        isSelected && styles.selectedItem,
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.bodyText}>{sound.nameSound}</Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  addItem: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#fee4d4",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyText: {
    fontSize: 16,
    color: "#555555",
  },
});

export default SoundDeletedItem
