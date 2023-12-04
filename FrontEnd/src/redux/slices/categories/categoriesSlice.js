import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//InitialState
const initialState = {
  categories: [],
  category: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create Category action
export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { name, file } = payload;

      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      //make request
      const { data } = await axios.post(
        `${baseURL}/categories`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update Category action
export const updateCategoryAction = createAsyncThunk(
  "category/update",
  async ({ name, id }, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      //make request
      const { data } = await axios.put(
        `${baseURL}/categories/${id}`,
        { name },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
//fetch Category action
export const fetchSingleCategoriesAction = createAsyncThunk(
  "category/fetch Single",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/categories/${id}`);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch Category action
export const fetchCategoriesAction = createAsyncThunk(
  "category/fetch All",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/categories`);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    //create category
    builder.addCase(createCategoryAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.category = action.payload;
      state.loading = false;
      state.isAdded = true;
    });
    builder.addCase(createCategoryAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.category = null;
      state.isAdded = false;
    });
    //update category
    builder.addCase(updateCategoryAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCategoryAction.fulfilled, (state, action) => {
      state.category = action.payload;
      state.loading = false;
      state.isUpdated = true;
    });
    builder.addCase(updateCategoryAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.category = null;
      state.isUpdated = false;
    });

    //fetch All categories
    builder.addCase(fetchCategoriesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.categories = null;
    });
    //fetch single categories
    builder.addCase(fetchSingleCategoriesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleCategoriesAction.fulfilled, (state, action) => {
      state.category = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchSingleCategoriesAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.category = null;
    });
    //reset Error
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });

    //reset Success
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
      state.isUpdated = false;
    });
  },
});

//generate the reducer
const categoryReducer = categorySlice.reducer;

export default categoryReducer;
