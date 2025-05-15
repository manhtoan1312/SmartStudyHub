import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  Button,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";
import { useDispatch, useSelector } from "react-redux";
import { setFocus } from "../../slices/focusSlice";

const FullScreenMode = ({ navigation }) => {
  const {
    secondsLeft,
    isPause,
    isStop,
    workId,
    pomodoroTime,
    defaultTimePomodoro,
    workMode,
    mode,
  } = useSelector((state) => state.focus);
  const dispatch = useDispatch();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <AntDesign name="closecircle" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.numberBorder}>
        <AnimatedNumbers
          includeComma
          animateToNumber={parseInt(secondsLeft / 60)}
          fontStyle={styles.number}
        />
      </View>
      <View style={styles.numberBorder}>
        <AnimatedNumbers
          includeComma
          animateToNumber={secondsLeft % 60}
          fontStyle={styles.number}
        />
      </View>
      {workMode === "work" ? (
        <View style={styles.buttonContainer}>
          {isStop && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() =>
                dispatch(setFocus({ isStop: false, isPause: false }))
              }
            >
              <AntDesign name="play" size={24} color="white" />
            </TouchableOpacity>
          )}
          {isPause && !isStop && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => dispatch(setFocus({ isPause: false }))}
            >
              <AntDesign name="play" size={24} color="white" />
            </TouchableOpacity>
          )}
          {!isPause && !isStop && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => dispatch(setFocus({ isPause: true }))}
            >
              <AntDesign name="pausecircle" size={24} color="white" />
            </TouchableOpacity>
          )}

          {!isStop && isPause && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() =>
                dispatch(
                  setFocus({
                    isPause: true,
                    isStop: true,
                    secondsLeft:
                      mode === "+"
                        ? 0
                        : (workId ? pomodoroTime : defaultTimePomodoro) * 60,
                  })
                )
              }
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          {isStop && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() =>
                dispatch(setFocus({ isStop: false, isPause: false }))
              }
            >
              <AntDesign name="play" size={24} color="white" />
            </TouchableOpacity>
          )}
          {!isStop && (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() =>
                dispatch(
                  setFocus({
                    isStop: true,
                    isPause: true,
                    secondsLeft: workId
                      ? pomodoroTime * 60
                      : defaultTimePomodoro * 60,
                    workMode: "work",
                  })
                )
              }
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    left: 20,
    top: 20,
    padding: 10,
  },
  number: {
    fontSize: 150,
    fontWeight: "bold",
    color: "white",
  },
  numberBorder: {
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 2,
    width: 230,
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#1E1E1E",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "#292929",
    padding: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    paddingVertical: 15,
    position: "absolute",
    bottom: 20,
  },
  optionButton: {
    marginHorizontal: 20,
  },
});
export default FullScreenMode;
