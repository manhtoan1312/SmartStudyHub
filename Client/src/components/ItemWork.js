// ItemWork.js
import { View, Text, StyleSheet } from "react-native";

const ItemWork = ({ work, text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.countContainer}>
        <Text style={styles.work}>{work}</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 10,
    width: 100,
    marginTop: 10,
    alignItems: "center", 
  },
  work: {
    fontSize: 28,
    color: "red",
  },
  textContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: "gray",
  },
  countContainer:{
    alignItems: "center",
  }
});

export default ItemWork;
