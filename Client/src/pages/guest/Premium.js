import { useState } from "react";
import { Switch, View, SafeAreaView, Text } from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { s } from "react-native-wind";

function PREMIUM({ navigation }) {
  return (
    <View>
      <View
        style={s`bg-white justify-center items-center py-4 border-b-2 border-b-gray-200`}
      >
        <FontAwesome
          style={s`absolute left-6`}
          name="angle-left"
          size={30}
          color="#000000" // Thay đổi màu cho icon angle-left
          onPress={() => navigation.goBack()}
        />
        <Text style={s`font-medium text-2xl text-yellow-400`}>
          Upgrade to Premium
        </Text>
      </View>
      <View style={s`flex flex-col bg-white px-3`}>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
          <MaterialCommunityIcons name="more" size={24} color="lightblue" />
            <Text style={s`h-full flex items-center pl-2`}>
              More Theme and Sound
            </Text>
          </View>
        </View>
        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialIcons name="dashboard-customize" size={24} color="black" />
            <Text style={s`h-full flex items-center pl-2`}>
              Customize Theme and Sound
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="chart-line"
              size={24}
              color="#CCCC00" // Thay đổi màu cho icon chart-line
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Detailed statistical reports.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={24}
              color="#DC143C" // Thay đổi màu cho icon format-list-bulleted
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Unlimited number of projects.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="label-outline"
              size={24}
              color="#FF6347" // Thay đổi màu cho icon label-outline
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Create labels for tasks.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="cellphone-lock"
              size={24}
              color="#4169E1" // Thay đổi màu cho icon cellphone-lock
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Strict mode: Flip the phone face down.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={24}
              color="#33CC99" // Thay đổi màu cho icon calendar-clock
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Schedule for tasks.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="folder-outline"
              size={24}
              color="#CC66FF" // Thay đổi màu cho icon folder-outline
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Create folders for projects.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="timer"
              size={24}
              color="#6633FF" // Thay đổi màu cho icon timer
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Customize Pomodoro timer duration for tasks.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="pencil-plus-outline"
              size={24}
              color="#CC0000" // Thay đổi màu cho icon pencil-plus-outline
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Add and edit Pomodoro records manually.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default PREMIUM;
