import { baseApi } from "./baseApi";

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLatestPrice: build.query({
      query: ({ componentId, region = "Karnataka" }) =>
        `/pricing/component/${componentId}/latest?region=${encodeURIComponent(region)}`,
      providesTags: (_result, _err, { componentId }) => [
        { type: "Pricing", id: componentId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetLatestPriceQuery } = pricingApi;