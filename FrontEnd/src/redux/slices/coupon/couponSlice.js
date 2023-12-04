import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//InitialState
const initialState = {
  coupons: [],
  coupon: null,
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create Coupon action
export const createCouponAction = createAsyncThunk(
  "coupon/create",
  async (
    { code, discount, startDate, endDate },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.post(
        `${baseURL}/coupons`,
        {
          code,
          discount,
          startDate,
          endDate,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update Coupon action
export const updateCouponAction = createAsyncThunk(
  "coupon/update",
  async (
    { code, discount, startDate, endDate, id },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.put(
        `${baseURL}/coupons/${id}`,
        {
          code,
          discount,
          startDate,
          endDate,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchAllCouponsAction = createAsyncThunk(
  "coupon/fetch-all",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(`${baseURL}/coupons`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchSingleCouponsAction = createAsyncThunk(
  "coupon/fetch-single",
  async (code, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${baseURL}/coupons/single?code=${code}`,
        { code }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete coupon
export const deleteCouponAction = createAsyncThunk(
  "coupon/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.delete(
        `${baseURL}/coupons/${id}/delete`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const couponsSlices = createSlice({
  name: "coupons",
  initialState,
  extraReducers: (builder) => {
    //create coupon
    builder.addCase(createCouponAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCouponAction.fulfilled, (state, action) => {
      state.coupon = action.payload;
      state.loading = false;
      state.isAdded = true;
    });
    builder.addCase(createCouponAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.coupon = null;
      state.isAdded = false;
    });
    //create coupon
    builder.addCase(updateCouponAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCouponAction.fulfilled, (state, action) => {
      state.coupon = action.payload;
      state.loading = false;
      state.isUpdated = true;
    });
    builder.addCase(updateCouponAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.coupon = null;
      state.isUpdated = false;
    });

    // fetch all coupon
    builder.addCase(fetchAllCouponsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllCouponsAction.fulfilled, (state, action) => {
      state.coupons = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllCouponsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.coupons = null;
    });

    // delete coupon
    builder.addCase(deleteCouponAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCouponAction.fulfilled, (state, action) => {
      state.coupon = action.payload;
      state.loading = false;
      state.isDelete = true;
    });
    builder.addCase(deleteCouponAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.coupon = null;
      state.isDelete = false;
    });
    // fetch single coupon
    builder.addCase(fetchSingleCouponsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleCouponsAction.fulfilled, (state, action) => {
      state.coupon = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchSingleCouponsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.coupon = null;
    });
    //reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });
    //reset success action
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
    });
  },
});

//generate the reducer
const couponsReducer = couponsSlices.reducer;

export default couponsReducer;
