import React from 'react';
import {connect} from 'react-redux';
import extension from 'extensionizer';

import {tryUnlockAccount, receiveAccessToken} from 'data/auth';
import {fetchVaultUnlockPassword} from 'data/auth/service';
import { DEFAULT_ROUTE, INITIALIZE_ROUTE } from 'routes';

import {getStoredToken} from 'lib/backend-client';
import {isCrossClientOAuthFlow, dismissCrossClientOAuthFlow} from 'lib/crossClientOAuth';

class AuthCallback extends React.Component {
  state = {
    error: null,
  }

  async componentDidMount() {
    try {
      // auth-callback.html should have saved the access token in extension.storage.local
      // We retrieve it here and store it in Redux to make it usable by any call to 
      // blockchain explorer client methods later on:
      // TODO authReducer#loadAuthenticationStatus
      const token = await getStoredToken();
      this.props.receiveAccessToken(token);
      
      if (this.props.accountInitialized) {
        const passwordDto = await fetchVaultUnlockPassword();
        const pwd = passwordDto.vaultUnlockPassword;
        
        await this.props.tryUnlockAccount(pwd);
        
        const isCrossClient = await isCrossClientOAuthFlow();
        await dismissCrossClientOAuthFlow();

        console.log('isCrossClient', isCrossClient);

        if (isCrossClient) {
          return window.close();
        }

        return this.props.history.push(DEFAULT_ROUTE);
      }

      this.props.history.push(INITIALIZE_ROUTE);
    } catch(er) {
      // TODO save the caught error's message in redux and make sure it is displayed on the home page after redirect
    
      console.error('AuthCallback failed to unlock Account')
      console.error(er)
      this.props.history.push(DEFAULT_ROUTE);
    }
  }

  render() {
    const {error} = this.state;
    if (error) return (<div>Oops! The following error occurred: {error}</div>)

    // If no error happens, this component should stay out of sight. Showing the spinner
    // is handled in Redux, and componentDidMount redirects the user to DEFAULT_ROUTE if
    // the authentication & vault unlocking process is successful
    return null;
  }
}

export default connect((state) => ({
  accountInitialized: state.metamask.isInitialized,
}), (dispatch) => ({
  receiveAccessToken: token => dispatch(receiveAccessToken(token)),
  tryUnlockAccount: password => dispatch(tryUnlockAccount(password)),
}))(AuthCallback)
