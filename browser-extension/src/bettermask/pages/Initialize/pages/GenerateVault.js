import React from 'react';
import {connect} from 'react-redux';
import {initializeVault} from 'data/initialization';
import {DEFAULT_ROUTE} from 'routes';

import {isCrossClientOAuthFlow, dismissCrossClientOAuthFlow} from 'lib/crossClientOAuth';

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
    return null;
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