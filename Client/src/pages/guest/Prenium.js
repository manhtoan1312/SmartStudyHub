import { useState } from "react";
import { Switch, View, SafeAreaView, Text } from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { s } from "react-native-wind";

function Prenium() {
  return (
    <SafeAreaView>
      <View
        style={s` flex-1 bg-white justify-center items-center py-4 border-b-2 border-b-gray-200`}
      >
        <FontAwesome
          style={s`absolute left-1`}
          name="angle-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={s`font-medium text-2xl`}>Nâng cấp lên Prenium</Text>
      </View>
      <View style={s`flex flex-col bg-white px-3`}>
        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Đồng bộ hóa dữ liệu tất cả thiết bị.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Sao lưu dữ liệu trên Cloud.
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Báo cáo thống kê chi tiết
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Không giới hạn số lượng dự án
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Tạo nhãn cho các nhiệm vụ
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Chế độ nghiêm ngặt: Lật úp điện thoại
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Lên lịch trình cho các nhiệm vụ
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Tạo thư mục cho các dự án
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Tùy chỉnh độ dài thời gian Pomodoro cho các nhiệm vụ
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Thêm và chỉnh sửa bản ghi Pomodoro thủ công
            </Text>
          </View>
        </View>

        <View style={s`flex flex-row justify-between py-2 mt-2`}>
          <View style={s`flex flex-row`}>
            <MaterialCommunityIcons
              name="calendar-arrow-left"
              size={24}
              color="red"
            />
            <Text style={s`h-full flex items-center pl-2`}>
              Đồng bộ hóa dữ liệu tất cả thiết bị
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Prenium;
