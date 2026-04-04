import { removeAuthCookie } from '@/utils/apiHandlers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('__users__isLoggedIn');

    // removed RootState typing
    const state = getState();
    const tempAuthToken = state?.auth?.tempAuthToken;

    const finalToken = token || tempAuthToken;

    if (finalToken) {
      headers.set('authorization', `Bearer ${finalToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn('Unauthorized! Logging out user...');
    removeAuthCookie();

    // optional redirect
    // if (window.location.pathname !== '/login') {
    //   window.location.href = '/login';
    // }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  tagTypes: [
    'UserDetails',
    'Auth',
    'FeatureFlags',
    'Competitions',
    'Events',
    'DepositWithdraw',
    'SystemSettings',
    'Affiliates',
    'CryptoWithdrawWallet',
    'WithdrawAccount',
    'Content',
    'Sports',
    'BooksetCalc',
    'stakeData',
  ],
  endpoints: () => ({}),
});

// Export hooks
export const {
  util: { getRunningQueriesThunk },
} = apiSlice;

export default apiSlice;
