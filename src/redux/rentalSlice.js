import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant, { errors } from "../app/constant";
import api from "../app/http";

export const getRentals = createAsyncThunk(
  "/rentals/getRentals",
  async ({ pagination, filter }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/rental", {
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

export const addRental = createAsyncThunk(
  "/rentals/addRental",
  async ({ data }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(
        "/api/rental",
        { ...data },
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

export const editRental = createAsyncThunk(
  "/rentals/editRental",
  async ({ data, id }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(
        `/api/rental/${id}`,
        { ...data },
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

export const rentalSlice = createSlice({
  name: "rentals",
  initialState: {
    rentals: {
      list: [],
      total: 0,
    },
    addRentalResult: null,
    editRentalResult: null,
  },
  reducers: {
    resetAddRentalResult: (state) => {
      state.addRentalResult = null;
    },
    resetEditRentalResult: (state) => {
      state.editRentalResult = null;
    },
  },
  extraReducers: {
    [getRentals.fulfilled]: (state, action) => {
      state.rentals = action.payload;
    },
    [getRentals.rejected]: (state) => {
      state.rentals = {
        list: [],
        total: 0,
      };
    },
    [addRental.fulfilled]: (state) => {
      state.addRentalResult = "success";
    },
    [addRental.rejected]: (state, action) => {
      state.addRentalResult = errors[action.payload.detail] || "Xảy ra lỗi!";
    },
    [editRental.fulfilled]: (state) => {
      state.editRentalResult = "success";
    },
    [editRental.rejected]: (state, action) => {
      state.editRentalResult = errors[action.payload.detail] || "Xảy ra lỗi!";
    },
  },
});

export const { resetAddRentalResult, resetEditRentalResult } =
  rentalSlice.actions;
export const selectRentalState = (state) => state.rental;

export default rentalSlice.reducer;