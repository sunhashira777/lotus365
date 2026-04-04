import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  betDetails: {},
  betPL: 0,
  betLimits: {},
  isBetting: false,
};

const betSlice = createSlice({
  name: 'bet',
  initialState,
  reducers: {
    setBetLoading: (state, action) => {
      state.isBetting = action.payload;
    },
    setBetDetails: (state, action) => {
      state.betDetails = action.payload || {};
    },
    setBetPL: (state, action) => {
      state.betPL = action.payload;
    },
    setBetLimits: (state, action) => {
      state.betLimits = action.payload;
    },
    resetBetDetails: (state) => {
      state.betDetails = {};
    },
  },
});

export const {
  setBetLoading,
  setBetDetails,
  setBetPL,
  setBetLimits,
  resetBetDetails,
} = betSlice.actions;

export default betSlice.reducer;
