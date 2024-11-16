import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant from "../app/constant";
import api from "../app/http";

export const getLogs = createAsyncThunk(
  "/logs/getLogs",
  async ({ pagination, filter }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/admin/log", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: pagination.page,
        size: pagination.size,
        "cate.in": filter.cate || null,
        "type.in": filter.type || null,
        "recordId.equals": filter.recordId || null,
      },
    });

    return {
      list: response.data,
      total: Number(response.headers["x-total-count"]),
    };
  }
);

export const logSlice = createSlice({
  name: "logs",
  initialState: {
    items: {
      list: [],
      total: 0,
    },
  },
  reducers: {},
  extraReducers: {
    [getLogs.fulfilled]: (state, action) => {
      state.items = action.payload;
    },
    [getLogs.rejected]: (state) => {
      state.items = {
        list: [],
        total: 0,
      };
    },
  },
});

export const selectLogsState = (state) => state.logs;

export default logSlice.reducer;
