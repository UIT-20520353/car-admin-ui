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
