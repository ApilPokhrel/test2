import React from 'react';
import { Route, Redirect } from 'react-router-dom';

let isLogin = () => localStorage.getItem("token") ? true : false

const PrivateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            isLogin() ?
                <Component {...props} />
            : <Redirect to="/login" />
        )} />
    );
};

export default PrivateRoute;