// App.js
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { navigationRef, isReadyRef } from "./src/routes/rootNavigation";
import ImageFocus from "./src/components/Image_Focus";

const App = () => {
  const [showImageFocus, setShowImageFocus] = useState(true);

  React.useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <SafeAreaView style={styles.container}>
        <Navigator/>
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
