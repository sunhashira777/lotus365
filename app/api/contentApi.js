import apiSlice from './apiSlice';

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: (params = {}) => ({
        url: '/banners',
        method: 'GET',
        params,
      }),
      providesTags: ['Content'],
    }),

    getNotifications: builder.query({
      query: (params = {}) => ({
        url: '/notifications',
        method: 'GET',
        params,
      }),
      providesTags: ['Content'],
    }),
  }),
});

export const { useGetBannersQuery, useGetNotificationsQuery } = contentApi;
