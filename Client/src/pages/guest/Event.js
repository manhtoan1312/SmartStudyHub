import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Agenda } from "react-native-calendars";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import ModalAddEvent from "../../components/ModalAddEvent";
import { useIsFocused } from "@react-navigation/native";
import {
  deleteEvent,
  getTimeLineEvent,
} from "../../services/Guest/EventService";
import { Modal } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { DeleteWork } from "../../services/Guest/WorkService";

const Event = ({ navigation }) => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

  const [eventList, setEventList] = useState({});
  const [dateDetail, setDateDetail] = useState({});
  const [selectedDate, setSelectedDate] = useState(formatTime(today));
  const [startDate, setStartDate] = useState(firstDayOfYear.getTime());
  const [endDate, setEndDate] = useState(lastDayOfYear.getTime());
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const swipeableRef = useRef(null);

  const fetchData = async () => {
    setEventList({});
    const response = await getTimeLineEvent(startDate, endDate);
    if (response.success) {
      const data = response.data;
      const formattedData = {};
      const someDetail = {};
      data.forEach((item) => {
        const date = formatTime(item.keyDate);
        if (!formattedData[date]) {
          formattedData[date] = [];
          someDetail[date] = {};
        }
        const allItems = [
          ...item.events.map((event) => ({ ...event, type: "event" })),
          ...item.works.map((work) => ({ ...work, type: "work" })),
          ...item.eventsAllDay.map((event) => ({
            ...event,
            type: "eventAllDay",
          })),
        ];
        allItems.sort((a, b) => {
          if (a.type === "eventAllDay" && b.type !== "eventAllDay") {
            return -1;
          } else if (a.type !== "eventAllDay" && b.type === "eventAllDay") {
            return 1;
          } else {
            return (
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            );
          }
        });

        formattedData[date] = allItems;
        someDetail[date] = {
          eventsAllDay: [...item.eventsAllDay],
          worksDueDate: [...item.worksDueDate],
          totalWorksDueDate: item.totalWorksDueDate,
        };
      });
      setDateDetail(someDetail);
      setEventList(formattedData);
    }
  };

  function formatTime(date) {
    let today = new Date(date);
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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

  const deleteItem = (item) => {
    Alert.alert("Confirm Action", "Do you wanna delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          if (swipeableRef.current) {
            swipeableRef.current.close();
          }
        },
      },
      { text: "OK", onPress: () => handleConfirmDelete(item) },
    ]);
  };

  const handleConfirmDelete = async (item) => {
    let response = null;
    if (item.type === "work") {
      response = await DeleteWork(item.id);
    } else {
      response = await deleteEvent(item.id);
    }
    if (response.success) {
      Alert.alert("Delete item successfully!");
      fetchData();
    } else {
      Alert.alert("Error when deleting item!", response.message);
    }
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const renderRightActions = (progress, dragX, item) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item)}
      >
        <AntDesign name="delete" size={24} color="#676767" />
      </TouchableOpacity>
    );
  };

  const renderItem = (item) => {
    if (item?.type === "work") {
      return (
        <Swipeable
          ref={swipeableRef}
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item)
          }
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateWork", { id: item.id })}
          >
            <View style={[styles.item, { backgroundColor: "#f9c2ff" }]}>
              <View style={{ flexDirection: "row" }}>
                {item?.status === "COMPLETED" ? (
                  <MaterialIcons
                    name="task"
                    style={{ paddingRight: 5 }}
                    size={20}
                    color="black"
                  />
                ) : (
                  <AntDesign name="filetext1" size={18} color="black" />
                )}
                <Text> {item.workName}</Text>
              </View>

              <Text>{new Date(item.dueDate).toLocaleTimeString()}</Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    }
    const renderIcon = (name, color) => (
      <FontAwesome5 name={name} size={16} color={color} style={styles.icon} />
    );

    const renderIsPresentIcon = item.isPresent
      ? renderIcon("check-circle", "black")
      : null;

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("EventDetail", { id: item.id })}
        >
          <View style={[styles.item, { backgroundColor: item.colorCode }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="event"
                size={20}
                style={{ paddingRight: 5 }}
                color="black"
              />
              <Text style={styles.eventName}>
                {item.eventName}{" "}
                {item.nowDateOutOfTotalDays &&
                  `(Day ${item.nowDateOutOfTotalDays}/${item.totalDays})`}
              </Text>
            </View>
            {!item.nowDateOutOfTotalDays && (
              <Text style={styles.eventTime}>
                {new Date(item.startTime).toLocaleTimeString()} -{" "}
                {new Date(item.endTime).toLocaleTimeString()}
              </Text>
            )}
            {item.place !== "" && (
              <Text style={styles.eventPlace}>Place: {item.place}</Text>
            )}
            {item.descriptions !== "" && (
              <Text style={styles.eventDescription}>
                Description: {item.descriptions}
              </Text>
            )}
            <View style={styles.iconsContainer}>{renderIsPresentIcon}</View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const handleCloseAddEvent = () => {
    setAddEventVisible(false);
    fetchData();
  };

  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
  };

  const renderDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}`;
  };
  const handleModeChange = (value) => {
    setModalVisible(false);
    if (value === 1) {
      setAddEventVisible(true);
    } else {
      navigation.navigate("CreateWork");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18 }}>Event</Text>
        <TouchableOpacity
          style={{ position: "relative" }}
          onPress={() => setModalVisible(true)}
        >
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
          onDayChange={handleDayPress}
        />
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("WorkDueDate", {
            detail: dateDetail[selectedDate],
            day: selectedDate,
          })
        }
        style={styles.details}
      >
        <View style={styles.detailsDay}>
          <Text style={{ color: "white", fontSize: 12 }}>
            {renderDate(selectedDate)}
          </Text>
        </View>
        <View style={styles.detailsDay2}>
          <View style={styles.dueDateContainer}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.dueDateIcon}>
                <AntDesign name="eyeo" size={20} color="white" />
              </View>
              <Text style={styles.dueDateText}>
                There are {dateDetail[selectedDate]?.totalWorksDueDate} work due
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
    flexDirection: "row",
  },
  item: {
    backgroundColor: "white",
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
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    marginLeft: 5,
    fontSize: 14,
    color: "gray",
  },
  modeItem: {
    marginVertical: 10,
    padding: 10,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    marginTop: 15,
  },
  detailsDay: {
    backgroundColor: "#2AC1FE",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  detailsDay2: {
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dueDateContainer: {
    backgroundColor: "#1E8AB6",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  dueDateIcon: {
    borderRadius: 10,
    borderBlockColor: "white",
    borderColor: "white",
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dueDateText: {
    color: "white",
  },
});

export default Event;
