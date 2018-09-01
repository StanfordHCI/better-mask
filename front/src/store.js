// @flow

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';


// Reducers:
import referrals from 'data/referrals';
import applications from 'data/applications';
import interfaceReducer from 'data/interface';

const reducers = combineReducers({
  referrals,
  applications,
  interface: interfaceReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = composeEnhancers(applyMiddleware(thunk));
export const store = createStore(reducers, enhancers);
