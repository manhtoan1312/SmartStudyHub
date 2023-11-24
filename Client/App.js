// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
import { SafeAreaView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import useTimerService from "./src/services/TimerService";

const App = () => {
  const navigationRef = React.useRef();
  const timerService = useTimerService(navigationRef.current);

  useFocusEffect(
    React.useCallback(() => {
      timerService.toggleTimer();
      return () => {
        timerService.toggleTimer();
      };
    }, [timerService])
  );

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaView style={styles.container}>
        <Navigator />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
