import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalAction";

//initialState
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: null,
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};
//register action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (
    { fullname, email, password },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //make the http request
      const { data } = await axios.post(`${baseURL}/users/register`, {
        email,
        password,
        fullname,
      });
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//login action
export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
    try {
      //make the http request
      const { data } = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });
      //save the user into localstorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);
//update user shipping address
export const updateUserShippingAddress = createAsyncThunk(
  "users/update-shipping-address",
  async (
    {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      country,
      province,
      phone,
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //Token - Authenticated
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      //make the http request
      const { data } = await axios.put(
        `${baseURL}/users/update/shipping`,
        {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          country,
          province,
          phone,
        },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//user profile action
export const getProfileAction = createAsyncThunk(
  "users/profile-fetched",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //get token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

//logout
export const logoutAction = createAsyncThunk(
  "users/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    localStorage.removeItem("userInfo");
    return true;
  }
);

//user slice

const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    //login---------------
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.userAuth.loading = true;
    });

    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.userAuth.loading = false;
    });

    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });

    //register-----------
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAdded = true;
      state.loading = false;
    });

    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.isAdded = false;
    });

    //logout---------------
    builder.addCase(logoutAction.pending, (state, action) => {
      state.userAuth.userInfo = null;
    });
    //update shipping address-----------
    builder.addCase(updateUserShippingAddress.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(updateUserShippingAddress.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });

    builder.addCase(updateUserShippingAddress.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //profile
    builder.addCase(getProfileAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getProfileAction.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(getProfileAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //reset error action
    builder.addCase(resetErrAction.pending, (state) => {
      state.error = null;
      state.isAdded = false;
    });
    //reset success action
    builder.addCase(resetSuccessAction.pending, (state) => {
      state.isAdded = false;
      state.error = null;
    });
  },
});

//generate reducers

const usersReducer = usersSlice.reducer;

export default usersReducer;
