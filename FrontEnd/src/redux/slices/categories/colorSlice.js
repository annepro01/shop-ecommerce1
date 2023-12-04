import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createCategoryAction } from "./categoriesSlice";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//InitialState
const initialState = {
  colors: [],
  color: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create Colors action
export const createColorsAction = createAsyncThunk(
  "color/create",
  async (name, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make request
      const { data } = await axios.post(
        `${baseURL}/colors`,
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

//update Colors action
export const updateColorsAction = createAsyncThunk(
  "color/update",
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
        `${baseURL}/colors/${id}`,
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
export const fetchColorsAction = createAsyncThunk(
  "colors/fetch All",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/colors`);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const colorSlice = createSlice({
  name: "colors",
  initialState,
  extraReducers: (builder) => {
    //create color
    builder.addCase(createColorsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createColorsAction.fulfilled, (state, action) => {
      state.color = action.payload;
      state.loading = false;
      state.isAdded = true;
    });
    builder.addCase(createColorsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.color = null;
      state.isAdded = false;
    });
    //update color
    builder.addCase(updateColorsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateColorsAction.fulfilled, (state, action) => {
      state.color = action.payload;
      state.loading = false;
      state.isUpdated = true;
    });
    builder.addCase(updateColorsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.color = null;
      state.isUpdated = false;
    });

    // fetch All Colors
    builder.addCase(fetchColorsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchColorsAction.fulfilled, (state, action) => {
      state.colors = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchColorsAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.colors = null;
    });
    //reset Error
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });

    //reset Success
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
    });
  },
});

//generate the reducer
const colorsReducer = colorSlice.reducer;

export default colorsReducer;
