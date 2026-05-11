import { baseApi } from './baseApi'

export const buildLabApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // POST /compatibility/check
    checkCompatibility: build.mutation({
      query: (body) => ({
        url:    '/compatibility/check',
        method: 'POST',
        body,
      }),
    }),

    // POST /builds/scratch
    createBuildFromScratch: build.mutation({
      query: (body) => ({
        url:    '/builds/scratch',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Builds', id: 'FEATURED' }],
    }),

  }),
  overrideExisting: false,
})

export const {
  useCheckCompatibilityMutation,
  useCreateBuildFromScratchMutation,
} = buildLabApi