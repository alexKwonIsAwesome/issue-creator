import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Global from './Global';
import Main from './Main';
import Success from './Success';

function App() {
  return (
    <>
      <Global />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/success" component={Success} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
