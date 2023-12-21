import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
import { SafeAreaView, StyleSheet, View, AppState } from "react-native";
import { navigationRef, isReadyRef } from "./src/routes/rootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationComponent from "./src/components/NoficationComponent";

const App = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleAppStateChange =(nextAppState) => {
    if (nextAppState === "background") {
      const stop = AsyncStorage.getItem('stop');
      if (stop === "false") {
        setShowNotification(true);
      }
    }
  }

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const hideNotification = () => {
    setShowNotification(false);

    AsyncStorage.multiRemove([
      "secondsLeft",
      "countWork",
      "play",
      "mode",
      "stop",
      "startTime",
      "work",
      "workType",
    ]);
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <SafeAreaView style={styles.container}>
        <Navigator />
        {showNotification && <NotificationComponent onHide={hideNotification} />}
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
