import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { AntDesign } from "@expo/vector-icons";
import ModalAddEvent from "../../components/ModalAddEvent";
import { useIsFocused } from "@react-navigation/native";
import { getTimeLineEvent } from "../../services/Guest/EventService";

const Event = ({ navigation }) => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

  const [eventList, setEventList] = useState({});
  const [startDate, setStartDate] = useState(firstDayOfYear.getTime());
  const [endDate, setEndDate] = useState(lastDayOfYear.getTime());
  const [addEventVisible, setAddEventVisible] = useState(false);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    const response = await getTimeLineEvent(startDate, endDate);
    if (response.success) {
      const data = response.data;
      const formattedData = {};

      data.forEach(item => {
        const date = new Date(item.keyDate).toISOString().split('T')[0];
        if (!formattedData[date]) {
          formattedData[date] = [];
        }
        const allItems = [
          ...item.events.map(event => ({ ...event, type: 'event' })),
          ...item.works.map(work => ({ ...work, type: 'work' })),
          ...item.eventsAllDay.map(event => ({ ...event, type: 'eventAllDay' }))
        ];

        // Sort items: all-day items first, then by start time
        allItems.sort((a, b) => {
          if (a.type === 'eventAllDay' && b.type !== 'eventAllDay') {
            return -1;
          } else if (a.type !== 'eventAllDay' && b.type === 'eventAllDay') {
            return 1;
          } else {
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          }
        });

        formattedData[date] = allItems;
      });

      setEventList(formattedData);
    }
  };

  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = (item) => {
    if (item.type === 'event') {
      return (
        <View style={[styles.item, { backgroundColor: item.colorCode }]}>
          <Text>{item.eventName}</Text>
          <Text>{new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}</Text>
          <Text>{item.place}</Text>
        </View>
      );
    } else if (item.type === 'work') {
      return (
        <View style={[styles.item, { backgroundColor: '#f9c2ff' }]}>
          <Text>{item.workName}</Text>
          <Text>{new Date(item.dueDate).toLocaleTimeString()}</Text>
        </View>
      );
    } else if (item.type === 'eventAllDay') {
      return (
        <View style={[styles.item, { backgroundColor: item.colorCode }]}>
          <Text>{item.eventName} (All Day)</Text>
          <Text>{item.place}</Text>
        </View>
      );
    }
    return null;
  };

  const handleCloseAddEvent = () => {
    setAddEventVisible(false);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18 }}>Event</Text>
        <TouchableOpacity onPress={() => setAddEventVisible(true)}>
          <AntDesign name="plus" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.agendaContainer}>
        <Agenda
          items={eventList}
          renderItem={renderItem}
        />
      </View>
      <ModalAddEvent visible={addEventVisible} onClose={handleCloseAddEvent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  agendaContainer: {
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default Event;
