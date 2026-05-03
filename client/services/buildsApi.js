import { baseApi } from './baseApi'

export const buildsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFeaturedBuilds: build.query({
      query: ({ page = 1, limit = 20 } = {}) => {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', String(limit))

        return `/builds/featured?${params.toString()}`
      },
      providesTags: [{ type: 'Builds', id: 'FEATURED' }],
    }),

    getFeaturedBuildById: build.query({
      query: (id) => `/builds/featured/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Builds', id },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetFeaturedBuildsQuery,
  useGetFeaturedBuildByIdQuery,
} = buildsApi