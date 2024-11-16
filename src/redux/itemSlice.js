import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant, { errors } from "../app/constant";
import api from "../app/http";
import uniqId from "../utils/uniqId";

export const getItems = createAsyncThunk(
  "/items/getItems",
  async ({ pagination }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/item", {
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

export const addItems = createAsyncThunk(
  "/items/addItems",
  async (data, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post("/api/admin/item", data, {
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

export const editItems = createAsyncThunk(
  "/items/editItems",
  async ({ id, data }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(`/api/admin/item/update/${id}`, data, {
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

export const itemSlice = createSlice({
  name: "items",
  initialState: {
    items: {
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
    [getItems.fulfilled]: (state, action) => {
      state.items = action.payload;
    },
    [getItems.rejected]: (state) => {
      state.items = {
        list: [],
        total: 0,
      };
    },
    [addItems.fulfilled]: (state) => {
      state.updateResult = uniqId();
    },
    [addItems.rejected]: (state) => {
      state.updateResult = null;
    },
    [editItems.fulfilled]: (state) => {
      state.updateResult = uniqId();
    },
    [editItems.rejected]: (state) => {
      state.updateResult = null;
    },
  },
});

export const { resetUpdateResult } = itemSlice.actions;
export const selectItems = (state) => state.items;

export default itemSlice.reducer;
