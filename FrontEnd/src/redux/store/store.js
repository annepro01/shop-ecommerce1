import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/userSlice";
import productReducer from "../slices/products/productSlices";
import categoryReducer from "../slices/categories/categoriesSlice";
import brandsReducer from "../slices/categories/brandsSlice copy";
import colorsReducer from "../slices/categories/colorSlice";
import cartReducer from "../slices/cart/cartSlices";
import couponsReducer from "../slices/coupon/couponSlice";
import ordersReducer from "../slices/orders/ordersSlice";
import reviewReducer from "../slices/reviews/reviewSlice";

//store

const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productReducer,
    categories: categoryReducer,
    brands: brandsReducer,
    colors: colorsReducer,
    carts: cartReducer,
    coupon: couponsReducer,
    order: ordersReducer,
    reviews: reviewReducer,
  },
});

export default store;
