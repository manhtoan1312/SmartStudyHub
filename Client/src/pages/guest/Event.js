import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { AntDesign } from "@expo/vector-icons";
import ModalAddEvent from "../../components/ModalAddEvent";
import { useIsFocused } from "@react-navigation/native";
import { getTimeLineEvent } from "../../services/Guest/EventService";
import { Modal } from "react-native";

const Event = ({ navigation }) => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

  const [eventList, setEventList] = useState({});
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(firstDayOfYear.getTime());
  const [endDate, setEndDate] = useState(lastDayOfYear.getTime());
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const countItems = (items) => {
    let dueDateCount = 0;
    let allDayCount = 0;
    if (items) {
      items.forEach(item => {
        if (item.type === 'work') {
          dueDateCount += 1;
        } else if (item.type === 'eventAllDay') {
          allDayCount += 1;
        }
      });
    }
    return { dueDateCount, allDayCount };
  };

  const selectedDateItems = eventList[selectedDate] || [];
  const { dueDateCount, allDayCount } = countItems(selectedDateItems);

  const handleModeChange =(value) => {
    setModalVisible(false)
    if(value===1){
      setAddEventVisible(true)
    }
    else{
      navigation.navigate("CreateWork")
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18 }}>Event</Text>
        <TouchableOpacity style={{position:'relative'}} onPress={() => setModalVisible(true)}>
          <AntDesign name="plus" size={24} color="gray" />
        </TouchableOpacity>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.modeItem}
              onPress={() => handleModeChange(0)}
            >
              <Text>Create Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modeItem}
              onPress={() => handleModeChange(1)}
            >
              <Text>Create Event</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      </View>
      <View style={styles.agendaContainer}>
        <Agenda
          items={eventList}
          renderItem={renderItem}
          onDayPress={handleDayPress}
        />
      </View>
      <View style={styles.details}>
        <Text>Selected Date: {selectedDate}</Text>
        <Text>Due Date Count: {dueDateCount}</Text>
        <Text>All Day Count: {allDayCount}</Text>
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
  details: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderTopColor: "#e8e8e8",
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 5,
    marginHorizontal: 10,
    top: 120,
  },
  modeItem: {
    marginVertical: 10,
    padding: 10,
  },
});

export default Event;
