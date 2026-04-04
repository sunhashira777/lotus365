import apiSlice from './apiSlice';

export const exposureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooksetCalc: builder.query({
      query: (params) => ({
        url: '/exposure/bookset/calculation',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
      providesTags: ['BooksetCalc'],
    }),

    getFancyProfitLoss: builder.query({
      query: (params) => ({
        url: '/exposure/profit-loss',
        method: 'GET',
        params: { ...params, t: Date.now() },
      }),
    }),
  }),
});

export const { useGetBooksetCalcQuery, useGetFancyProfitLossQuery } =
  exposureApi;
