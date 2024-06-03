import { FlatList, View, StyleSheet } from "react-native";
import RankingItem from "./RankingItem";

function RankingBody({ navigation, listUser, onEndList }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={listUser}
        renderItem={({ item }) => <RankingItem navigation={navigation} user={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={<View style={{ height: 100 }} />}
        onEndReached={onEndList}
        onEndReachedThreshold={0.5} // Thay đổi giá trị này để thử nghiệm
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

export default RankingBody;
