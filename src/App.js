import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import logo from "./logo.svg";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./components/user/login";
import Verification from "./components/user/verification";
import Register from "./components/user/register";
import Album from "./components/album";
import File from "./components/file";

const NotFound = () => <h1>404 Not Found</h1>;

const App = () => (
  <Router>
    <div>
      <Switch>
        <PublicRoute restricted={true} component={Login} path="/login" exact />
        <PublicRoute
          restricted={true}
          component={Register}
          path="/signup"
          exact
        />
        <PrivateRoute component={Verification} path="/verification" exact />
        <PrivateRoute component={Album} path="/" exact />
        <PrivateRoute component={File} path="/gallery/:id" exact />

        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);

export default App;
