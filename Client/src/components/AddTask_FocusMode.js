import { AntDesign,Feather,Ionicons } from '@expo/vector-icons';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Linking,
    ScrollView,
    Button,
  } from "react-native";
import AddTask_FM_Item from './AddTask_FM_Item';

function AddTask_FocusMode(){
    return(
        <View >
            <View>
                <View>
                    <View>
                        <Text>Today</Text>
                        <AntDesign name="caretdown" size={16} color="black" />
                    </View>
                    <View>
                    <Feather name="plus-circle" size={24} color="red" />
                    </View>
                </View>
                <View>
                    <AddTask_FM_Item item={1}/>
                </View>
                <Button>
                    <Text>Close</Text>
                </Button>
            </View>
        </View>
    )
}

export default AddTask_FocusMode