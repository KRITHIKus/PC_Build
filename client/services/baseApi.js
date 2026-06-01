import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl:   process.env.NEXT_PUBLIC_API_URL,
    credentials:"include",
    prepareHeaders(headers) {
      return headers
    },
  }),

  tagTypes: [
    'Components',
    'Builds',
    'Recommendations',
    'Compare',
    'Learn',
    'History',
    'User',
    'Admin',
    'Pricing',
    'Media',
  ],

  // Extended in per-feature service files — never define endpoints here
  endpoints: () => ({}),
})
