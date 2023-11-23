import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
import { SafeAreaView, StyleSheet} from "react-native";
import Focus from "./src/components/Image_Focus";
import React, { useRef } from "react";
export default function App() {
  const navigatorRef = useRef(null);
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Navigator />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});