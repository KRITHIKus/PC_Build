import { baseApi } from "./baseApi";

export const componentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getComponents: build.query({
      query: ({ page = 1, limit = 20, type = "", brand = "", search = "", sort = "" } = {}) => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));
        if (type) params.set("type", type);
        if (brand) params.set("brand", brand);
        if (search) params.set("search", search);
        if (sort) params.set("sort", sort);

        return `/components?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Components", id: _id })),
              { type: "Components", id: "LIST" },
            ]
          : [{ type: "Components", id: "LIST" }],
    }),

    getComponentById: build.query({
      query: (id) => `/components/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Components", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetComponentsQuery, useGetComponentByIdQuery } = componentsApi;