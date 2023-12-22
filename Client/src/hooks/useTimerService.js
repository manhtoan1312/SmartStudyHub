// useTimerService.js
import { useCallback, useState } from "react";
import TimerService from "../services/TimerService";
import { useFocusEffect } from "@react-navigation/native";
const useTimerService = () => {
  const [timerService] = useState(new TimerService());

  useFocusEffect(
    useCallback(() => {
      timerService.toggleTimer();
      return () => {
        timerService.stopTimer();
      };
    }, [timerService])
  );
  return timerService;
};

export default useTimerService;
