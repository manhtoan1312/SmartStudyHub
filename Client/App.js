import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
import { SafeAreaView, StyleSheet } from "react-native";
import useTimerService from "./src/hooks/useTimerService";


const App = () => {
  const timerService = useTimerService();

  return (
    <NavigationContainer>
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
