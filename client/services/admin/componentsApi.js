// services/admin/componentsApi.js

import { baseApi } from "../baseApi";

export const componentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 GET ALL COMPONENTS
    getComponents: builder.query({
      query: (params) => ({
        url: "/components",
        method: "GET",
        params, // supports pagination, filters
      }),
      providesTags: ["Components"],
    }),

    // 🔹 GET SINGLE COMPONENT
    getComponentById: builder.query({
      query: (id) => `/components/${id}`,
      providesTags: (result, error, id) => [{ type: "Components", id }],
    }),

    // 🔹 CREATE COMPONENT (ADMIN)
    createComponent: builder.mutation({
      query: (data) => ({
        url: "/components",
        method: "POST",
        body: data,
        credentials: "include", // 🔐 required
      }),
      invalidatesTags: ["Components"],
    }),

    // 🔹 UPDATE COMPONENT (ADMIN)
    updateComponent: builder.mutation({
      query: ({ id, data }) => ({
        url: `/components/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        "Components",
        { type: "Components", id },
      ],
    }),

    // 🔹 DELETE COMPONENT (ADMIN)
    deleteComponent: builder.mutation({
      query: (id) => ({
        url: `/components/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Components"],
    }),

  }),
});

export const {
  useGetComponentsQuery,
  useGetComponentByIdQuery,
  useCreateComponentMutation,
  useUpdateComponentMutation,
  useDeleteComponentMutation,
} = componentsApi;