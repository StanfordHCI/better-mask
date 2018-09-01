import React from 'react';
import {connect} from 'react-redux';

import txHelper from 'lib/tx-helper';

class PendingTransactions extends React.Component {
  getPendingTxs = () => {
    const {metamaskState} = this.props;
    const {
      network,
      unapprovedTxs,
      unapprovedMsgs,
      unapprovedPersonalMsgs,
      unapprovedTypedMessages,
    } = metamaskState;
  
    const unconfTxList = txHelper(
      unapprovedTxs,
      unapprovedMsgs,
      unapprovedPersonalMsgs,
      unapprovedTypedMessages,
      network
    );
  
    console.log(unconfTxList);
  }

  render() {
    const pendingTxs = this.getPendingTxs();

    return (
      <div>
        <h1>Pending transactions</h1>

        <ul>
          {
            pendingTxs.map((tx) => {
              <li><Link to={}></Link></li>
            })
          }
        </ul>
      </div>
    )
  }
}

export default connect((state) => ({
  metamaskState: state.metamask,
}), (dispatch) => ({
}))(PendingTransactions);