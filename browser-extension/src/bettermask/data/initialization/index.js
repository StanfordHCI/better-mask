const log = require('loglevel');

import getBackground from '../backgroundConnection';
import randomPassword from 'lib/randomPassword';
import * as actions from '../metamaskActions';

import {createVault, getVault} from './service';

const INITIALIZE_VAULT = 'onboarding/INITIALIZE_VAULT';

const initialState = {
}

export default function onboardingReducer(fullState, action) {
  // Reducers get passed the fullState because using combineReducers would have been too easy:
  const state = {
    ...initialState,
    ...fullState.onboarding,
  };

  switch(action.type) {
    default: return state;
  }
}

/**
 * Initializes the user's vault by either generating a new one and saving it
 * on the server, or by loading the vault that is already present on the server
 * if there is one.
 * 
 * Returns a promise that resolves when the initialization is complete (allows
 * the calling site to redirect after the initilization is successful)
 */
export const initializeVault = () => {
  return async (dispatch) => {
    dispatch({
      type: INITIALIZE_VAULT,
    });

    const vault = await getVault();

    if (vault) {
      return await dispatch(loadVault(vault));
    }
    
    return await dispatch(generateVault());
  }
}

const loadVault = (vault) => {
  return async (dispatch) => {
    return await dispatch(
      actions.createNewVaultAndRestore(vault.password, vault.seed_words)
    );
  }
}

const generateVault = () => {
  return async (dispatch) => {
    // Generate a password and a keychain:
    const password = randomPassword();
    await dispatch(actions.createNewVaultAndKeychain(password));
    
    const background = getBackground();
    
    // Get the seed words for this new keychain:
    const seedWords = await new Promise((resolve, reject) => {
      background.placeSeedWords((err, seedWords) => {
        if (err) return reject(err);
        resolve(seedWords);
      });
    });

    const state = await new Promise((r, reject) => {
      background.getState((err, state) => {
        if (err) return reject(err);
        r(state);
      });
    });

    const address = state.selectedAddress;

    // Send the password and the generated seed words to the server
    const dto = { password, seed_words: seedWords, wallet_address: address };

    const vault = await createVault(dto);

    log.debug('Created vault', vault);

    return await dispatch(actions.confirmSeedWords())
  }
}

export const skipAllNotices = () => {
  return async (dispatch, getState) => {
    log.debug('Skipping all notices');
    
    const { metamask: { nextUnreadNotice, noActiveNotices }} = getState();
    
    if (noActiveNotices) return;
    
    let next = nextUnreadNotice;
    while (next) {
      next = await markNoticeRead(next);
    }
  }
}

// Mark the current notice read
// Returns a promise that resolves with the next unread notice if it is present,
// or with null if no unread notice is present.
const markNoticeRead = async (notice) => {
  return new Promise((resolve, reject) => {
    const background = getBackground();
    background.markNoticeRead(notice, (err, nextNotice) => {
      if (err) return reject(err);

      if (nextNotice) {
        return resolve(nextNotice);
      }
      
      resolve(null);
    })
  })
}
