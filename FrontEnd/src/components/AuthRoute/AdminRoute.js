import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../redux/slices/users/userSlice.js";

const AdminRoute = ({ children }) => {
  //dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  const { userAuth } = useSelector((state) => state?.users);

  //get user from localstorage
  //   const user = JSON.parse(localStorage.getItem("userInfo"));
  const isAdmin = userAuth?.userInfo?.userFound?.isAdmin ? true : false;

  if (!isAdmin) {
    return <h1>Access Denied , Admin Only</h1>;
  } else {
    return <>{children}</>;
  }
};

export default AdminRoute;
