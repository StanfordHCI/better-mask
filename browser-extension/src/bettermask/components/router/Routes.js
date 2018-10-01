import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AuthenticatedRoute from './AuthenticatedRoute';
import InitializedRoute from './InitializedRoute';

import Initialize from 'pages/Initialize';
import Unlock from 'pages/Unlock';
import AuthCallback from 'pages/AuthCallback';
import Assets from 'pages/Assets';
import Referrals from 'pages/Referrals';
import PendingTransactions from 'pages/PendingTransactions';
import ConfirmTransaction from 'pages/ConfirmTransaction';
import Profile from 'pages/Profile';

import {
  DEFAULT_ROUTE,
  INITIALIZE_ROUTE,
  UNLOCK_ROUTE,
  ASSETS_ROUTE,
  REFERRALS_ROUTE,
  AUTH_CALLBACK_ROUTE,
  PENDING_TRANSACTIONS_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  PROFILE_ROUTE
} from 'routes';

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
      <Route path={INITIALIZE_ROUTE} component={Initialize} />
      
      <InitializedRoute path={UNLOCK_ROUTE} exact component={Unlock} />
      <InitializedRoute path={AUTH_CALLBACK_ROUTE} exact component={AuthCallback} />
      
      <AuthenticatedRoute path={ASSETS_ROUTE} component={Assets} />
      <AuthenticatedRoute path={REFERRALS_ROUTE} component={Referrals} />
      <AuthenticatedRoute path={PENDING_TRANSACTIONS_ROUTE} component={PendingTransactions} />
      <AuthenticatedRoute path={CONFIRM_TRANSACTION_ROUTE} component={ConfirmTransaction} />
      <AuthenticatedRoute path={PROFILE_ROUTE} component={Profile} />

      <AuthenticatedRoute exact path={DEFAULT_ROUTE} render={() => <Redirect to={ASSETS_ROUTE} />} />
    </Switch>
  );
}

export default Routes;
