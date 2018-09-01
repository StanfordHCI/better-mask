import * as service from './service';
import { receiveApplication } from '../applications';

export const REFERRAL_TOKEN_LOCALSTORAGE_KEY = '__be_pending_referral_token__';


const CREATE_PENDING_REFERRAL = "referrals/CREATE_PENDING_REFERRAL";
const PENDING_REFERRAL_CREATED = "referrals/PENDING_REFERRAL_CREATED";
const SAVE_REFERRAL_TOKEN = "referrals/SAVE_REFERRAL_TOKEN";
const CLAIM_REFERRAL_TOKEN = "referrals/CLAIM_REFERRAL_TOKEN";
const REFERRAL_TOKEN_CLAIMED = "referrals/REFERRAL_TOKEN_CLAIMED";

const initialState = {
  creatingPendingReferral: false,
  pendingReferrals: [],
  referralToken: localStorage.getItem(REFERRAL_TOKEN_LOCALSTORAGE_KEY) || null,
};

export default function referralsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_PENDING_REFERRAL:
      return {
        ...state,
        creatingPendingReferral: true,
      };
    case PENDING_REFERRAL_CREATED:
      const pendingReferrals = state.pendingReferrals.concat([action.referral]);
      return {
        ...state,
        creatingPendingReferral: false,
        pendingReferrals,
      };
    case SAVE_REFERRAL_TOKEN:
      return {
        ...state,
        referralToken: action.token,
      };
    default: return state;
  }
}

export const createPendingReferral = (referral_code, application_slug, http_referrer) => {
  return async (dispatch, getState) => {
    dispatch({
      type: CREATE_PENDING_REFERRAL,
    })

    try {
      const dto = { referral_code, application_slug, http_referrer };

      // Add the current existing token to the request if we already have one stored:
      const existingToken = getState().referrals.referralToken;
      if (existingToken) dto.referral_token = existingToken;

      const ref = await service.createPendingReferral(dto);

      const app = ref.application;
      delete ref.application;

      const token = ref.token;
      delete ref.token;

      dispatch(receiveApplication(app));
      dispatch(saveReferralToken(token))

      dispatch({
        type: PENDING_REFERRAL_CREATED,
        referral: ref,
      });
    } catch (er) {
      console.error(er);
    }
  }
}

const saveReferralToken = (token) => {
  return (dispatch) => {
    // TODO throw if the key is already set (don't overwrite an existing token)!
    localStorage.setItem(REFERRAL_TOKEN_LOCALSTORAGE_KEY, token);
    dispatch({
      type: SAVE_REFERRAL_TOKEN,
      token,
    });
  }
}

export const claimReferralToken = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const referralsState = state.referrals;
    // TODO check state.auth to make sure the user is authenticated

    const token = referralsState.referralToken;

    if (token == null) return;

    dispatch({
      type: CLAIM_REFERRAL_TOKEN,
    });

    await service.claimReferralToken(token);

    dispatch({
      type: REFERRAL_TOKEN_CLAIMED,
    })
  }
}
