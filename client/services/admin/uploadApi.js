// services/admin/uploadApi.js

import { baseApi } from "../baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 UPLOAD IMAGE
    uploadImage: builder.mutation({
      query: ({ file, folder = "general", componentId }) => { // ✅ added componentId
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: `/media/upload?folder=${folder}&componentId=${componentId}`, // ✅ send componentId as query
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Media"],
    }),

    // 🔹 DELETE IMAGE
    deleteImage: builder.mutation({
      query: (publicId) => ({
        url: `/media/${encodeURIComponent(publicId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),

  }),
});

export const {
  useUploadImageMutation,
  useDeleteImageMutation,
} = uploadApi;