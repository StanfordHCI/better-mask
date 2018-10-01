import React from 'react';
import {connect} from 'react-redux';
import extension from 'extensionizer';

import {tryUnlockAccount, receiveAccessToken} from 'data/auth';
import {fetchVaultUnlockPassword} from 'data/auth/service';
import { DEFAULT_ROUTE, INITIALIZE_ROUTE } from 'routes';
import { colors } from 'theme';

import {getStoredToken} from 'lib/backend-client';
import {isCrossClientOAuthFlow, dismissCrossClientOAuthFlow} from 'lib/crossClientOAuth';

import CircularProgress from '@material-ui/core/CircularProgress';
import {fetchProfile} from 'data/user';
import {dismissOngoingAuthFlow} from 'lib/authFlow';

class AuthCallback extends React.Component {
  state = {
    error: null,
  }

  async componentDidMount() {
    try {
      // auth-callback.html should have saved the access token in extension.storage.local
      // We retrieve it here and store it in Redux to make it usable by any call to 
      // Bettermask client methods later on:
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

        this.props.fetchProfile();

        return this.props.history.push(DEFAULT_ROUTE);
      }

      this.props.history.push(INITIALIZE_ROUTE);
    } catch(er) {
      // TODO save the caught error's message in redux and make sure it is displayed on the home page after redirect
    
      console.error('AuthCallback failed to unlock Account');
      console.error(er);
      this.props.history.push(DEFAULT_ROUTE);
    } finally {
      await dismissOngoingAuthFlow();
    }
  }

  render() {
    const {error} = this.state;
    if (error) return (<div>Oops! The following error occurred: {error}</div>)

    // If no error happens, this component should stay out of sight. Showing the spinner
    // is handled in Redux, and componentDidMount redirects the user to DEFAULT_ROUTE if
    // the authentication & vault unlocking process is successful
    return (
      <div style={{height: 'calc(100% - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{marginBottom: 32}}>
          <CircularProgress size={50} />
        </div>
        <p style={{color: colors.primary}} >Unlocking your vault...</p>
      </div>
    );
  }
}

export default connect((state) => ({
  accountInitialized: state.metamask.isInitialized,
}), (dispatch) => ({
  receiveAccessToken: token => dispatch(receiveAccessToken(token)),
  tryUnlockAccount: password => dispatch(tryUnlockAccount(password)),
  fetchProfile: () => dispatch(fetchProfile()),
}))(AuthCallback)
