import { FlatList, View } from "react-native";
import RankingItem from "./RankingItem";

function RankingBody({ listUser }) {
  return (
    <View style={{ backgroundColor: 'white' }}>
      <FlatList
        data={listUser}
        renderItem={({ item }) => <RankingItem user={item} />}
        keyExtractor={(item) => item.id.toString()} 
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </View>
  );
}

export default RankingBody;
