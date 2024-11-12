import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant, { errors } from "../app/constant";
import api from "../app/http";

export const getContracts = createAsyncThunk(
  "/contracts/getContracts",
  async ({ pagination, filter }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/contract", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: pagination.page,
        size: pagination.size,
        "carId.equals": filter.carId || null,
      },
    });

    return {
      list: response.data,
      total: Number(response.headers["x-total-count"]),
    };
  }
);

export const addContract = createAsyncThunk(
  "/contracts/addContract",
  async ({ data, car }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(
        "/api/contract",
        { ...data, carId: car.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editContract = createAsyncThunk(
  "/contracts/editContract",
  async ({ data, car, id }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(
        `/api/contract/${id}`,
        { ...data, carId: car.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const contractSlice = createSlice({
  name: "contracts",
  initialState: {
    contracts: {
      list: [],
      total: 0,
    },
    addContractResult: null,
    editContractResult: null,
  },
  reducers: {
    resetAddContractResult: (state) => {
      state.addContractResult = null;
    },
    resetEditContractResult: (state) => {
      state.editContractResult = null;
    },
  },
  extraReducers: {
    [getContracts.fulfilled]: (state, action) => {
      state.contracts = action.payload;
    },
    [getContracts.rejected]: (state) => {
      state.contracts = {
        list: [],
        total: 0,
      };
    },
    [addContract.fulfilled]: (state) => {
      state.addContractResult = "success";
    },
    [addContract.rejected]: (state, action) => {
      state.addContractResult = errors[action.payload.detail] || "Xảy ra lỗi!";
    },
    [editContract.fulfilled]: (state) => {
      state.editContractResult = "success";
    },
    [editContract.rejected]: (state, action) => {
      state.editContractResult = errors[action.payload.detail] || "Xảy ra lỗi!";
    },
  },
});

export const { resetAddContractResult, resetEditContractResult } =
  contractSlice.actions;
export const selectConstractState = (state) => state.contract;

export default contractSlice.reducer;
