import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
function AddTask_FM_Item({ item }) {
  return (
    <View>
      <View>
        <Text>{item.name}</Text>
        <View style={styles.timerIcons}>
          {[...Array(item.Procount)].map((_, index) => (
            <MaterialCommunityIcons
              key={index}
              name="timer"
              size={14}
              color="pink"
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    timerIcons:{

    }
})

export default AddTask_FM_Item;
