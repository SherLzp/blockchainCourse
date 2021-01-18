import React from 'react';

/**
 * 引入各个页面组件
 */
import HomePage from "../pages/home";

const { Route, Switch, Redirect } = require('react-router');



/**
 * 网页路由组件
 * 规定全局路由，指定各个路由对应的组件
 *
 * 添加路由：
 * + import PAGE_COMPONENT from "COMPONENT_PATH";
 *
 * + <Route eaxt path="PATH" component={PAGE_COMPONENT}/>
 *
 */

const AppRouter = () => (
    <div >
        <Switch>
            <Route path="/" exact render={() => <Redirect to="/home" />}/>
            <Route exact path="/home" component={HomePage}/>
            <Route render={() => <h1 className={''}>找不到此页面</h1>} />
        </Switch>
    </div>
);

export default AppRouter