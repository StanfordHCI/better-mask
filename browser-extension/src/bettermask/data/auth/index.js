import {getStoredToken} from "lib/backend-client";

import {lockMetamask, tryUnlockMetamask} from '../metamaskActions';

const LOAD_AUTH_STATUS = 'auth/LOAD_AUTH_STATUS';
const RECEIVE_ACCESS_TOKEN = 'auth/RECEIVE_ACCESS_TOKEN';
const NOT_AUTHENTICATED = 'auth/NOT_AUTHENTICATED';
const LOCK_ACCOUNT = 'auth/LOCK_ACCOUNT';
const ACCOUNT_LOCKED = 'auth/ACCOUNT_LOCKED';

const TRY_UNLOCK_ACCOUNT = 'auth/TRY_UNLOCK_ACCOUNT';
const ACCOUNT_UNLOCKED = 'auth/ACCOUNT_UNLOCKED';

const ERROR = 'auth/ERROR';

const initialState = {
  accessToken: null,
  // null: status unknown
  // false: we know we're not authenticated
  // true: we know we are authenticated
  authenticated: null,
  lockingAccount: false,
}

export default function authReducer(state = initialState, action) {
  // Reducers get passed the fullState because using combineReducers
  // would have made things too easy:
  // const state = {
  //   ...initialState,
  //   ...fullState.auth,
  // };

  switch(action.type) {
    case RECEIVE_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
        authenticated: true,
      }

    case NOT_AUTHENTICATED:
      return {
        ...state,
        accessToken: null,
        authenticated: false,
      }

    case LOCK_ACCOUNT:
      return {
        ...state,
        lockingAccount: true,
      };

    case ACCOUNT_LOCKED:
      return {
        ...state,
        lockingAccount: false,
      }

    default: return state;
  }
}

export const receiveAccessToken = (token) => {
  return {
    type: RECEIVE_ACCESS_TOKEN,
    accessToken: token,
  }
}

export const notAuthenticated = () => {
  return {
    type: NOT_AUTHENTICATED,
  }
}

export const loadAuthStatus = () => {
  return async (dispatch) => {
    dispatch({
      type: LOAD_AUTH_STATUS,
    });

    const token = await getStoredToken();

    if (token) {
      return dispatch(receiveAccessToken(token));
    }

    return dispatch(notAuthenticated());
  }
}

export const lockAccount = () => {
  return async (dispatch) => {
    dispatch({
      type: LOCK_ACCOUNT,
    });

    try {
      await dispatch(lockMetamask());

      dispatch({
        type: ACCOUNT_LOCKED,
      });
    } catch(er) {
      console.error(er);
    }
  }
}

export const tryUnlockAccount = (password) => {
  return async (dispatch) => {
    dispatch({
      type: TRY_UNLOCK_ACCOUNT,
    });

    try {
      await dispatch(tryUnlockMetamask(password));

      dispatch({
        type: ACCOUNT_UNLOCKED,
      });
    } catch(er) {
      console.error(er);
      
      dispatch({
        type: ERROR,
        message: er.message,
      })
    }
  }
}