import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant from "../app/constant";
import api from "../app/http";

export const getProfile = createAsyncThunk(
  "/authentication/profile",
  async () => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
);

export const login = createAsyncThunk("/authentication/login", async (data) => {
  const response = await api.post("/api/login", data);
  return response.data;
});

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    profile: null,
    loginResult: null,
  },
  reducers: {
    logout: (state) => {
      state.profile = null;
      localStorage.removeItem(appConstant.TOKEN_KEY);
    },
    resetLoginResult: (state) => {
      state.loginResult = null;
    },
  },

  extraReducers: {
    [getProfile.fulfilled]: (state, action) => {
      state.profile = action.payload;
    },
    [getProfile.rejected]: (state) => {
      state.profile = null;
      window.location.href = "/login";
      localStorage.removeItem(appConstant.TOKEN_KEY);
    },
    [login.fulfilled]: (state, action) => {
      state.loginResult = "success";
      localStorage.setItem(appConstant.TOKEN_KEY, action.payload.accessToken);
    },
    [login.rejected]: (state) => {
      state.loginResult = "error";
    },
  },
});

export const { logout, resetLoginResult } = authSlice.actions;

export const selectAuthState = (state) => state.auth;

export default authSlice.reducer;
