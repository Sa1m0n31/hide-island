import React from 'react'
import { Helmet } from 'react-helmet'
import './static/style/style.css'
import './static/style/mobile.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";

function App() {
  return (<>
      <Helmet>
          <title>HideIsland - ubrania dla Ciebie</title>
      </Helmet>
      <div className="App">
        <Router>
          <Route exact path="/">
            <HomePage />
          </Route>
        </Router>
    </div>
  </>);
}

export default App;
