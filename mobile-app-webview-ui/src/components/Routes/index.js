import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';

import Auth from 'pages/Auth';
import Assets from 'pages/Assets';
import Offers from 'pages/Offers';

import {
  ASSETS_ROUTE,
  OFFERS_ROUTE,
  AUTH_ROUTE,
} from 'routes';

const Routes = (props) => {
  return (
    <Switch>
      <Route path={OFFERS_ROUTE} component={Offers} />
      <Route path={ASSETS_ROUTE} component={Assets} />
      <Route path={AUTH_ROUTE} component={Auth} />
      <Route exact path={"/"} render={() => <Redirect to={ASSETS_ROUTE} />} />
    </Switch>
  );
}

export default Routes;
