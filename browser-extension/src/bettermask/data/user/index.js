import * as service from './service';

const FETCH_PROFILE = 'user/FETCH_PROFILE';
const RECEIVE_PROFILE = 'user/RECEIVE_PROFILE';

const initialState = {
  profile: null,
  fetchingProfile: false,
};

export default function userReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_PROFILE:
      return {
        ...state,
        fetchingProfile: true,
      };
    case RECEIVE_PROFILE:
      return {
        ...state,
        profile: action.profile,
        balances: action.balances,
        fetchingProfile: false,
      };
    default:
      return state;
  }
}

export const fetchProfile = () => {
  return async (dispatch) => {
    dispatch({
      type: FETCH_PROFILE,
    });

    try {
      const {profile, balances} = await service.fetchUser();
      
      dispatch({
        type: RECEIVE_PROFILE,
        profile,
        balances,
      });
    } catch(er) {
      console.error(er);
    }
  }
}
