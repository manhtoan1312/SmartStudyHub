import {
  View,
  Text,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons,AntDesign,FontAwesome,Entypo } from "@expo/vector-icons";
const AddTask_Detail = () => {
  return (
    <View>
      <View>
        <TextInput placeholder="Add a Task..." />
        <View>
          <Text>Estimated number of Pomodoros</Text>
        </View>
        <View>
          <MaterialCommunityIcons
            key={1}
            name="timer"
            size={14}
            color="gray"
          />
          <MaterialCommunityIcons
            key={2}
            name="timer"
            size={14}
            color="gray"
          />
          <MaterialCommunityIcons
            key={3}
            name="timer"
            size={14}
            color="gray"
          />
          <MaterialCommunityIcons
            key={4}
            name="timer"
            size={14}
            color="gray"
          />
          <MaterialCommunityIcons
            key={5}
            name="timer"
            size={14}
            color="gray"
          />

        </View>
        <View>
        <AntDesign name="calendar" size={24} color="green" />
        <FontAwesome name="flag" size={24} color="gray" />
        <AntDesign name="tago" size={24} color="gray" />
        <View>
        <FontAwesome name="tasks" size={24} color="blue" />
        <Entypo name="dot-single" size={24} color="black" />
        <Text>Task</Text>
        </View>
        <Text>Done</Text>
        </View>
      </View>
    </View>
  );
};
