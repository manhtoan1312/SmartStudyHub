// ItemTime.js
import { View, Text, StyleSheet } from "react-native";

const ItemTime = ({ time, text }) => {
  const getHours = (time) => {
    return Math.floor(time / 60);
  };

  const getMinutes = (time) => {
    return time % 60;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.hoursContainer}>
          <Text style={styles.hoursText}>HH</Text>
          <Text style={styles.timeValue}>{getHours(time)}</Text>
        </View>
        <View style={styles.separatorContainer}>
          <Text style={styles.separatorText}>:</Text>
        </View>
        <View style={styles.minutesContainer}>
          <Text style={styles.minutesText}>MM</Text>
          <Text style={styles.timeValue}>{getMinutes(time)}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.estimatedTimeText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hoursContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  hoursText: {
    fontSize: 10,
    color: "gray",
  },
  timeValue: {
    fontSize: 28,
    color: "red",
  },
  separatorContainer: {
    marginHorizontal: 5,
    paddingTop:10
  },
  separatorText: {
    fontSize: 24,
    color: "red",
  },
  minutesContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  minutesText: {
    fontSize: 10,
    color: "gray",
  },
  textContainer: {
    marginTop: 0,
  },
  estimatedTimeText: {
    fontSize: 12,
    color: "gray",

  },
});

export default ItemTime;
