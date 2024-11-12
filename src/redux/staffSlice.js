import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant from "../app/constant";
import api from "../app/http";
import uniqId from "../utils/uniqId";

export const getStaffs = createAsyncThunk(
  "/staff/getStaffs",
  async ({ pagination }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/admin/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: pagination.page,
        size: pagination.size,
      },
    });

    return {
      list: response.data,
      total: Number(response.headers["x-total-count"]),
    };
  }
);
export const addStaffs = createAsyncThunk(
  "/staff/addStaffs",
  async (data, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post("/api/admin/user/create", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const staffSlice = createSlice({
  name: "staffs",
  initialState: {
    staffs: {
      list: [],
      total: 0,
    },
    updateResult: null,
  },
  reducers: {
    resetUpdateResult: (state) => {
      state.updateResult = null;
    },
  },
  extraReducers: {
    [getStaffs.fulfilled]: (state, action) => {
      state.staffs = action.payload;
    },
    [getStaffs.rejected]: (state) => {
      state.staffs = {
        list: [],
        total: 0,
      };
    },
    [addStaffs.fulfilled]: (state) => {
      state.updateResult = uniqId();
    },
    [addStaffs.rejected]: (state) => {
      state.updateResult = null;
    },
  },
});

export const { resetUpdateResult } = staffSlice.actions;
export const selectStaffState = (state) => state.staffs;

export default staffSlice.reducer;
