// file store.js
import { configureStore } from '@reduxjs/toolkit';
import isPlayReducer from './slices/isPlaySlice';
import focusReducer from './slices/focusSlice';

const store = configureStore({
  reducer: {
    isPlay: isPlayReducer,
    focus: focusReducer, 
  },
});

export default store;
