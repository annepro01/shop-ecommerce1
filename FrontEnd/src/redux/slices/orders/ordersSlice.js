import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//InitialState
const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  stats: null,
};

//place an order
export const placeOrderAction = createAsyncThunk(
  "order/place-order",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { orderItems, shippingAddress, totalPrice } = payload;
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.post(
        `${baseURL}/orders`,
        {
          orderItems,
          shippingAddress,
          totalPrice,
        },
        config
      );
      return window.open(data?.url);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update Orders
export const updateShippingOrderAction = createAsyncThunk(
  "order/update-shipping-order",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { status, id } = payload;
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.put(
        `${baseURL}/orders/update/${id}`,
        {
          status,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get all orders
export const fetchAllOrdersAction = createAsyncThunk(
  "orders/fetch-all-orders",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(`${baseURL}/orders`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
//get single order
// export const fetchSingleOrdersAction = createAsyncThunk(
//   "orders/fetch-single-order",
//   async (payload, { rejectWithValue, getState, dispatch }) => {
//     try {
//       const { data } = await axios.get(`${baseURL}/orders`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error?.response?.data);
//     }
//   }
// );

//get all orders
export const getOrderStatsAction = createAsyncThunk(
  "orders/fetch-statistics",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(`${baseURL}/orders/sales/stats`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const ordersSlices = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    //create coupon
    builder.addCase(placeOrderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(placeOrderAction.fulfilled, (state, action) => {
      state.order = action.payload;
      state.loading = false;
      state.isUpdated = true;
    });
    builder.addCase(placeOrderAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.order = null;
      state.isUpdated = false;
    });

    //update shipping order
    builder.addCase(updateShippingOrderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateShippingOrderAction.fulfilled, (state, action) => {
      state.order = action.payload;
      state.loading = false;
    });
    builder.addCase(updateShippingOrderAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.order = null;
    });

    //fetch statistics
    builder.addCase(getOrderStatsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getOrderStatsAction.fulfilled, (state, action) => {
      state.stats = action.payload;
      state.loading = false;
    });
    builder.addCase(getOrderStatsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.stats = null;
    });

    // fetch all orders
    builder.addCase(fetchAllOrdersAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllOrdersAction.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllOrdersAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.orders = null;
    });
    // // fetch single coupon
    // builder.addCase(fetchSingleOrdersAction.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(fetchSingleOrdersAction.fulfilled, (state, action) => {
    //   state.order = action.payload;
    //   state.loading = false;
    //   state.isAdded = true;
    // });
    // builder.addCase(fetchSingleOrdersAction.rejected, (state, action) => {
    //   state.error = action.payload;
    //   state.loading = false;
    //   state.order = null;
    //   state.isAdded = false;
    // });
    //reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
    });
  },
});

//generate the reducer
const ordersReducer = ordersSlices.reducer;

export default ordersReducer;
