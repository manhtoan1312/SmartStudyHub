import { FlatList, View } from "react-native";
import RankingItem from "./RankingItem";

function RankingBody({ listUser, onEndList }) {
  return (
    <View style={{ backgroundColor: 'white' }}>
      <FlatList
        data={listUser}
        renderItem={({ item }) => <RankingItem user={item} />}
        keyExtractor={(item) => item.id.toString()} 
        ListFooterComponent={<View style={{ height: 20 }} />}
        onEndReached={onEndList}
        onEndReachedThreshold={0.3} 
      />
    </View>
  );
}

export default RankingBody;
