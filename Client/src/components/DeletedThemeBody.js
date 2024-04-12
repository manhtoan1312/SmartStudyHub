import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";

const DeletedThemeBody = () => {
  const [themeList, setThemeList] = useState([]);
  return (
    <View style={{ marginHorizontal: 5, marginTop: 40 }}>
      <FlatList
        data={themeList}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            {item.id === -1 ? (
              <TouchableOpacity
                style={[
                  styles.addThemeContainer,
                  { width: imageWidth, height: imageHeight },
                ]}
                onPress={() => handleAddTheme()}
              >
                <AntDesign name="pluscircle" size={24} color="#676767" />
                <Text style={styles.addThemeText}>{item.name}</Text>
              </TouchableOpacity>
            ) : (
              <ThemeItem
                theme={item}
                id={selectedTheme?.id ? selectedTheme?.id : 1}
                navigation={navigation}
                onSelect={() => handleSelectTheme(item)}
                onDelete={() => handleSelectTheme(item)}
              />
            )}
          </View>
        )}
        ListFooterComponent={<View style={{ height: 150 }} />}
      />
    </View>
  );
};
export default DeletedThemeBody;
