import getBackground from './backgroundConnection';
import log from 'loglevel';
import {updateMetamaskState} from './metamask';

const SHOW_LOADING = "metamaskActions/SHOW_LOADING";
const HIDE_LOADING = "metamaskActions/HIDE_LOADING";
const DISPLAY_WARNING = "metamaskActions/DISPLAY_WARNING";
const FORGOT_PASSWORD = "metamaskActions/FORGOT_PASSWORD";
const SHOW_ACCOUNTS_PAGE = "metamaskActions/SHOW_ACCOUNTS_PAGE";


/*
 *
 * This file is a (partly refactored) subset of metamask's 2000-LOC actions.js.
 * The logic it contains should eventually be moved into the callsites, since a lot
 * of these functions are only calling functions on the background MetamaskController
 * instance, and dispatching action we don't use anywhere else.
 * 
 * Specifically, most of the refactors we made were turning the dispatchers into
 * async functions containing sequential `await`s instead of the original implementations
 * using promise chains.
 * 
 *
 */


export const createNewVaultAndKeychain = (password) => {
  return dispatch => {
    dispatch(showLoadingIndication())

    return new Promise((resolve, reject) => {
      const background = getBackground();
      background.createNewVaultAndKeychain(password, err => {
        if (err) {
          dispatch(displayWarning(err.message))
          return reject(err)
        }

        log.debug(`background.placeSeedWords`)

        background.placeSeedWords((err) => {
          if (err) {
            dispatch(displayWarning(err.message))
            return reject(err)
          }

          resolve()
        })
      })
    })
    .then(() => forceUpdateMetamaskState(dispatch))
    .then(() => dispatch(hideLoadingIndication()))
    .catch(() => dispatch(hideLoadingIndication()))
  }
}


export const createNewVaultAndRestore = (password, seed) => {
  return (dispatch) => {
    dispatch(showLoadingIndication())
    log.debug(`background.createNewVaultAndRestore`)

    return new Promise((resolve, reject) => {
      const background = getBackground();
      background.createNewVaultAndRestore(password, seed, err => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
    .then(() => dispatch(unMarkPasswordForgotten()))
    .then(() => {
      dispatch(showAccountsPage())
      dispatch(hideLoadingIndication())
    })
    .catch(err => {
      dispatch(displayWarning(err.message))
      dispatch(hideLoadingIndication())
    })
  }
}

export const confirmSeedWords = () => {
  return dispatch => {
    dispatch(showLoadingIndication())
    log.debug(`background.clearSeedWordCache`)
    return new Promise((resolve, reject) => {
      const background = getBackground();
      background.clearSeedWordCache((err, account) => {
        dispatch(hideLoadingIndication())
        if (err) {
          dispatch(displayWarning(err.message))
          return reject(err)
        }

        log.info('Seed word cache cleared. ' + account)
        dispatch(showAccountsPage())
        resolve(account)
      })
    })
  }
}

// backgroundSetLocked
const background_setLocked = async (background) => {
  return new Promise((resolve, reject) => {
    background.setLocked(error => {
      if (error) {
        return reject(error)
      }

      resolve()
    })
  })
}

// updateMetamaskStateFromBackground
const background_getState = async (background) => {
  log.debug(`background.getState`);

  return new Promise((resolve, reject) => {
    background.getState((error, newState) => {
      if (error) {
        return reject(error)
      }

      resolve(newState)
    })
  })
}

export const lockMetamask = () => {
  log.debug(`background.setLocked`);

  return async (dispatch) => {
    const background = getBackground();

    dispatch(showLoadingIndication());

    try {
      await background_setLocked(background);
      
      // TODO refreshMetamaskState in data/metamask, in charge of these two lines:
      const newState = await background_getState(background);
      dispatch(updateMetamaskState(newState))
      
      dispatch(hideLoadingIndication());
    } catch(er) {
      dispatch(displayWarning(er.message));
    }
  }
}

function unMarkPasswordForgotten () {
  return dispatch => {
    log.debug('background.unMarkPasswordForgotten');
    return new Promise(resolve => {
      const background = getBackground();
      background.unMarkPasswordForgotten(() => {
        dispatch(forgotPassword(false))
        resolve()
      })
    })
      .then(() => forceUpdateMetamaskState(dispatch))
  }
}

export const tryUnlockMetamask = (password) => {
  return async (dispatch) => {
    dispatch(showLoadingIndication())
    
    log.debug(`background.submitPassword`)
    
    try {
      const background = getBackground();

      await new Promise((resolve, reject) => {
        background.submitPassword(password, error => {
          if (error) {
            return reject(error)
          }

          resolve()
        });
      })

      const newState = await background_getState(background);
      dispatch(updateMetamaskState(newState));
      
      await new Promise((resolve, reject) => {
        background.verifySeedPhrase(err => {
          if (err) {
            dispatch(displayWarning(err.message))
            return reject(err)
          }

          resolve()
        })
      });
        
      dispatch(hideLoadingIndication());
    } catch(er) {
      dispatch(hideLoadingIndication());
      throw er;
    }
  }
}


function showLoadingIndication (message) {
  return {
    type: SHOW_LOADING,
    value: message,
  }
}

function displayWarning (text) {
  return {
    type: DISPLAY_WARNING,
    value: text,
  }
}

function hideLoadingIndication () {
  return {
    type: HIDE_LOADING,
  }
}

function forgotPassword(value = true) {
  return {
    type: FORGOT_PASSWORD,
    value,
  }
}

function showAccountsPage () {
  return {
    type: SHOW_ACCOUNTS_PAGE,
  }
}
