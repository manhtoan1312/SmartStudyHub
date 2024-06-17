// file slices/focusSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isStop: true,
  isPause: true,
  workName: null,
  secondsLeft: 25 * 60,
  mode: "-",
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  breakAfter: 4,
  autoStartPo: false,
  autoStartBreak: false,
  disableBreakTime: false,
  type: null,
  startTime: 0,
  workMode: 'work',
  workId: null,
  extraWorkId: null,
  countWork: 0,
  extraWorkName: null,
  defaultTimePomodoro: 25,
  numberOfPomodoro: 0,
  numberOfPomodorosDone: 0
};

const focusSlice = createSlice({
  name: "focus",
  initialState,
  reducers: {
    setFocus: (state, action) => {
      const {
        isStop,
        isPause,
        workName,
        secondsLeft,
        mode,
        pomodoroTime,
        shortBreakTime,
        longBreakTime,
        breakAfter,
        autoStartPo,
        autoStartBreak,
        disableBreakTime,
        type,
        startTime,
        workMode,
        workId,
        extraWorkId,
        countWork,
        extraWorkName,
        defaultTimePomodoro,
        numberOfPomodoro,
        numberOfPomodorosDone,
      } = action.payload;
      state.isStop = isStop !== undefined ? isStop : state.isStop;
      state.isPause = isPause !== undefined ? isPause : state.isPause;
      state.workName = workName !== undefined ? workName : state.workName;
      state.secondsLeft = secondsLeft !== undefined ? secondsLeft : state.secondsLeft;
      state.mode = mode !== undefined ? mode : state.mode;
      state.pomodoroTime = pomodoroTime !== undefined ? pomodoroTime : state.pomodoroTime;
      state.shortBreakTime = shortBreakTime !== undefined ? shortBreakTime : state.shortBreakTime;
      state.longBreakTime = longBreakTime !== undefined ? longBreakTime : state.longBreakTime;
      state.breakAfter = breakAfter !== undefined ? breakAfter : state.breakAfter;
      state.autoStartPo = autoStartPo !== undefined ? autoStartPo : state.autoStartPo;
      state.autoStartBreak = autoStartBreak !== undefined ? autoStartBreak : state.autoStartBreak;
      state.disableBreakTime = disableBreakTime !== undefined ? disableBreakTime : state.disableBreakTime;
      state.type = type !== undefined ? type : state.type;
      state.startTime = startTime !== undefined ? startTime : state.startTime;
      state.workMode = workMode !== undefined ? workMode : state.workMode;
      state.workId = workId !== undefined ? workId : state.workId;
      state.extraWorkId = extraWorkId !== undefined ? extraWorkId : state.extraWorkId;
      state.countWork = countWork !== undefined ? countWork : state.countWork;
      state.extraWorkName = extraWorkName !== undefined ? extraWorkName : state.extraWorkName;
      state.defaultTimePomodoro = defaultTimePomodoro !== undefined ? defaultTimePomodoro : state.defaultTimePomodoro;
      state.numberOfPomodoro = numberOfPomodoro !== undefined ? numberOfPomodoro : state.numberOfPomodoro;
      state.numberOfPomodorosDone = numberOfPomodorosDone !== undefined ? numberOfPomodorosDone : state.numberOfPomodorosDone;
    },
    resetFocus: () => initialState, 
  },
});

export const { setFocus, resetFocus } = focusSlice.actions;
export default focusSlice.reducer;
