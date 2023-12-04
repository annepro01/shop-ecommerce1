import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//InitialState
const initialState = {
  brands: [],
  brand: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create Brand action
export const createBrandsAction = createAsyncThunk(
  "brand/create",
  async (name, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.post(
        `${baseURL}/brand`,
        {
          name,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch Brands action
export const fetchBrandsAction = createAsyncThunk(
  "brands/fetch All",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/brand`);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update Brand action
export const updateBrandsAction = createAsyncThunk(
  "brand/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { name, id } = payload;
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.put(
        `${baseURL}/brand/${id}`,
        {
          name,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  extraReducers: (builder) => {
    //create category
    builder.addCase(createBrandsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createBrandsAction.fulfilled, (state, action) => {
      state.brand = action.payload;
      state.loading = false;
      state.isAdded = true;
    });
    builder.addCase(createBrandsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.brand = null;
      state.isAdded = false;
    });
    //create category
    builder.addCase(updateBrandsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateBrandsAction.fulfilled, (state, action) => {
      state.brand = action.payload;
      state.loading = false;
      state.isUpdated = true;
    });
    builder.addCase(updateBrandsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.brand = null;
      state.isUpdated = false;
    });

    // fetch All categories
    builder.addCase(fetchBrandsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBrandsAction.fulfilled, (state, action) => {
      state.brands = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchBrandsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.brands = null;
    });
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
const brandsReducer = brandsSlice.reducer;

export default brandsReducer;
