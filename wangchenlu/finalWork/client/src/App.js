import React, {Component} from 'react';

//路由
import {BrowserRouter, Route, Switch} from 'react-router-dom';

//布局组件
import TopBar from './pages/TopBar'
import AllFundings from "./pages/allFundings"
import newFunding from "./pages/newFunding"
import MyFundings from "./pages/myFundings"
import MyInvest from "./pages/myInvest"

class App extends Component {
	render() {
		return (
			<div className="App" >
            <BrowserRouter>
			<TopBar/>
            <Switch>
                <Route exact path = "/" component = {AllFundings}/>
				<Route exact path = "/newFunding" component = {newFunding}/>
				<Route exact path = "/myFunding" component = {MyFundings} />
				<Route exact path = "/myInvest" component = {MyInvest} />
            </Switch>
				</BrowserRouter>
			</div>
		);
	}
}
export default App;