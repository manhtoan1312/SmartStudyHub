// HeaderDetail.js
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemTime from "./ItemTime";
import ItemWork from "./ItemWork";

const HeaderDetail = ({
  totalTimeWork,
  totalWorkActive,
  totalTimePassed,
  totalWorkCompleted,
}) => {
  return (
    <View style={styles.container}>
      <ItemTime time={totalTimeWork} text="Estimated time" />
      <ItemWork work={totalWorkActive} text="Works need to do" />
      <ItemTime time={totalTimePassed} text="Estimated time" />
      <ItemWork work={totalWorkCompleted} text="Works completed" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 10, // Increase padding for better spacing
    marginHorizontal: 10, // Add margin for separation
  },
});

export default HeaderDetail;
