import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import { Dropdown } from "react-native-element-dropdown";

const ColorDropdown = ({ selectedColor, onSelectColor }) => {
  const pastelColors = [
    { label: "Tomato Red", value: "#FF6347" },
    { label: "Banana Yellow", value: "#FFD700" },
    { label: "Sage Green", value: "#9ACD32" },
    { label: "Light Green", value: "#90EE90" },
    { label: "Pastel Blue", value: "#AEC6CF" },
    { label: "Blueberry", value: "#7F7FFF" },
    { label: "Lavender", value: "#E6E6FA" },
    { label: "Grape", value: "#6F2DA8" },
    { label: "Pastel Pink", value: "#FFB6C1" },
    { label: "Smoke", value: "#738276" },
    { label: "Sky Blue", value: "#87CEEB" },
    { label: "Default Orange", value: "#FFA500" },
  ];

  return (
    <Dropdown
      data={pastelColors}
      labelField="label"
      valueField="value"
      style={{ width: 200 }}
      value={selectedColor}
      onChange={(item) => onSelectColor(item)}
      renderItem={(item) => (
        <ListItem
          containerStyle={{ padding: 10 }}
          onPress={() => onSelectColor(item)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 16,
                height: 16,
                backgroundColor: item?.value,
                marginRight: 10,
                borderRadius: 5,
              }}
            />
            {item && <Text style={{ color: "gray" }}>{item.label}</Text>}
          </View>
        </ListItem>
      )}
    />
  );
};

export default ColorDropdown;
