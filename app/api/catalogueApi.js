import apiSlice from './apiSlice';

export const catalogueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogueByEventId: builder.query({
      query: ({ eventId, sport, search, inplay, matchTime }) => {
        const params = new URLSearchParams();

        if (sport) params.append('sport', sport);
        if (search) params.append('search', search);
        if (inplay) params.append('inplay', inplay);
        if (matchTime) params.append('matchTime', matchTime);

        const queryString = params.toString();

        return {
          url: `/catalogue/${eventId}${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const { useGetCatalogueByEventIdQuery } = catalogueApi;
