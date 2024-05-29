import { View } from "react-native";
import WorkStatisticalHeader from "./WorkStatisticalHeader";
import StatisticalWorkByType from "./StatisticalWorkByType";

const StatisticalWork = () => {
  return (
    <View>
      <WorkStatisticalHeader />
      <StatisticalWorkByType />
    </View>
  );
};

export default StatisticalWork;
