import React from 'react';
import {connect} from 'react-redux';

import AssetsList from 'components-library/assets/AssetsList';

class Assets extends React.Component {
  componentDidMount() {

  }

  render() {
    const {balances} = this.props;
    return (
      <div style={{minHeight: 'calc(100% - 56px)'}}>
        <AssetsList balances={balances} />
      </div>
    );
  }
}

export default connect((state) => ({
  balances: state.auth.balances,
}), (dispatch) => ({
}))(Assets);