import React, { useEffect } from "react";
import Login from "../User/Forms/Login";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../redux/slices/users/userSlice";

const AuthRoute = ({ children }) => {
  //dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  const { userAuth } = useSelector((state) => state?.users);

  //get user from localstorage
  // const user = JSON.parse(localStorage.getItem("userInfo"));
  // const isLoggedIn = user?.token ? true : false;
  const isLoggedIn = userAuth?.userInfo?.token;

  if (!isLoggedIn) return <Login />;

  return;
  <>{children}</>;
};

export default AuthRoute;
