// file slices/isPlaySlice.js
import { createSlice } from '@reduxjs/toolkit';

const isPlaySlice = createSlice({
  name: 'isPlay',
  initialState: {
    value: false,
  },
  reducers: {
    setIsPlay: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setIsPlay } = isPlaySlice.actions;
export default isPlaySlice.reducer;
  