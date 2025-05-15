import React from 'react';
import { AntDesign, Entypo } from "@expo/vector-icons";
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import WorkActive from "../../components/WorkActive";

const WorkDueDate = ({ route, navigation }) => {
    const { day, detail } = route.params;

    const renderDate = (date) => {
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.dateText}>{renderDate(day)}</Text>
                <Entypo name="dots-two-horizontal" size={24} color="white" />
            </View>
            <View style={{paddingTop:20}}>
                <View style={styles.textBody}><Text style={styles.text}>List Work Due Date</Text></View>
                <FlatList
                    contentContainerStyle={styles.list}
                    data={detail?.worksDueDate}
                    renderItem={({ item }) => (
                        <WorkActive
                            workItem={item}
                            reload={() => navigation.goBack()}
                            navigation={navigation}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff',
        elevation: 3, // Adds shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    list: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    textBody:{
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10
    },
    text:{
        fontSize:20,
        fontWeight:700
    }
});

export default WorkDueDate;
