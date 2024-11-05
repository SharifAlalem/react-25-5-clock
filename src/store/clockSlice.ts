import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ClockState = {
    breakLength: number;
    sessionLength: number;
    minutes: number;
    seconds: number;
};

const initialState: ClockState = {
    breakLength: 5,
    sessionLength: 25,
    minutes: 25,
    seconds: 0
};

const clockSlice = createSlice({
  name: 'clock',
  initialState,
  reducers: {
    incrementBreakLength: (state) => {
      if(state.breakLength != 60)
        state.breakLength! += 1;
    },
    decrementBreakLength: (state) => {
      if(state.breakLength != 1)
        state.breakLength! -= 1;
    },
    incrementSessionLength: (state) => {
      if(state.sessionLength != 60){
        state.sessionLength! += 1;
        state.minutes = state.sessionLength;
      } 
    },
    decrementSessionLength: (state) => {
      if(state.sessionLength != 1){
        state.sessionLength! -= 1;
        state.minutes = state.sessionLength;
      }
    },
    setBreakLength: (state, action: PayloadAction<number>) => {
      state.breakLength = action.payload;
    },
    setSessionLength: (state, action: PayloadAction<number>) => {
      state.sessionLength = action.payload;
    },
    setMinutes: (state, action: PayloadAction<number>) => {
      if(state.minutes >= 0){
        state.minutes = action.payload;
      }
    },
    setSeconds: (state, action: PayloadAction<number>) => {
      if(state.seconds >= 0){
        state.seconds = action.payload;
      }
    },
  },
});

export const { incrementBreakLength, decrementBreakLength, setBreakLength, incrementSessionLength, decrementSessionLength, setSessionLength,setMinutes,setSeconds } = clockSlice.actions;
export default clockSlice.reducer;
