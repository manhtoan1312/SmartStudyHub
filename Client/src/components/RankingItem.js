import { Image, StyleSheet, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

const RankingItem = ({ user }) => {
  const renderRank = () => {
    if (user.rank === 1) {
      return <Entypo name="trophy" size={24} color="#FFD700" />;
    } else if (user.rank === 2) {
      return <Entypo name="trophy" size={24} color="#C0C0C0" />;
    } else if (user.rank === 3) {
      return <Entypo name="trophy" size={24} color="#B87333" />;
    } else {
      return (
        <Text style={{ color: "#F1EDED", fontWeight: "bold" }}>
          {user.rank}
        </Text>
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.rank}>{renderRank()}</View>
          <Image style={styles.image} source={{ uri: user.imageUrl }} />
          <Text>{`${user.firstName} ${user.lastName}`}</Text>
        </View>
        <View>
          <Text style={styles.time}>
            {user?.totalTimeFocus || "0"} Minute
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 15,
    marginHorizontal: 10,
  },
  rank: {
    width: 50,
    alignItems: "center",
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    resizeMode: "cover",
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    marginRight: 10,
  },
  time: {
    fontWeight: "bold",
    color: "#FA6408",
  },
});

export default RankingItem;
