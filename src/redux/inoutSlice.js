import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant from "../app/constant";
import api from "../app/http";
import uniqId from "../utils/uniqId";

export const getInOuts = createAsyncThunk(
  "/inout/getInOut",
  async ({ pagination, filter }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/in-out", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: pagination.page,
        size: pagination.size,
        "type.equals": filter.name || null,
        "createUsername.equas": filter.createUsername || null,
      },
    });

    return {
      list: response.data,
      total: Number(response.headers["x-total-count"]),
    };
  }
);

export const getPnl = createAsyncThunk("/inout/getPnl", async () => {
  const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
  const response = await api.get("/api/in-out/total", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
});
export const addInout = createAsyncThunk(
  "/inout/addInout",
  async (data, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post("/api/in-out", data, {
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

export const editInout = createAsyncThunk(
  "/inout/editInout",
  async ({ id, data }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(`/api/in-out/update/${id}`, data, {
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
export const inoutSlice = createSlice({
  name: "inout",
  initialState: {
    pnl: {
      totalInCash: 0,
      totalInBank: 0,
      totalOutCash: 0,
      totalOutBank: 0,
    },
    inouts: {
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
    [getInOuts.fulfilled]: (state, action) => {
      state.inouts = action.payload;
    },
    [getInOuts.rejected]: (state) => {
      state.inouts = {
        list: [],
        total: 0,
      };
    },
    [getPnl.fulfilled]: (state, action) => {
      state.pnl = action.payload;
    },
    [getPnl.rejected]: (state) => {
      state.pnl = {
        totalInCash: 0,
        totalInBank: 0,
        totalOutCash: 0,
        totalOutBank: 0,
      };
    },
    [addInout.fulfilled]: (state) => {
      state.updateResult = uniqId();
    },
    [addInout.rejected]: (state) => {
      state.updateResult = null;
    },
    [editInout.fulfilled]: (state) => {
      state.updateResult = uniqId();
    },
    [editInout.rejected]: (state) => {
      state.updateResult = null;
    },
  },
});

export const { resetUpdateResult } = inoutSlice.actions;
export const selectInoutState = (state) => state.inout;

export default inoutSlice.reducer;
