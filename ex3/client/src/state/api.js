import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredetials, logOut } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("result", result?.error?.status);
  if (result?.error?.status === 403) {
    console.log("sending refresh token");
    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
    if (refreshResult?.data) {
      // store the new token
      api.dispatch(
        setCredetials({
          accessToken: refreshResult.data.accessToken,
          user: refreshResult.data.user,
        })
      );
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};
export const api = createApi({
  baseQuery: baseQueryWithReauth,

  reducerPath: "adminApi",
  endpoints: (build) => ({
    refresh: build.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
    // AUTH
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(api.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useRefreshMutation, useLoginMutation, useLogoutMutation } = api;
