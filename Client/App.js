import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
import { SafeAreaView, StyleSheet} from "react-native";
export default function App() {
  console.log("hi");
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