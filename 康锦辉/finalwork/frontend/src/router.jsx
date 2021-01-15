import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Index from './pages/index';
import Launch from './pages/launch';
import View from './pages/view';
import MyFunds from './pages/myfunds';
import MyLaunchs from './pages/mylaunchs';

const PageRouter = () => {
    return (
        <Router>
            <Route path="/" exact render={() => <Redirect to="/index" />}/>
            <Route path='/index' component={Index} />
            <Route path='/launch' component={Launch} />
            <Route path='/view' component={View} />
            <Route path='/myfunds' component={MyFunds} />
            <Route path='/mylaunchs' component={MyLaunchs} />
        </Router>
    );
}

export default PageRouter;