import React, { useState } from 'react';

import HomePage from './views/HomePage';
import ProposalsPage from './views/ProposalsPage';
import VotePage from './views/VotePage';
import AppHeader from './components/AppHeader';
import AppDrawer from './components/AppDrawer';
import {BrowserRouter, Switch, Route, useLocation} from 'react-router-dom';

function App() {

  const[drawerOpen, setDrawerOpen] = useState(false)

  // Get the path with its first letter capitalized
  let location = useLocation();
  let path = location.pathname.split('/')[1].charAt(0).toUpperCase() + location.pathname.split('/')[1].slice(1);


  const handleDrawerClose = e => {
    setDrawerOpen(false);
  }

  const handleDrawerOpen = e => {
    setDrawerOpen(true);
  }

  return (
    <React.Fragment>

      <AppHeader handleDrawerOpen={handleDrawerOpen} text={path ? path : "Projects"}/>
      <AppDrawer open={drawerOpen} onClose={handleDrawerClose}/>

      <Switch>
        <Route exact path="/" ><HomePage /> </Route>
        <Route exact path="/proposals"><ProposalsPage/></Route>
        <Route exact path="/votes" component={VotePage} />
      </Switch>

    </React.Fragment>
  );
}

export default App;
