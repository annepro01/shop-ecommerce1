import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//InitialState
const initialState = {
  products: [],
  product: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

//create product action
export const createProductAction = createAsyncThunk(
  "product/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);
    try {
      const {
        name,
        description,
        category,
        brand,
        sizes,
        colors,
        price,
        totalQty,
        files,
      } = payload;

      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      //formData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("totalQty", totalQty);
      sizes.forEach((size) => {
        formData.append("sizes", size);
      });
      colors.forEach((color) => {
        formData.append("colors", color);
      });
      files.forEach((file) => {
        formData.append("files", file);
      });
      //make request
      const { data } = await axios.post(
        `${baseURL}/products`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update product action
export const updateProductAction = createAsyncThunk(
  "product/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);
    try {
      const {
        name,
        description,
        category,
        brand,
        sizes,
        colors,
        price,
        totalQty,
        files,
        id,
      } = payload;

      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      //formData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("totalQty", totalQty);
      sizes.forEach((size) => {
        formData.append("sizes", size);
      });
      colors.forEach((color) => {
        formData.append("colors", color);
      });
      files.forEach((file) => {
        formData.append("files", file);
      });

      //make request
      const { data } = await axios.put(
        `${baseURL}/products/${id}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch all product action
export const fetchProductAction = createAsyncThunk(
  "product/list",
  async ({ url }, { rejectWithValue, getState, dispatch }) => {
    console.log(url);
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      //make request
      const { data } = await axios.get(`${url}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch single product action
export const fetchSingleProductAction = createAsyncThunk(
  "product/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      //make request
      const { data } = await axios.get(
        `${baseURL}/products/${productId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch single product action
export const deleteProductAction = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      //make request
      const { data } = await axios.delete(
        `${baseURL}/products/${id}/delete`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    //create product
    builder.addCase(createProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProductAction.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.isAdded = true;
    });
    builder.addCase(createProductAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.product = null;
      state.isAdded = false;
    });
    //update product
    builder.addCase(updateProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductAction.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.isUpdated = true;
    });
    builder.addCase(updateProductAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.product = null;
      state.isUpdated = false;
    });
    //update product
    builder.addCase(deleteProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProductAction.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
      state.isDelete = true;
    });
    builder.addCase(deleteProductAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.product = null;
      state.isDelete = false;
    });

    //fetch product all
    builder.addCase(fetchProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductAction.fulfilled, (state, action) => {
      state.products = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchProductAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.products = null;
    });
    //fetch single product
    builder.addCase(fetchSingleProductAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleProductAction.fulfilled, (state, action) => {
      state.product = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchSingleProductAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.product = null;
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
const productReducer = productSlice.reducer;

export default productReducer;
