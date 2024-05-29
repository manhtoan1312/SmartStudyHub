import React, { useState, useRef, useEffect } from "react";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Touchable,
  Pressable,
} from "react-native";
import StatisticalPomodoro from "../../components/StatisticalPomodoro";
import StatisticalWork from "../../components/StatisticalWork";

const Statistical = ({ navigation }) => {
  const [headerDate, setHeaderData] = useState({});
  const [mode, setMode] = useState(1);
  const underlinePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: mode === 1 ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [mode]);

  const underlineLeft = underlinePosition.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Statistical</Text>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={24}
          color="#333"
        />
      </View>
      <View style={styles.bar}>
        <Pressable
          onPress={() => setMode(1)}
          style={[styles.mode, mode === 1 && styles.modeSelected]}
        >
          <Text style={[styles.modeText, mode === 2 && { color: "gray" }]}>
            Pomodoro
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode(2)}
          style={[styles.mode, mode === 2 && styles.modeSelected]}
        >
          <Text style={[styles.modeText, mode === 1 && { color: "gray" }]}>
            Work
          </Text>
        </Pressable>
        <Animated.View
          style={[
            styles.underline,
            {
              left: underlineLeft,
            },
          ]}
        />
      </View>
      <View style={{paddingTop:20}}>{mode === 1 ? <StatisticalPomodoro /> : <StatisticalWork />}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textBody: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "700",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingTop: 10,
    position: "relative",
  },
  modeSelected: {
    borderColor: "#FA6408",
    borderBottomWidth: 2,
    color: "black",
    height: 40,
  },
  modeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: 600,
  },
  mode: {
    width: "50%",
    alignItems: "center",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: "50%",
    backgroundColor: "#FA6408",
  },
});

export default Statistical;
