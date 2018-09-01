// @flow

import { createStore as redux_createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';


// Reducers:
import referrals from 'data/referrals';
import applications from 'data/applications';
import interfaceReducer from 'data/interface';
import metamask from 'data/metamask';
import auth from 'data/auth';
import send from 'data/send';

const reducers = combineReducers({
  auth,
  referrals,
  applications,
  interface: interfaceReducer,
  metamask,
  send,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));

let store;

export function createStore(initialState) {
  store = redux_createStore(reducers, initialState, enhancers);
  return store;
}

export default store;
