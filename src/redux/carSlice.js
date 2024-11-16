import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import appConstant, { errors } from "../app/constant";
import api from "../app/http";
import uniqId from "../utils/uniqId";

export const getCars = createAsyncThunk(
  "/cars/getCars",
  async ({ pagination, filter }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    const response = await api.get("/api/car", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: pagination.page,
        size: pagination.size,
        "name.contains": filter.name || null,
        "status.equals": filter.status || null,
      },
    });

    return {
      list: response.data,
      total: Number(response.headers["x-total-count"]),
    };
  }
);

export const addCar = createAsyncThunk(
  "/cars/addCar",
  async (data, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post("/api/car", data, {
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

export const editCar = createAsyncThunk(
  "/cars/editCar",
  async ({ id, data }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(`/api/car/${id}`, data, {
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

export const soldCar = createAsyncThunk(
  "cars/soldCar",
  async ({ id }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem(appConstant.TOKEN_KEY);
    try {
      const response = await api.post(`/api/car/sold/${id}`, null, {
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

export const carSlice = createSlice({
  name: "cars",
  initialState: {
    cars: {
      list: [],
      total: 0,
    },
    addCarResult: null,
    editCarResult: null,
    soldCarResult: null,
  },
  reducers: {
    resetAddCarResult: (state) => {
      state.addCarResult = null;
    },
    resetEditCarResult: (state) => {
      state.editCarResult = null;
    },
    resetSoldCarResult: (state) => {
      state.soldCarResult = null;
    },
  },
  extraReducers: {
    [getCars.fulfilled]: (state, action) => {
      state.cars = action.payload;
    },
    [getCars.rejected]: (state) => {
      state.cars = {
        list: [],
        total: 0,
      };
    },
    [addCar.fulfilled]: (state) => {
      state.addCarResult = "success";
    },
    [addCar.rejected]: (state, action) => {
      state.addCarResult = errors[action.payload.detail] || "Xảy ra lỗi!";
    },
    [editCar.fulfilled]: (state) => {
      state.editCarResult = "success";
    },
    [editCar.rejected]: (state, action) => {
      state.editCarResult = errors[action.payload.detail] || "Xảy ra lỗi!";
    },
    [soldCar.fulfilled]: (state) => {
      state.soldCarResult = uniqId();
    },
    [soldCar.rejected]: (state, action) => {
      state.soldCarResult = errors[action.payload.detail] || "Xảy ra lỗi!";
    },
  },
});

export const { resetAddCarResult, resetEditCarResult, resetSoldCarResult } =
  carSlice.actions;
export const selectCarState = (state) => state.car;

export default carSlice.reducer;
