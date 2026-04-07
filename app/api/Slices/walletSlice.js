import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../userApi';

const initialState = {
  mainBalance: 0,
  bonusBalance: 0,
  exposure: 0,
  lockedAmount: 0,
  withdrawableBalance: 0,
  depositBalance: 0,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWallet: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUserWallets.matchFulfilled,
      (state, action) => {
        const payload = action.payload;

        const balance = {
          mainBalance: 0,
          bonusBalance: 0,
          exposure: 0,
          lockedAmount: 0,
          withdrawableBalance: 0,
          depositBalance: 0,
        };

        if (Array.isArray(payload)) {
          payload.forEach((w) => {
            const type = w?.type ? w.type.toLowerCase() : '';

            if (type === 'main') {
              balance.mainBalance = Number(w.amount || 0);
              balance.exposure = Number(w.exposureAmount || 0);
              balance.lockedAmount = Number(w.lockedAmount || 0);
              balance.withdrawableBalance = Number(w.withdrawableBalance || 0);
              balance.depositBalance = Number(w.depositBalance || 0);
            } else if (type === 'bonus') {
              balance.bonusBalance = Number(w.amount || 0);
            }
          });
        }

        return balance;
      },
    );
  },
});

export const { resetWallet } = walletSlice.actions;
export default walletSlice.reducer;
