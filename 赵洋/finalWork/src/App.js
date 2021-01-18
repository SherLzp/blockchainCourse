import React from 'react'
import TopBar from "./Page/TopBar";
import homepage from "./Page/homepage";
import isfunding from "./Page/isfunding";
import mySupport from "./Page/mySupport";
import myProject from "./Page/myProject";
import pagedetails from './Page/pagedetails';
import mypagedetails from "./Page/mypagedetails";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

var storage=window.localStorage;

class App extends React.Component {

  render() {
    storage.setItem("TopbarKey","0");
    return (
      <div className="container">
        <BrowserRouter>
          <TopBar/>
          <Switch>
            <Route exact path = "/" component = {homepage}/>
            <Route exact path = "/isfunding" component = {isfunding}/>
            <Route exact path = "/mySupport" component = {mySupport}/>
            <Route exact path = "/myProject" component = {myProject}/>
            <Route exact path = "/funding/:id" component={pagedetails}/>
            <Route exact path = "/myfunding/:id" component={mypagedetails}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;