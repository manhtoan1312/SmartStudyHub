import { View } from "react-native";
import PomodoroHeader from "./PomodoroHeader";
import StatisticByMonth from "./StatisticByMonth";

const StatisticalPomodoro = () => {
  return (
    <View>
      <PomodoroHeader />
      <StatisticByMonth />
    </View>
  );
};

export default StatisticalPomodoro;
