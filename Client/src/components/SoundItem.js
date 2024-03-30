import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SoundItem = ({ sound, url, onSelect, onDelete }) => {
  const isSelected = sound.url === url;

  return (
    <View style={[styles.addItem, isSelected && styles.selectedItem]}>
      <Text style={styles.bodyText}>{sound.nameSound}</Text>
      {isSelected && <MaterialIcons name="check" size={24} color="orange" />}
    </View>
  );
};

const styles = StyleSheet.create({
  addItem: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  selectedItem: {
    backgroundColor: "#fee4d4", // Màu cam nhạt
  },
  bodyText: {
    fontSize: 16,
    color: "#555555",
  },
});

export default SoundItem;
