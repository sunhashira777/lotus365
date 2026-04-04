import apiSlice from './apiSlice';

export const stakeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStakeSet: builder.query({
      query: () => ({
        url: '/stakeset',
        method: 'GET',
        params: { t: Date.now() },
      }),
      providesTags: ['stakeData'],
    }),

    updateStakeSet: builder.mutation({
      query: (body) => ({
        url: '/stakeset',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['stakeData'],
    }),
  }),
});

export const { useGetStakeSetQuery, useUpdateStakeSetMutation } = stakeApi;
