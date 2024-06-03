import { ScrollView, View } from "react-native";
import WorkStatisticalHeader from "./WorkStatisticalHeader";
import StatisticalWorkByType from "./StatisticalWorkByType";
import StatisticalWorkByProject from "./StatisticalWorkByProject";
import StatisticWork from "./StatisticWork";

const StatisticalWork = () => {
  return (
    <ScrollView>
        <WorkStatisticalHeader />
        <StatisticalWorkByType />
        <StatisticalWorkByProject />
        {/* <StatisticWork /> */}
        <View style={{height:200}}></View>
    </ScrollView>
  );
};

export default StatisticalWork;
