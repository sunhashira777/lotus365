import apiSlice from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users/me
    getUserProfile: builder.query({
      query: () => ({
        url: '/users/me',
        method: 'GET',
        params: { t: Date.now() },
      }),
      // providesTags: ['UserDetails'],
    }),

    updateUserInfo: builder.mutation({
      query: (body) => ({
        url: 'users/me',
        method: 'PATCH',
        body,
      }),
      // invalidatesTags: ['UserDetails'],
    }),

    // GET /users/me/wallets
    getUserWallets: builder.query({
      query: () => ({
        url: '/users/me/wallets',
        method: 'GET',
      }),
    }),

    // GET /contact-support
    getContactSupport: builder.query({
      query: () => ({
        url: '/contact-support',
        method: 'GET',
        params: { t: Date.now() },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserProfileQuery,
  useGetUserWalletsQuery,
  useGetContactSupportQuery,
  useUpdateUserInfoMutation,
} = userApi;
