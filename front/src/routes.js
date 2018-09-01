import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import Assets from 'pages/Assets';
import Offers from 'pages/Referrals';

export const ASSETS_ROUTE = "/assets";
export const REFERRALS_ROUTE = "/referrals";

const TitleSetterRoute = (props) => {
  const { component: Component, path, title, ...rest } = props;
  let docTitle = title || path.substring(1).split('/')[0];
  docTitle = docTitle.charAt(0).toUpperCase() + docTitle.substr(1) + ' - Bettermask';

  return (
    <Route path={path} render={() => {
      // XXX dispatch ?

      document.title = docTitle;
      return <Component />;
    }}
    {...rest} />
  );
}

const Routes = (props) => {
  return (
    <Switch>
      <TitleSetterRoute exact path="/" component={Home} />
      <TitleSetterRoute path={ASSETS_ROUTE} component={Assets} />
      <TitleSetterRoute path={REFERRALS_ROUTE} component={Offers} />

      <Route path="/auth_callback" component={AuthCallback} />
    </Switch>
  );
}

export default Routes;
