import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/routes";
export default function App() {
  console.log("hi");
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
