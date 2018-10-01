import * as service from './service';

const LOCK_ACCOUNT = 'auth/LOCK_ACCOUNT';
const RECEIVE_ACCESS_TOKEN = 'auth/RECEIVE_ACCESS_TOKEN';

const FETCH_CURRENT_USER = 'auth/FETCH_CURRENT_USER';
const RECEIVE_CURRENT_USER = 'auth/RECEIVE_CURRENT_USER';

const initialState = {
  accessToken: null,
  profile: null,
  balances: null,
  loading: false,
};

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case RECEIVE_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken,
      };
    case FETCH_CURRENT_USER:
      return {
        ...state,
        loading: false,
      };
    case RECEIVE_CURRENT_USER:
      return {
        ...state,
        loading: true,
        profile: action.profile,
        balances: action.balances,
      };
    default:
      return state;
  }
}

export const receiveAccessToken = (accessToken) => {
  return {
    type: RECEIVE_ACCESS_TOKEN,
    accessToken,
  }
}


export const fetchCurrentUser = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_CURRENT_USER,
    });

    try {
      const {profile, balances} = await service.fetchCurrentUser();
      
      dispatch({
        type: RECEIVE_CURRENT_USER,
        profile,
        balances,
      });
    } catch(er) {
      console.error(er);
    }
  }
}

export const lockAccount = () => {
  return {
    type: LOCK_ACCOUNT,
  }
}