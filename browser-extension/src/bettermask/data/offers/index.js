import * as service from './service';

const FETCH_OFFERS = 'offers/FETCH_OFFERS';
const RECEIVE_OFFERS = 'offers/RECEIVE_OFFERS';

const initialState = {
  stats: null,
  offers: null,
  loading: false,
  referralLinks: null,
};

export default function offersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_OFFERS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_OFFERS:
      return {
        ...state,
        loading: false,
        offers: action.offers,
        stats: action.stats,
        referralLinks: action.referralLinks,
      };
    default: return state;
  }
}

export function fetchOffers() {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_OFFERS,
      });
      
      const [offersResponse, stats, referralLinks] = await Promise.all([
        service.fetchOffers(),
        service.fetchReferralStats(),
        service.fetchReferralLinks(),
      ]);
      
      dispatch({
        type: RECEIVE_OFFERS,
        offers: offersResponse.offers,
        stats,
        referralLinks,
      });
    } catch(er) {
      console.error(er);
    }
  }
}
