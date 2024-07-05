import { View } from "react-native";
import PomodoroHeader from "./PomodoroHeader";
import StatisticByMonth from "./StatisticByMonth";
import StatisticPomodoro from "./StatisticPomodoro";
import { ScrollView } from "react-native-gesture-handler";

const StatisticalPomodoro = () => {
  return (
    <ScrollView>
      <PomodoroHeader />
      <StatisticByMonth />
      <StatisticPomodoro />
      <View style={{ height: 200 }}></View>
    </ScrollView>
  );
};

export default StatisticalPomodoro;
