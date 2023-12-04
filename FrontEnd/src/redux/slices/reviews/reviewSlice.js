import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//InitialState
const initialState = {
  reviews: [],
  review: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create reviews action
export const createReviewsAction = createAsyncThunk(
  "reviews/create",
  async (
    { message, rating, id },

    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //Token - Authenticated
      const token = getState().users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.post(
        `${baseURL}/review/${id}`,
        {
          message,
          rating,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchSingleReviewAction = createAsyncThunk(
  "review/fetch-single",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/review`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  extraReducers: (builder) => {
    //create coupon
    builder.addCase(createReviewsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createReviewsAction.fulfilled, (state, action) => {
      state.review = action.payload;
      state.loading = false;
      state.isAdded = true;
    });
    builder.addCase(createReviewsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.review = null;
      state.isAdded = false;
    });

    // fetch all coupon
    // builder.addCase(fetchAllCouponsAction.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(fetchAllCouponsAction.fulfilled, (state, action) => {
    //   state.coupons = action.payload;
    //   state.loading = false;
    // });
    // builder.addCase(fetchAllCouponsAction.rejected, (state, action) => {
    //   state.error = action.payload;
    //   state.loading = false;
    //   state.coupons = null;
    // });
    // fetch single coupon
    // builder.addCase(fetchSingleCouponsAction.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(fetchSingleCouponsAction.fulfilled, (state, action) => {
    //   state.coupon = action.payload;
    //   state.loading = false;
    //   state.isAdded = true;
    // });
    // builder.addCase(fetchSingleCouponsAction.rejected, (state, action) => {
    //   state.error = action.payload;
    //   state.loading = false;
    //   state.coupon = null;
    //   state.isAdded = false;
    // });
    //reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
    //reset success action
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
  },
});

//generate the reducer
const reviewReducer = reviewsSlice.reducer;

export default reviewReducer;
