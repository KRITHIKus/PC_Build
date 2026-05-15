import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 Get Current User
    getCurrentUser: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // 🔹 Update Username
    updateUsername: builder.mutation({
      query: (body) => ({
        url: "/users/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 🔹 Update Password
    updatePassword: builder.mutation({
      query: (body) => ({
        url: "/users/profile/password",
        method: "PATCH",
        body,
      }),
    }),

    // 🔹 Update Avatar
    updateAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return {
          url: "/users/profile/avatar",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
} = userApi;