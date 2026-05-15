import { baseApi } from './baseApi'

export const buildsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // USER BUILDS
    getMyBuilds: build.query({
      query: ({ page = 1, limit = 20, journeyStatus, isFavorite, isDreamBuild } = {}) => {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', String(limit))
        if (journeyStatus) params.set('journeyStatus', journeyStatus)
        if (isFavorite) params.set('isFavorite', isFavorite)
        if (isDreamBuild) params.set('isDreamBuild', isDreamBuild)
        return `/builds?${params.toString()}`
      },
      providesTags: (result = {}) => {
  const { builds = [] } = result;
  return [...builds.map(({ _id }) => ({ type: 'Builds', id: _id })), { type: 'Builds', id: 'LIST' }];
}
    }),

    getBuildById: build.query({
      query: (id) => `/builds/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Builds', id }],
    }),

    // UPDATE OPERATIONS
    updateBuildMeta: build.mutation({
      query: ({ id, updates }) => ({
        url: `/builds/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Builds', id }],
    }),

    updateBuildParts: build.mutation({
      query: ({ id, parts }) => ({
        url: `/builds/${id}/parts`,
        method: 'PATCH',
        body: { parts },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Builds', id }],
    }),

    renameBuild: build.mutation({
      query: ({ id, title }) => ({
        url: `/builds/${id}/rename`,
        method: 'PATCH',
        body: { title },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Builds', id }],
    }),

    toggleFavorite: build.mutation({
      query: ({ id, isFavorite, isDreamBuild }) => ({
        url: `/builds/${id}/favorite`,
        method: 'PATCH',
        body: { isFavorite, isDreamBuild },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Builds', id }],
    }),

    updateJourneyStatus: build.mutation({
      query: ({ id, journeyStatus }) => ({
        url: `/builds/${id}/journey-status`,
        method: 'PATCH',
        body: { journeyStatus },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Builds', id }],
    }),

    duplicateBuild: build.mutation({
      query: (id) => ({
        url: `/builds/${id}/duplicate`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Builds', id: 'LIST' }],
    }),

    deleteBuild: build.mutation({
      query: (id) => ({
        url: `/builds/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Builds', id }, { type: 'Builds', id: 'LIST' }],
    }),

    toggleFeatured: build.mutation({
      query: ({ id, isFeatured }) => ({
        url: `/builds/isfeature/${id}`,
        method: 'PATCH',
        body: { isFeatured },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Builds', id }, { type: 'Builds', id: 'FEATURED' }],
    }),

    // FEATURED BUILDS
    getFeaturedBuilds: build.query({
      query: ({ page = 1, limit = 12 } = {}) => {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', String(limit))
        return `/builds/featured?${params.toString()}`
      },
      providesTags: [{ type: 'Builds', id: 'FEATURED' }],
    }),

    getFeaturedBuildById: build.query({
      query: (id) => `/builds/featured/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Builds', id }],
    }),

    getUserFeaturedBuilds: build.query({
  query: ({ page = 1, limit = 12 } = {}) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    return `/builds/featured/user?${params.toString()}`;
  },
  providesTags: [{ type: 'Builds', id: 'FEATURED_USER' }],
}),

  }),
  overrideExisting: false,
})

export const {
  useGetMyBuildsQuery,
  useGetBuildByIdQuery,
  useUpdateBuildMetaMutation,
  useUpdateBuildPartsMutation,
  useRenameBuildMutation,
  useToggleFavoriteMutation,
  useUpdateJourneyStatusMutation,
  useDuplicateBuildMutation,
  useDeleteBuildMutation,
  useToggleFeaturedMutation,
  useGetFeaturedBuildsQuery,
  useGetFeaturedBuildByIdQuery,
  useGetUserFeaturedBuildsQuery
} = buildsApi