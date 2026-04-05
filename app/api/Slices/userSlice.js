import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../userApi';

const initialState = {
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUserProfile.matchFulfilled,
      (state, action) => {
        state.profile = action.payload;
      },
    );
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
