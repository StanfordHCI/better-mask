import React from 'react';
import extension from 'extensionizer';

import Button from '@material-ui/core/Button';

import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {INITIALIZE_GENERATE_VAULT_ROUTE} from '../routes';
import {getAuthorizationUrl} from 'data/auth/utils';
import AsyncStorage from 'lib/AsyncStorage';
import {START_OAUTH_FLOW_MESSAGE_TYPE} from '../../../../constants';

const HEADER_STYLE = {
  fontSize: '1.65em',
  marginBottom: 14,
}

class SocialLogin extends React.Component {
  startAuthFlow = () => {
    extension.runtime.sendMessage({
      type: START_OAUTH_FLOW_MESSAGE_TYPE,
    });
    
    window.close();
  }

  render() {
    const {authenticated} = this.props;
    
    if (authenticated) {
      return <Redirect to={INITIALIZE_GENERATE_VAULT_ROUTE} />
    }

    return (
      <div style={{height: '100%', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <p style={{textAlign: 'center', fontSize: '1.4em'}}>
          Welcome to Bettermask!
        </p>

        <p style={{textAlign: 'center', fontSize: '1.4em'}}>
          Your coins are waiting! Please verify your identity to claim them.
        </p>


        <div style={{marginBottom: 48}} >          
          <Button
            variant="raised"
            color="primary"
            size="large"
            onClick={this.startAuthFlow}>
            Sign in with Faceboook
          </Button>
        </div>

        <p>
          We respect your privacy. We are only requesting your first name,
          last name and profile picture.
        </p>
      </div>
    );
  }
}

export default connect((state) => ({
  store: state,
  authenticated: state.auth.authenticated,
  isPopup: state.metamask.isPopup,
}), (dispatch) => ({
}))(SocialLogin);

SocialLogin.contextTypes = {
  t: PropTypes.func,
}