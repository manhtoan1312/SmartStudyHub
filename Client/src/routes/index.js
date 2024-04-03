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
import SearchWork from "../pages/guest/SearchWork";
import { UpdateWork } from "../services/Guest/WorkService";
import Today from "../pages/guest/Today";
import Tomorror from "../pages/guest/Tomorrow";
import ThisWeek from "../pages/guest/ThisWeek";
import Next7Day from "../pages/guest/Next7Day";
import High from "../pages/guest/High";
import Medium from "../pages/guest/Medium";
import Low from "../pages/guest/Low";
import Planed from "../pages/guest/Planed";
import All from "../pages/guest/All";
import SomeDay from "../pages/guest/SomeDay";
import TaskDefault from "../pages/guest/TaskDefault";
import FolderDetail from "../pages/guest/FolderDetail";
import Out from "../pages/guest/Out";
import TagDetail from "../pages/guest/TagDetail";
import DoneDetail from "../pages/guest/DoneDetail";
import DeletedDetail from "../pages/guest/Deleted";
import WorkDetail from "../pages/guest/WorkDetail";
import WorkDeletedDetail from "../pages/guest/WorkDeletedDetail";
import ChangeEmail from "../pages/user/ChangeEmail";
import HelpAndFeedBack from "../pages/guest/HelpAndFeedBack";
import Report from "../pages/guest/Report";
import Theme from "../pages/guest/Theme";
import AvatarUploaded from "../pages/user/AvatarUploaded";
import SoundDone from "../pages/guest/SoundDone";
import FocusSound from "../pages/guest/FocusSound";

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
    <Stack.Screen name="SearchWork" component={SearchWork} />
    <Stack.Screen name="Today" component={Today} />
    <Stack.Screen name="Tomorror" component={Tomorror} />
    <Stack.Screen name="ThisWeek" component={ThisWeek} />
    <Stack.Screen name="Next7Day" component={Next7Day} />
    <Stack.Screen name="High" component={High} />
    <Stack.Screen name="Medium" component={Medium} />
    <Stack.Screen name="Low" component={Low} />
    <Stack.Screen name="Planned" component={Planed} />
    <Stack.Screen name="All" component={All} />
    <Stack.Screen name="SomeDay" component={SomeDay} />
    <Stack.Screen name="Task" component={TaskDefault} />
    <Stack.Screen name="FolderDetail" component={FolderDetail} />
    <Stack.Screen name="OutOfDate" component={Out} />
    <Stack.Screen name="TagDetail" component={TagDetail} />
    <Stack.Screen name="UpdateWork" component={WorkDetail} />
    <Stack.Screen name="Done" component={DoneDetail} />
    <Stack.Screen name="Deleted" component={DeletedDetail} />
    <Stack.Screen name="WorkDeletedDetail" component={WorkDeletedDetail} />
    <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
    <Stack.Screen name="Report" component={Report} />
    <Stack.Screen name="HelpAndFeedBack" component={HelpAndFeedBack} />
    <Stack.Screen name="Theme" component={Theme} />
    <Stack.Screen name="AvtUploaded" component={AvatarUploaded} />
    <Stack.Screen name="SoundDone" component={SoundDone} />
    <Stack.Screen name="FocusSound" component={FocusSound} />
  </Stack.Navigator>
);

export default Navigator;




