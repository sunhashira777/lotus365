import apiSlice from './apiSlice';

export const betApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeBet: builder.mutation({
      query: (body) => ({
        url: '/bet/place',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BooksetCalc'],
    }),
  }),
});

export const { usePlaceBetMutation } = betApi;
