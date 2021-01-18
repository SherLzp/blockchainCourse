import React from 'react';
import AppRouter from "./router/router";
import WebHeader from "./components/header";
import WebFooter from "./components/footer";

const { BrowserRouter } = require('react-router-dom');

class App extends React.Component {
  render() {
    return (
        <BrowserRouter >
          <WebHeader/>
          <AppRouter/>
          <WebFooter/>
        </BrowserRouter>
    );
  }
}

export default App;
