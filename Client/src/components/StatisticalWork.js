import { ScrollView, View } from "react-native";
import WorkStatisticalHeader from "./WorkStatisticalHeader";
import StatisticalWorkByType from "./StatisticalWorkByType";
import StatisticalWorkByProject from "./StatisticalWorkByProject";

const StatisticalWork = () => {
  return (
    <ScrollView>
        <WorkStatisticalHeader />
        <StatisticalWorkByType />
        <StatisticalWorkByProject />
        <View style={{height:200}}></View>
    </ScrollView>
  );
};

export default StatisticalWork;
