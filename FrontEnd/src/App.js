import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/Hompage/HomePage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import OrdersList from "./components/Admin/Orders/OdersList";
import AddProduct from "./components/Admin/Products/AddProduct";
import ManageStocks from "./components/Admin/Products/ManageStocks";
import AddCoupon from "./components/Admin/Coupons/AddCoupon";
import ManageCoupons from "./components/Admin/Coupons/ManageCoupons";
import UpdateCoupon from "./components/Admin/Coupons/UpdateCoupon";
import CategoryToAdd from "./components/Categories/CategoryToAdd";
import ManageCategories from "./components/Categories/ManageCategories";
import UpdateCategory from "./components/Categories/UpdateCategory";
import UpdateBrands from "./components/Categories/UpdateBrands";
import AddBrand from "./components/Categories/AddBrand";
import ColorList from "./components/Categories/ColorList";
import BrandList from "./components/Categories/BrandList";
import AddColor from "./components/Categories/AddColor";
import ManageOrders from "./components/Admin/Orders/ManageOrders";
import OrderPayment from "./components/User/Products/OrderPayment";
import Customers from "./components/Admin/Orders/Customers";
import ProductsFilters from "./components/Admin/Products/ProductsFilters";
import Product from "./components/User/Products/Product";
import AllCategories from "./components/Hompage/AllCategories";
import AddReview from "./components/User/Reviews/AddReview";
import ShoppingCart from "./components/User/Products/ShoppingCart";
import Login from "./components/User/Forms/Login";
import RegisterForm from "./components/User/Forms/RegisterForm";
import CustomerProfile from "./components/User/Profile/CustomerProfile";
import AdminRoute from "./components/AuthRoute/AdminRoute";
import ThanksForOrdering from "./components/User/Products/Thankyoupage";
import UpdateProducts from "./components/Admin/Products/UpdateProducts";
import UpdateOrders from "./components/Admin/Orders/UpdateOrders";
import AddCategory from "./components/Categories/AddCategory";
import UpdateColors from "./components/Categories/UpdateColors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfileAction } from "./redux/slices/users/userSlice";
import AuthRoute from "./components/AuthRoute/AuthRoute";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);
  const { userAuth } = useSelector((state) => state?.users);
  const isAdmin = userAuth?.userInfo?.userFound?.isAdmin ? true : false;
  return (
    <BrowserRouter>
      {isAdmin && <Navbar />}
      <Routes>
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          {/* products */}
          <Route path="" element={<OrdersList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route
            path="manage-products"
            element={
              <AdminRoute>
                <ManageStocks />
              </AdminRoute>
            }
          />
          <Route
            path="products/edit/:id"
            element={
              <AdminRoute>
                <UpdateProducts />
              </AdminRoute>
            }
          />
          {/* coupons */}
          <Route
            path="add-coupon"
            element={
              <AdminRoute>
                <AddCoupon />
              </AdminRoute>
            }
          />
          <Route
            path="manage-coupon"
            element={
              <AdminRoute>
                <ManageCoupons />
              </AdminRoute>
            }
          />
          <Route
            path="manage-coupon/edit/:id"
            element={
              <AdminRoute>
                <UpdateCoupon />
              </AdminRoute>
            }
          />
          {/* Category */}
          <Route
            path="add-category"
            element={
              <AdminRoute>
                <AddCategory />
              </AdminRoute>
            }
          />
          <Route
            path="category-to-add"
            element={
              <AdminRoute>
                <CategoryToAdd />
              </AdminRoute>
            }
          />
          <Route
            path="manage-category"
            element={
              <AdminRoute>
                <ManageCategories />
              </AdminRoute>
            }
          />
          <Route
            path="edit-category/:id"
            element={
              <AdminRoute>
                <UpdateCategory />
              </AdminRoute>
            }
          />
          {/* brand category */}
          <Route
            path="edit-brands/:id"
            element={
              <AdminRoute>
                <UpdateBrands />
              </AdminRoute>
            }
          />
          <Route
            path="add-brand"
            element={
              <AdminRoute>
                <AddBrand />
              </AdminRoute>
            }
          />
          <Route path="all-brands" element={<BrandList />} />
          {/* color category  */}
          <Route path="edit-colors/:id" element={<UpdateColors />} />
          <Route path="add-color" element={<AddColor />} />
          <Route path="all-colors" element={<ColorList />} />
          {/* Orders */}
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route path="orders/:id" element={<UpdateOrders />} />
          {/* Orders -user  */}
          <Route path="order-payment" element={<OrderPayment />} />
          {/* Orders -customers  */}
          <Route path="customers" element={<Customers />} />
        </Route>
        {/* public links */}
        {/* Products */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products-filters" element={<ProductsFilters />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/all-categories" element={<AllCategories />} />
        <Route path="/success" element={<ThanksForOrdering />} />
        {/* review */}
        <Route path="/add-review/:id" element={<AddReview />} />

        {/* shopping cart */}
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/order-payment" element={<OrderPayment />} />
        {/* users */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/customer-profile"
          element={
            <AuthRoute>
              <CustomerProfile />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
