import React from 'react';
import {connect} from 'react-redux';
import {initializeVault} from 'data/initialization';
import {DEFAULT_ROUTE} from 'routes';

import {isCrossClientOAuthFlow, dismissCrossClientOAuthFlow} from 'lib/crossClientOAuth';

import CircularProgress from '@material-ui/core/CircularProgress';
import {colors} from 'theme';


class GenerateVault extends React.Component {
  async componentDidMount() {
    await this.generateVault();
  }

  generateVault = async () => {
    await this.props.initializeVault();
    
    const closeWindowAfterAuth = await isCrossClientOAuthFlow();
    await dismissCrossClientOAuthFlow();
    
    if (closeWindowAfterAuth) {
      window.close();
    } else {
      this.props.history.push(DEFAULT_ROUTE);
    }
  }

  render() {
    return (
      <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{marginBottom: 32}}>
          <CircularProgress size={50} />
        </div>
        <p style={{color: colors.primary}}>Loading your coins...</p>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    
  }
}, (dispatch) => {
  return {
    initializeVault: () => dispatch(initializeVault()),
  }
})(GenerateVault);