import { getEnvironmentType } from './utils';

const MetamascaraPlatform = require('metamask-crx/app/scripts/platforms/window')
const { ENVIRONMENT_TYPE_POPUP } = require('metamask-crx/app/scripts/lib/enums')
const { OLD_UI_NETWORK_TYPE } = require('metamask-crx/app/scripts/controllers/network/enums')

// XXX does this need to be exported ?
export const UPDATE_METAMASK_STATE = 'metamask/UPDATE_METAMASK_STATE';

const initialState = {
  isInitialized: false,
  isUnlocked: false,
  isAccountMenuOpen: false,
  isMascara: window.platform instanceof MetamascaraPlatform,
  isPopup: getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP,
  rpcTarget: 'https://rawtestrpc.metamask.io/',
  identities: {},
  unapprovedTxs: {},
  noActiveNotices: true,
  nextUnreadNotice: undefined,
  frequentRpcList: [],
  addressBook: [],
  selectedTokenAddress: null,
  contractExchangeRates: {},
  tokenExchangeRates: {},
  tokens: [],
  pendingTokens: {},
  send: {
    gasLimit: null,
    gasPrice: null,
    gasTotal: null,
    tokenBalance: null,
    from: '',
    to: '',
    amount: '0x0',
    memo: '',
    errors: {},
    maxModeOn: false,
    editingTransactionId: null,
    forceGasMin: null,
    toNickname: '',
  },
  coinOptions: {},
  useBlockie: false,
  featureFlags: {},
  networkEndpointType: OLD_UI_NETWORK_TYPE,
  isRevealingSeedWords: false,
  welcomeScreenSeen: false,
  currentLocale: '',
};

export default function metamaskReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_METAMASK_STATE:
      // TODO do we really need this double spread?
      // Couldn't we just return action.value?
      return {
        ...state,
        ...action.value,
      };
    default:
      return state;
  }
}

export const updateMetamaskState = (value) => {
  return {
    type: UPDATE_METAMASK_STATE,
    value,
  }
};
