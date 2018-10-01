// @flow

import { createStore as redux_createStore, combineReducers, applyMiddleware } from 'redux';

import logger from 'redux-logger'
import thunk from 'redux-thunk';


// Reducers:
import offers from 'data/offers';
import applications from 'data/applications';
import interfaceReducer from 'data/interface';
import metamask from 'data/metamask';
import auth from 'data/auth';
import send from 'data/send';
import user from 'data/user';


const reducers = combineReducers({
  auth,
  offers,
  applications,
  interface: interfaceReducer,
  metamask,
  send,
  user,
});

let store;

export function createStore(initialState) {
  store = redux_createStore(reducers, initialState, applyMiddleware(thunk, logger));
  return store;
}

export default store;
