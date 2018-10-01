import logger from 'loglevel';

import txHelper from "lib/tx-helper";
import {signPersonalMsg} from "./signUtils";
import {getTxType, TX_TYPE_SIGNATURE_REQUEST, TX_TYPE_TRANSACTION} from "./utils";

const SELECT_PENDING_TRANSACTION = 'transactions/SELECT_PENDING_TRANSACTION';
const SIGN_TRANSACTION = 'transactions/SIGN_TRANSACTION';

const initialState = {
  selectedPendingTransaction: null,
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SELECT_PENDING_TRANSACTION: return {
      ...state,
      selectedPendingTransaction: action.id,
    };
    default: return state;
  }
}

export const selectTransaction = (id) => {
  return {
    type: SELECT_PENDING_TRANSACTION,
    id,
  };
}

export const signTransaction = (id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SIGN_TRANSACTION,
    });

    logger.info(`Confirming transaction with id ${id}`);

    try {
      const state = getState();

      const {
        network,
        unapprovedTxs,
        unapprovedMsgs,
        unapprovedPersonalMsgs,
        unapprovedTypedMessages,
      } = state.metamask;
    
      const unconfTxList = txHelper(
        unapprovedTxs,
        unapprovedMsgs,
        unapprovedPersonalMsgs,
        unapprovedTypedMessages,
        network
      );

      const tx = unconfTxList.find((tx) => tx.id === id);

      if (tx == null) throw new Error(`signTransaction: tx not found for id ${id}`);
      
      const txType = getTxType(tx);
      
      switch(txType) {
        case TX_TYPE_SIGNATURE_REQUEST: {
          logger.debug(`Tx #${id} appears to be a message signature request`);
          tx.msgParams.metamaskId = id;
          const newState = await signPersonalMsg(tx.msgParams);
          return dispatch(updateMetamaskState(newState));
        }
        case TX_TYPE_TRANSACTION: {
          logger.debug(`Tx #${id} appears to be a financial transaction`);
          
          return;
        }
        default: throw new Error('data/transactions#signTransaction: Unrecognized transaction type.');
      }
      
      // TODO switch on tx.type and/or presence of tx.msgParams etc... to know which signUtil to call.

    } catch(er) {
      console.error(er);
    }
  }
}