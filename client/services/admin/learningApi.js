import { baseApi } from "../baseApi";

export const learnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 Get All Articles
    getAllArticles: builder.query({
      query: (params) => ({
        url: "/learn",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data, // <-- fixed: use data
      providesTags: (articles) =>
        articles
          ? [
              ...articles.map(({ _id }) => ({ type: "Learn", id: _id })),
              { type: "Learn", id: "LIST" },
            ]
          : [{ type: "Learn", id: "LIST" }],
    }),

    // 🔹 Get Articles By Category
    getArticlesByCategory: builder.query({
      query: ({ category, ...params }) => ({
        url: `/learn/category/${category}`,
        method: "GET",
        params,
      }),
      transformResponse: (response) => response.data, // <-- fixed: use data
      providesTags: (articles) =>
        articles
          ? [
              ...articles.map(({ _id }) => ({ type: "Learn", id: _id })),
              { type: "Learn", id: "LIST" },
            ]
          : [{ type: "Learn", id: "LIST" }],
    }),

    // 🔹 Get Article By Slug
    getArticleBySlug: builder.query({
      query: (slug) => `/learn/${slug}`,
      transformResponse: (response) => response.data, // <-- fixed: use data
      providesTags: (article) => (article ? [{ type: "Learn", id: article._id }] : []),
    }),

    // 🔹 Create Article (Admin)
    createArticle: builder.mutation({
      query: (body) => ({
        url: "/learn",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response.data, // <-- fixed: use data
      invalidatesTags: [{ type: "Learn", id: "LIST" }],
    }),

    // 🔹 Update Article (Admin)
    updateArticle: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/learn/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response.data, // <-- fixed: use data
      invalidatesTags: (article) =>
        article
          ? [
              { type: "Learn", id: article._id },
              { type: "Learn", id: "LIST" },
            ]
          : [{ type: "Learn", id: "LIST" }],
    }),

    // 🔹 Delete Article (Admin)
    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/learn/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Learn", id: "LIST" }],
    }),

    // 🔹 Upload Image (Admin)
  uploadImage: builder.mutation({
  query: (formData) => ({
    url: "/learn/upload-image",
    method: "POST",
    body: formData,
  }),
}),

  }),
  overrideExisting: false,
});

export const {
  useGetAllArticlesQuery,
  useGetArticlesByCategoryQuery,
  useGetArticleBySlugQuery,
  useLazyGetArticleBySlugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useUploadImageMutation,
} = learnApi;