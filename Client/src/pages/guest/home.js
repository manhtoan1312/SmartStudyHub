import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
  Animated,
  TouchableOpacity,
  Linking,SafeAreaView
} from "react-native";
import { s } from "react-native-wind";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  EvilIcons,
  AntDesign,
  Feather,
  Fontisto,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageFocus from "../../components/Image_Focus";
import getRole from "../../services/RoleService";
import {
  CheckMaxProject,
  GetProjectForAddFolder,
} from "../../services/Guest/ProjectService";
import { CreateGuest, UpdateTimeLastUse } from "../../services/GuestService";
import {
  CheckMaxFolder,
  GetAllFolder,
} from "../../services/Guest/FolderService";
import FolderComponent from "../../components/FolderComponent";
import ProjectComponent from "../../components/ProjectComponent";
import { GetAllTagOfUser } from "../../services/Guest/TagService";
import TagComponent from "../../components/TagComponent";
import {
  GetWorkByType,
  GetWorkByPriority,
} from "../../services/Guest/WorkService";
export default function Home({ navigation }) {
  const [outOfDate, setOutOfDate] = useState(true);
  const [email, setEmail] = useState(null);
  const [tomorow, setTomorow] = useState(true);
  const [thisWeek, setThisWeek] = useState(true);
  const [next7Day, setnext7Day] = useState(true);
  const [highPriority, sethighPriority] = useState(true);
  const [mediumPriority, setMediumPriority] = useState(true);
  const [lowPriority, setLowPriority] = useState(true);
  const [planed, setPlaned] = useState(true);
  const [all, setAll] = useState(true);
  const [someDay, setSomeDay] = useState(true);
  const [event, setEvent] = useState(true);
  const [done, setDone] = useState(true);
  const [group, setGroup] = useState(true);
  const [rating, setRating] = useState(true);
  const [avt, setAvt] = useState(
    "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png"
  );
  const [deleted, setDeleted] = useState(true);
  const [PREMIUM, setPREMIUM] = useState(true);
  const [project, setProject] = useState([]);
  const [folder, setFolder] = useState([]);
  const [tag, setTag] = useState([]);
  const [todayTime, setTodayTime] = useState({ time: "0h 0m", pomodoro: "0" });
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const isFocused = useIsFocused();
  const [outOfDateData, setOutOfDateData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [tomorowData, setTomorrowTime] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [thisWeekData, setThisWeekData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [next7DayData, setNext7DayData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [someDayData, setSomeDayData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [allData, setAllData] = useState({ time: "0h 0m", pomodoro: "0" });
  const [taskDefaultData, setTaskDefaultData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [plannedData, setPlannedData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [lowPriorityData, setLowPriorityData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [mediumPriorityData, setMediumPriorityData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });
  const [highPriorityData, setHighPriorityData] = useState({
    time: "0h 0m",
    pomodoro: "0",
  });

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("projectData");
      const settings = await AsyncStorage.getItem("settings");
      const role = await getRole()
      const avatar = await AsyncStorage.getItem("img");
      const name = await AsyncStorage.getItem("accountName");
      let id;
      setAvt(
        avatar
          ? avatar
          : "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png"
      );
      if (settings) {
        const parsedData = JSON.parse(settings);
        setGroup(parsedData.group);
        setRating(parsedData.ratings);
      }
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setOutOfDate(parsedData.outOfDate);
        setTomorow(parsedData.tomorow);
        setThisWeek(parsedData.thisWeek);
        setnext7Day(parsedData.next7Day);
        sethighPriority(parsedData.highPriority);
        setMediumPriority(parsedData.mediumPriority);
        setLowPriority(parsedData.lowPriority);
        setPlaned(parsedData.planed);
        setAll(parsedData.all);
        setSomeDay(parsedData.someDay);
        setEvent(parsedData.event);
        setDone(parsedData.done);
        setDeleted(parsedData.deleted);
      }
      if(role) {
        id = role.id
      }
      else{
        id = await AsyncStorage.getItem('id')
        
      }
      if (name) {
        setEmail(name);
      } else {
        getRole().then((role) => {
          if (role) {
            setEmail(role.name);
            const setName = async () => {
              await AsyncStorage.setItem("accountName", role.name);
            };
            setName();
          }
          else{
            setEmail('')
          }
        });
      }
      if (!id) {
        const fetchDataId = async () => {
          const rs = await CreateGuest();
          if (!rs?.success) {
            Alert.alert("Creating id error", rs.message);
          }
        };
        fetchDataId();
      } else {
        console.log(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchDataFPT();
      return () => {
        setEmail(null);
      };
    }, [])
  );

  useEffect(() => {
    const fetchDataOnFocus = async () => {
      if (isFocused) {
        await fetchData();
      }
    };
    fetchDataOnFocus();
  }, [isFocused]);
  const convertMinutesToHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const fetchDataFPT = async () => {
    const role = await getRole();
let id;
if(role) {
        id = role.id
      }
      else{
        id = await AsyncStorage.getItem('id')
      }
    if (id) {
      try {
        const [
          rsFolder,
          rsProject,
          rsTag,
          rsToday,
          rsOutOfDate,
          rsTomorrow,
          rsThisWeek,
          rsNext7Day,
          rsSomeDay,
          rsAll,
          rsTaskDefault,
          rsPlanned,
          rsLowPriority,
          rsMediumPriority,
          rsHighPriority,
        ] = await Promise.all([
          GetAllFolder(id),
          GetProjectForAddFolder(id),
          GetAllTagOfUser(id),
          GetWorkByType("TODAY", id),
          outOfDate && GetWorkByType("OUTOFDATE", id),
          tomorow && GetWorkByType("TOMORROW", id),
          thisWeek && GetWorkByType("THISWEEK", id),
          next7Day && GetWorkByType("NEXT7DAY", id),
          someDay && GetWorkByType("SOMEDAY", id),
          all && GetWorkByType("ALL", id),
          GetWorkByType("TASK_DEFAULT", id),
          planed && GetWorkByType("PLANNED", id),
          lowPriority && GetWorkByPriority("LOW", id),
          mediumPriority && GetWorkByPriority("NORMAL", id),
          highPriority && GetWorkByPriority("HIGH", id),
        ]);
        if (rsToday?.success) {
          setTodayTime({
            time: convertMinutesToHoursAndMinutes(rsToday.data.totalTimeWork),
            pomodoro: rsToday.data.totalWorkActive,
          });
        }

        if (rsOutOfDate?.success) {
          setOutOfDateData({
            time: convertMinutesToHoursAndMinutes(
              rsOutOfDate.data.totalTimeWork
            ),
            pomodoro: rsOutOfDate.data.totalWorkActive,
          });
        }

        if (rsTomorrow?.success) {
          setTomorrowTime({
            time: convertMinutesToHoursAndMinutes(
              rsTomorrow.data.totalTimeWork
            ),
            pomodoro: rsTomorrow.data.totalWorkActive,
          });
        }
        if (rsThisWeek?.success) {
          setThisWeekData({
            time: convertMinutesToHoursAndMinutes(
              rsThisWeek.data.totalTimeWork
            ),
            pomodoro: rsThisWeek.data.totalWorkActive,
          });
        }
        if (rsNext7Day?.success) {
          setNext7DayData({
            time: convertMinutesToHoursAndMinutes(
              rsNext7Day.data.totalTimeWork
            ),
            pomodoro: rsNext7Day.data.totalWorkActive,
          });
        }

        if (rsSomeDay?.success) {
          setSomeDayData({
            time: convertMinutesToHoursAndMinutes(rsSomeDay.data.totalTimeWork),
            pomodoro: rsSomeDay.data.totalWorkActive,
          });
        }

        if (rsAll?.success) {
          setAllData({
            time: convertMinutesToHoursAndMinutes(rsAll.data.totalTimeWork),
            pomodoro: rsAll.data.totalWorkActive,
          });
        }
        if (rsTaskDefault?.success) {
          setTaskDefaultData({
            time: convertMinutesToHoursAndMinutes(
              rsTaskDefault.data.totalTimeWork
            ),
            pomodoro: rsTaskDefault.data.totalWorkActive,
          });
          if (rsPlanned?.success) {
            setPlannedData({
              time: convertMinutesToHoursAndMinutes(
                rsPlanned.data.totalTimeWork
              ),
              pomodoro: rsPlanned.data.totalWorkActive,
            });
          }
          if (rsLowPriority?.success) {
            setLowPriorityData({
              time: convertMinutesToHoursAndMinutes(
                rsLowPriority.data.totalTimeWork
              ),
              pomodoro: rsLowPriority.data.totalWorkActive,
            });
          }
          if (rsMediumPriority?.success) {
            setMediumPriorityData({
              time: convertMinutesToHoursAndMinutes(
                rsMediumPriority.data.totalTimeWork
              ),
              pomodoro: rsMediumPriority.data.totalWorkActive,
            });
          }
          if (rsHighPriority?.success) {
            setHighPriorityData({
              time: convertMinutesToHoursAndMinutes(
                rsHighPriority.data.totalTimeWork
              ),
              pomodoro: rsHighPriority.data.totalWorkActive,
            });
          }
          if (!rsFolder?.success) {
            setFolder(null);
          } else {
            setFolder(rsFolder.data);
          }
          if (rsProject?.success) {
            setProject(rsProject.data);
          } else {
            setProject(null);
          }
          if (rsTag?.success) {
            setTag(rsTag.data);
          }
          else{
            setTag(null)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const reload = () => {
    fetchDataFPT();
  };

  const handleAddProject = async () => {
    const role = await getRole();
let id;
if(role) {
        id = role.id
      }
      else{
        id = await AsyncStorage.getItem('id')
      }
    const rs = await CheckMaxProject(id);
    if (rs?.success) {
      if (rs.isMax) {
        navigation.navigate("PREMIUM");
      } else {
        navigation.navigate("AddProject");
      }
    } else {
      Alert.alert("Error", rs.message);
    }
  };

  const handleAddFolder = async () => {
    const role = await getRole();
let id;
if(role) {
        id = role.id
      }
      else{
        id = await AsyncStorage.getItem('id')
      }
    const rs = await CheckMaxFolder(id);
    if (rs?.success) {
      if (rs.isMax) {
        navigation.navigate("PREMIUM");
      } else {
        navigation.navigate("AddFolder");
      }
    } else {
      Alert.alert("Error", rs.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollY._value <= -50) {
        reload();
        setShowSearchBar(true);
      }
    };

    const scrollListener = scrollY.addListener(handleScroll);

    return () => {
      scrollY.removeListener(scrollListener);
    };
  }, [scrollY]);

  return (
    <View style={s`h-full bg-white`}>
      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View>
          <View style={styles.headers}>
            <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
              <ImageBackground
                style={styles.avt}
                resizeMode="cover"
                source={{ uri: avt }}
              ></ImageBackground>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                color: email ? "black" : "red",
              }}
              onPress={() => navigation.navigate("Setting")}
            >
              {email ? email : "Login"}
            </Text>
            <TouchableOpacity onPress={() => {navigation.navigate('PREMIUM')}}>
              <FontAwesome5
                name="crown"
                style={styles.itemRow}
                size={20}
                color="#FFD300"
              />
            </TouchableOpacity>
            {group && (
              <MaterialCommunityIcons
                name="account-group-outline"
                style={styles.itemRow}
                size={20}
                color="black"
              />
            )}
            {rating && (
              <TouchableOpacity onPress={() => navigation.navigate("Ranking")}>
                <EvilIcons
                  name="trophy"
                  style={styles.itemRow}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            )}
            <AntDesign
              name="barschart"
              style={styles.itemRow}
              size={20}
              color="black"
            />
          </View>
        </View>
        <View style={styles.searchContainer}>
          {showSearchBar && (
            <TouchableOpacity onPress={() => navigation.navigate("SearchWork")}>
              <View style={styles.searchBar}>
                <FontAwesome name="search" size={20} color="#666666" />
                <Text style={styles.searchText}>Search...</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Today")}
            style={styles.headers}
          >
            <View style={styles.row}>
              <Feather
                name="sun"
                style={styles.itemRow}
                size={20}
                color="#21D375"
              />
              <Text>Today</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.itemRow}>{todayTime.time}</Text>
              <Text>{todayTime.pomodoro}</Text>
            </View>
          </TouchableOpacity>
          {outOfDate && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("OutOfDate")}
            >
              <View style={styles.row}>
                <MaterialIcons
                  style={styles.itemRow}
                  name="assignment-late"
                  size={20}
                  color="red"
                />
                <Text>Out of Date</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{outOfDateData.time}</Text>
                <Text>{outOfDateData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {tomorow && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("Tomorror")}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="weather-sunset"
                  style={styles.itemRow}
                  size={20}
                  color="orange"
                />
                <Text>Tomorrow</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{tomorowData.time}</Text>
                <Text>{tomorowData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {thisWeek && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("ThisWeek")}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-range-outline"
                  style={styles.itemRow}
                  size={20}
                  color="purple"
                />
                <Text>This Week</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{thisWeekData.time}</Text>
                <Text>{thisWeekData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {next7Day && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("Next7Day")}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  style={styles.itemRow}
                  size={20}
                  color="#32CD32"
                />
                <Text>The next 7 days</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{next7DayData.time}</Text>
                <Text>{next7DayData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {highPriority && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("High")}
            >
              <View style={styles.row}>
                <Fontisto
                  name="flag"
                  style={styles.itemRow}
                  size={20}
                  color="red"
                />
                <Text>High Priority</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{highPriorityData.time}</Text>
                <Text>{highPriorityData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {mediumPriority && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("Medium")}
            >
              <View style={styles.row}>
                <Fontisto
                  name="flag"
                  style={styles.itemRow}
                  size={20}
                  color="orange"
                />
                <Text>Normal Priority</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{mediumPriorityData.time}</Text>
                <Text>{mediumPriorityData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {lowPriority && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("Low")}
            >
              <View style={styles.row}>
                <Fontisto
                  name="flag"
                  style={styles.itemRow}
                  size={20}
                  color="#00FF7F"
                />
                <Text>Low Priority</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{lowPriorityData.time}</Text>
                <Text>{lowPriorityData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {planed && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("Planned")}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-check-outline"
                  style={styles.itemRow}
                  size={20}
                  color="#87CEFA"
                />
                <Text>Planned</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{plannedData.time}</Text>
                <Text>{plannedData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {all && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("All")}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="select-all"
                  style={styles.itemRow}
                  size={20}
                  color="orange"
                />
                <Text>All</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{allData.time}</Text>
                <Text>{allData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          {someDay && (
            <TouchableOpacity
              style={styles.headers}
              onPress={() => navigation.navigate("SomeDay")}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="calendar-text-outline"
                  style={styles.itemRow}
                  size={20}
                  color="purple"
                />
                <Text>Some day</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.itemRow}>{someDayData.time}</Text>
                <Text>{someDayData.pomodoro}</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.headers}
            onPress={() => navigation.navigate("Task")}
          >
            <View style={styles.row}>
              <FontAwesome
                name="tasks"
                style={styles.itemRow}
                size={20}
                color="#87CEFA"
              />
              <Text>Task</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.itemRow}>{taskDefaultData.time}</Text>
              <Text>{taskDefaultData.pomodoro}</Text>
            </View>
          </TouchableOpacity>
          {/* {event && (
            <View style={styles.headers}>
              <View style={styles.row}>
                <MaterialIcons
                  name="event"
                  style={styles.itemRow}
                  size={20}
                  color="#32CD32"
                />
                <Text>Event</Text>
              </View>
            </View>
          )} */}
          {done && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Done")}
              style={styles.headers}
            >
              <View style={styles.row}>
                <AntDesign name="checkcircleo" size={20} color="gray" />
                <Text> Done</Text>
              </View>
            </TouchableOpacity>
          )}
          {deleted && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Deleted")}
              style={styles.headers}
            >
              <View style={styles.row}>
                <EvilIcons name="trash" size={24} color="red" />
                <Text>Deleted</Text>
              </View>
            </TouchableOpacity>
          )}

          {folder &&
            folder.map((folderItem) => (
              <FolderComponent
                key={folderItem.id}
                folderName={folderItem.folderName}
                colorCode={folderItem.colorCode}
                listProjects={folderItem.listProjectActive}
                id={folderItem.id}
                reload={reload}
              />
            ))}

          {project &&
            project.map((projectItem) => (
              <ProjectComponent
                key={projectItem.id}
                projectName={projectItem.projectName}
                colorCode={projectItem.colorCode}
                id={projectItem.id}
                totalTimeWork={projectItem.totalTimeWork}
                TotalWorkActive={projectItem.totalWorkActive}
                reload={reload}
              />
            ))}
          {tag &&
            tag.map((tagItem) => (
              <TagComponent
                key={tagItem.id}
                tagName={tagItem.tagName}
                colorCode={tagItem.colorCode}
                id={tagItem.id}
                totalTimeWork={tagItem.totalTimeWork}
                TotalWorkActive={tagItem.totalWorkActive}
                reload={reload}
              />
            ))}
          <TouchableOpacity onPress={() => handleAddProject()} style={styles.headers}>
            <View style={styles.row}>
              <AntDesign
                name="plus"
                style={styles.itemRow}
                size={20}
                color="red"
                onPress={() => handleAddProject()}
              />
              <Text style={{ color: "red" }} onPress={() => handleAddProject()}>
                Add a Project
              </Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={{ paddingHorizontal: 10, }}
                onPress={() => navigation.navigate("AddTag")}
              >
                <MaterialCommunityIcons
                  name="tag-plus-outline"
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingHorizontal: 10,  }}
                onPress={() => handleAddFolder()}
              >
                <AntDesign name="addfolder" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ImageFocus />
    </View>
  );
}

const styles = StyleSheet.create({
  avt: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  headers: {
    marginHorizontal: 10,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    marginTop: 10,
  },
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  preavt: {
    position: "absolute",
    width: 15,
    height: 15,
    bottom: -10,
    right: -10,
    borderRadius: 10,
    backgroundColor: "#676767",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemRow: {
    marginRight: 5,
  },
  searchContainer: {},
  searchBar: {
    backgroundColor: "#F2F2F2",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  searchText: {
    color: "#666666",
    paddingLeft: 10,
  },
});