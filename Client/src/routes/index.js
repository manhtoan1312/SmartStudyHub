import { createStackNavigator } from '@react-navigation/stack';
import Setting from '../pages/guest/Setting'
import Home from '../pages/guest/home'
import Project from '../pages/guest/Project';
import Login from '../pages/guest/Login';
import Register from '../pages/guest/Register';
import Prenium from '../pages/guest/Prenium';
import Focus from '../pages/guest/Focus';

const Stack = createStackNavigator();

const Navigator = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="Prenium" component={Prenium} />
    <Stack.Screen name="Project" component={Project} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Focus" component={Focus} />
  </Stack.Navigator>
);

export default Navigator;