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

import {
  DEFAULT_ROUTE,
  INITIALIZE_ROUTE,
  UNLOCK_ROUTE,
  ASSETS_ROUTE,
  REFERRALS_ROUTE,
  AUTH_CALLBACK_ROUTE,
  PENDING_TRANSACTIONS_ROUTE,
  CONFIRM_TRANSACTION_ROUTE
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

      {/* <Route exact path={DEFAULT_ROUTE} component={Home} /> */}
      
      <AuthenticatedRoute path={ASSETS_ROUTE} component={Assets} />
      <AuthenticatedRoute path={REFERRALS_ROUTE} component={Referrals} />
      <AuthenticatedRoute path={PENDING_TRANSACTIONS_ROUTE} component={PendingTransactions} />
      <AuthenticatedRoute path={CONFIRM_TRANSACTION_ROUTE} component={ConfirmTransaction} />

      {/* <InitializedRoute path={RESTORE_VAULT_ROUTE} exact component={RestoreVaultPage} />
      <AuthenticatedRoute path={REVEAL_SEED_ROUTE} exact component={RevealSeedConfirmation} />
      <AuthenticatedRoute path={SETTINGS_ROUTE} component={Settings} />
      <AuthenticatedRoute path={NOTICE_ROUTE} exact component={NoticeScreen} />
      <AuthenticatedRoute path={`${CONFIRM_TRANSACTION_ROUTE}/:id?`} component={ConfirmTxScreen} />
      <AuthenticatedRoute path={SEND_ROUTE} exact component={SendTransactionScreen} />
      <AuthenticatedRoute path={ADD_TOKEN_ROUTE} exact component={AddTokenPage} />
      <AuthenticatedRoute path={CONFIRM_ADD_TOKEN_ROUTE} exact component={ConfirmAddTokenPage} />
      <AuthenticatedRoute path={NEW_ACCOUNT_ROUTE} component={CreateAccountPage} /> */}

      {/* <Route path="/auth_callback" component={AuthCallback} /> */}
      <Route exact path={DEFAULT_ROUTE} render={() => <Redirect to={ASSETS_ROUTE} />} />
    </Switch>
  );
}

export default Routes;
