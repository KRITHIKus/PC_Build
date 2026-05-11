  // services/pricingApi.js
  import { baseApi } from './baseApi'

  export const pricingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      createPricing: builder.mutation({
        query: (data) => ({
          url: '/pricing',
          method: 'POST',
          body: data,
        }),
      }),

    getLatestPrice: builder.query({
    query: ({ componentId, region = 'India' }) =>
      `/pricing/component/${componentId}/latest?region=${encodeURIComponent(region)}`,
  }),

      getPricingHistory: builder.query({
    query: ({ componentId, page = 1, limit = 10, region }) =>
      `/pricing/component/${componentId}/history?page=${page}&limit=${limit}&region=${encodeURIComponent(region)}`,
  }),

    
    }),
  })

  export const {
    useCreatePricingMutation,
    useGetLatestPriceQuery,
    useGetPricingHistoryQuery,
  
  } = pricingApi