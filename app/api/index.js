import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// import { authSlice } from './slices/authSlice';
// import { featureFlagsSlice } from './slices/featureFlagsSlice';
// import { uiSlice } from './slices/uiSlice';

// import userReducer from './slices/userSlice';
import betReducer from './Slices/betSlice';
import triggerReducer from './Slices/triggerSlice';
// import walletReducer from './slices/walletSlice';
// import { casinoSlice } from './slices/casinoSlice';
import apiSlice from './apiSlice';
import modalReducer from '../redux/Slices/modalSlice';
export const store = configureStore({
  reducer: {
    // auth: authSlice.reducer,
    // featureFlags: featureFlagsSlice.reducer,
    // ui: uiSlice.reducer,
    modal: modalReducer,
    api: apiSlice.reducer,
    // user: userReducer,
    betPlace: betReducer,
    // wallet: walletReducer,
    trigger: triggerReducer,
    // casino: casinoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

// Export actions
// export const { toggleFeatureFlag, setFeatureFlags } = featureFlagsSlice.actions;
// export const {
//   setLoading,
//   setError,
//   clearError,
//   setNotification,
//   clearNotification,
// } = uiSlice.actions;

// export const { setToken, logout } = authSlice.actions;
// export const { launchGame, closeGame } = casinoSlice.actions;
