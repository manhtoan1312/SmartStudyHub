import { createStackNavigator } from '@react-navigation/stack';
import Setting from '../pages/Setting'
import Home from '../pages/home'
import Project from '../pages/Project';

const Stack = createStackNavigator();

const Navigator = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="Project" component={Project} />
  </Stack.Navigator>
);

export default Navigator;