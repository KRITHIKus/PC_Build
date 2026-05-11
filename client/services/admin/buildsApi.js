// services/admin/buildsApi.js

import { baseApi } from "../baseApi";

export const buildsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 GET ALL BUILDS (ADMIN VIEW / USER BUILDS)
    getBuilds: builder.query({
      query: (params) => ({
        url: "/builds",
        method: "GET",
        params, // pagination, filters
      }),
      providesTags: ["Builds"],
    }),

    // 🔹 GET SINGLE BUILD
    getBuildById: builder.query({
      query: (id) => `/builds/${id}`,
      providesTags: (result, error, id) => [{ type: "Builds", id }],
    }),

    // 🔹 UPDATE BUILD META (title, description, isFeatured, etc.)
    updateBuildMeta: builder.mutation({
      query: ({ id, data }) => ({
        url: `/builds/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Builds",
        { type: "Builds", id },
      ],
    }),

    // 🔹 UPDATE BUILD PARTS
    updateBuildParts: builder.mutation({
      query: ({ id, parts }) => ({
        url: `/builds/${id}/parts`,
        method: "PATCH",
        body: { parts },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Builds",
        { type: "Builds", id },
      ],
    }),

    // 🔹 DELETE BUILD
    deleteBuild: builder.mutation({
      query: (id) => ({
        url: `/builds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Builds"],
    }),

    // 🔹 TOGGLE FEATURED (uses updateMeta internally)
    toggleFeatured: builder.mutation({
      query: ({ id, isFeatured }) => ({
        url: `/builds/${id}`,
        method: "PATCH",
        body: { isFeatured },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Builds",
        { type: "Builds", id },
      ],
    }),

    // 🔹 GET FEATURED BUILDS (PUBLIC)
    getFeaturedBuilds: builder.query({
      query: (params) => ({
        url: "/builds/featured",
        method: "GET",
        params,
      }),
      providesTags: ["Builds"],
    }),

    // 🔹 GET SINGLE FEATURED BUILD
    getFeaturedBuildById: builder.query({
      query: (id) => `/builds/featured/${id}`,
      providesTags: (result, error, id) => [{ type: "Builds", id }],
    }),

  }),
});

export const {
  useGetBuildsQuery,
  useGetBuildByIdQuery,
  useUpdateBuildMetaMutation,
  useUpdateBuildPartsMutation,
  useDeleteBuildMutation,
  useToggleFeaturedMutation,
  useGetFeaturedBuildsQuery,
  useGetFeaturedBuildByIdQuery,
} = buildsApi;