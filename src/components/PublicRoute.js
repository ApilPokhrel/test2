import React from "react";
import { Route, Redirect } from "react-router-dom";

let isLogin = () => (localStorage.getItem("token") ? true : false);

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() && restricted ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
