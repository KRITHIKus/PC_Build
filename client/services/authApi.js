import { baseApi } from './baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // POST /auth/register
    register: build.mutation({
      query: (body) => ({
        url:    '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/login
    login: build.mutation({
      query: (body) => ({
        url:    '/auth/login',
        method: 'POST',
        body,
       
      }),
    }),

    // POST /auth/logout
    logout: build.mutation({
      query: () => ({
        url:    '/auth/logout',
        method: 'POST',
      }),
    }),

    // GET /auth/me — session restore
    getMe: build.query({
      query: () => '/auth/me',
      providesTags: [{ type: 'User', id: 'ME' }],
    }),

  }),
  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi