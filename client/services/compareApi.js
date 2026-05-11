import { baseApi } from './baseApi'

export const compareApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // POST /compare/public
    comparePublicBuilds: build.mutation({
      query: (buildIds) => ({
        url:    '/compare/public',
        method: 'POST',
        body:   { buildIds },
      }),
    }),
    compareHybridBuilds: build.mutation({
      query: ({ base, buildIds }) => ({
        url: '/compare/hybrid',
        method: 'POST',
        body: { base, buildIds },
      }),
    }),

  }),
  overrideExisting: false,
})

export const { useComparePublicBuildsMutation, useCompareHybridBuildsMutation } = compareApi