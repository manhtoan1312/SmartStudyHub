// Navigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../pages/guest/home";
import Setting from "../pages/guest/Setting";
import Prenium from "../pages/guest/Prenium";
import Project from "../pages/guest/Project";
import Login from "../pages/guest/Login";
import Register from "../pages/guest/Register";
import Focus from "../pages/guest/Focus";
import InputOTP from "../pages/guest/InputOTP";
import AddProject from "../pages/guest/AddProject";
import AddFolder from "../pages/guest/AddFolder";
import InforUser from "../pages/user/InforUser";
import ChangePassword from "../pages/user/ChangePassword";
import ComingSoonScreen from "../pages/guest/CommingSoon";
import RecoverAccount from "../pages/guest/RecoverAccount";
import ForgotPasswordOTP from "../pages/guest/ForgotPasswordOTP";
import ForgotPasswordEmail from "../pages/guest/ForgotPasswordEmail";
import EditProjectPage from "../pages/guest/EditProject";
import ProjectDetail from "../pages/guest/ProjectDetail";
import AddTag from "../pages/guest/AddTag";
import EditTag from "../pages/guest/EditTag";
import EditFolder from "../pages/guest/EditFolder";

const Stack = createStackNavigator();

const Navigator = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="Prenium" component={Prenium} />
    <Stack.Screen name="Project" component={Project} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Focus" component={Focus} />
    <Stack.Screen name="InputOTP" component={InputOTP} />
    <Stack.Screen name="AddProject" component={AddProject} />
    <Stack.Screen name="AddFolder" component={AddFolder} />
    <Stack.Screen name="Infor" component={InforUser} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
    <Stack.Screen name="Recover" component={RecoverAccount} />
    <Stack.Screen name="ForgotPasswordOTP" component={ForgotPasswordOTP} />
    <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail} />
    <Stack.Screen name="EditProject" component={EditProjectPage} />
    <Stack.Screen name="ProjectDetail" component={ProjectDetail} />
    <Stack.Screen name="AddTag" component={AddTag} />
    <Stack.Screen name="EditTag" component={EditTag} />
    <Stack.Screen name="EditFolder" component={EditFolder} />
  </Stack.Navigator>
);

export default Navigator;




