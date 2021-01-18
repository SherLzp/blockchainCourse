import React, { Component } from "react";
import "./App.css";
import {Route, HashRouter} from "react-router-dom";
import createfunding from "./createfunding";
import home from "./home";
import allfundings from "./allfundings";
import funding_detail from "./funding_detail";
import my_launch_fundings from "./my_launch_fundings";
import my_launch_funding_detail from "./my_launch_funding_detail";
import my_joined_fundings from "./my_joined_fundings";
import my_joined_funding_detail from "./my_joined_funding_detail";
class App extends React.Component {
    render() {
    return (
        <HashRouter>
          <div>
              <Route path="/" component={home} exact />
            <Route exact path="/home" component={home} />
            <Route exact path="/createfunding" component={createfunding} />
            <Route exact path="/allfundings" component={allfundings} />
              <Route exact path="/funding_detail/:id" component={funding_detail} />
            <Route exact path="/my_launch_fundings" component={my_launch_fundings} />
              <Route exact path="/my_launch_funding_detail/:id" component={my_launch_funding_detail} />
              <Route exact path="/my_joined_fundings" component={my_joined_fundings} />
              <Route exact path="/my_joined_funding_detail/:id" component={my_joined_funding_detail} />
          </div>
        </HashRouter>
    );
  }
}

export default App;
