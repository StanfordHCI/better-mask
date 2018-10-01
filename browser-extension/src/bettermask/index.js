
import ReactDOM from 'react-dom';
import React from 'react';

import App from './App';

import {createStore} from './store';
import {setBackgroundConnection} from './data/backgroundConnection';
import {updateMetamaskState} from './data/metamask';
import {selectTransaction} from 'data/transactions';

import txHelper from './lib/tx-helper';
import {getEnvironmentType} from 'data/metamask/utils';
import {isGoingThroughAuthFlow} from 'lib/authFlow';

const { fetchLocale } = require('./lib/i18n-helper')
const { ENVIRONMENT_TYPE_POPUP } = require('metamask-crx/app/scripts/lib/enums')
const log = require('loglevel')

log.setLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn');

export default function launchMetamaskUi (opts, cb) {
  var accountManager = opts.accountManager;

  // accountManager is an instance of the MetamaskController class coming from the
  // extension's background page
  
  // Provide the background connection to Metamask's awesome 2000-lines-only actions.js:
  // actions._setBackgroundConnection(accountManager);

  // Provide the background connection to our module dedicated to this use (this module
  // is then imported from wherever we need a background connection - ideally, only
  // from action dispatcher thunks)
  setBackgroundConnection(accountManager);

  // check if we are unlocked first
  accountManager.getState(function (err, metamaskState) {
    if (err) return cb(err)
    startApp(metamaskState, accountManager, opts)
      .then((store) => {
        cb(null, store)
      })
  })
}

async function startApp(metamaskState, accountManager, opts) {
  // parse opts
  if (!metamaskState.featureFlags) metamaskState.featureFlags = {}
  
  if (!metamaskState.isPopup) metamaskState.isPopup = getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP;

  const currentLocaleMessages = metamaskState.currentLocale
    ? await fetchLocale(metamaskState.currentLocale)
    : {}

  const enLocaleMessages = await fetchLocale('en')

  const store = createStore({

    // metamaskState represents the cross-tab state
    metamask: metamaskState,

    // appState represents the current tab's popup state
    // appState: {},

    // localeMessages: {
    //   current: currentLocaleMessages,
    //   en: enLocaleMessages,
    // },

    // Which blockchain we are using:
    // networkVersion: opts.networkVersion,
  })

  const { metamask: { isUnlocked, isInitialized } } = store.getState();
  
  if (isUnlocked && isInitialized) {
    handlePendingTransactions(store);
  } else {
    await handlePendingAuthFlow();
  }

  accountManager.on('update', function (metamaskState) {
    store.dispatch(updateMetamaskState(metamaskState))
  })

  // global metamask api - used by tooling
  global.metamask = {
    updateCurrentLocale: (code) => {
      store.dispatch(actions.updateCurrentLocale(code))
    },
    setProviderType: (type) => {
      store.dispatch(actions.setProviderType(type))
    },
  }

  // start app
  ReactDOM.render(<App store={store} />, opts.container)

  return store;
}

const handlePendingTransactions = (store) => {
  const {metamask: metamaskState} = store.getState();

  // if unconfirmed txs, start on txConf page
  const allPendingTransactions = txHelper(
    metamaskState.unapprovedTxs,
    metamaskState.unapprovedMsgs,
    metamaskState.unapprovedPersonalMsgs,
    metamaskState.unapprovedTypedMessages,
    metamaskState.network
  );

  const pendingTxsCount = allPendingTransactions.length
  if (pendingTxsCount > 0) {
    const selected = allPendingTransactions[pendingTxsCount - 1];
    store.dispatch(selectTransaction(selected.id));

    window.location = window.location.pathname + '#pending-transactions';
  }
}

const handlePendingAuthFlow = async () => {
  const authFlow = await isGoingThroughAuthFlow();
  if (authFlow) {
    window.location = window.location.pathname + '#auth-callback';
  }
}