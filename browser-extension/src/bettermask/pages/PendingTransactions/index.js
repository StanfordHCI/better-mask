import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import txHelper from 'lib/tx-helper';
import {hexToText} from './utils';
import Button from '@material-ui/core/Button';
import {signTransaction} from 'data/transactions';
import {getTxType, TX_TYPE_SIGNATURE_REQUEST, TX_TYPE_TRANSACTION} from 'data/transactions/utils';


const PendingTransaction = (props) => {
  const {transaction, onConfirm} = props;

  let txType;

  try {
    txType = getTxType(transaction);
    if (txType == null) throw new Error('PendingTransaction: txType null or undefined')
  } catch(er) {
    return (
      <div>
        <h4>Error: unrecognised transaction type :(</h4>
      </div>
    )
  }

  if (txType === TX_TYPE_SIGNATURE_REQUEST) {
    return (
      <div style={{background: 'white', border: '1px solid black', padding: 8}}>
        <h4>Signature request</h4>

        <p>
          <Link to={`/confirm-transaction/${transaction.id}`}>#{transaction.id}</Link>
        </p>
  
        <p>{hexToText(transaction.msgParams.data)}</p>
  
        <div>
          <Button variant="raised" color="primary" onClick={onConfirm}>Confirm</Button>
          <Button variant="raised">Dismiss</Button>
        </div>
      </div>
    );
  }

  if (txType === TX_TYPE_TRANSACTION) {
    return (
      <div style={{background: 'white', border: '1px solid black', padding: 8}}>
        <h4>Pending transaction</h4>

        <p>
          <Link to={`/confirm-transaction/${transaction.id}`}>#{transaction.id}</Link>
        </p>
  
        <pre style={{width: "100%", maxHeight: 300, overflow: 'auto'}} >
          {JSON.stringify(transaction.txParams, null, 2)}
        </pre>
  
        <div>
          <Button variant="raised" color="primary" onClick={onConfirm}>Confirm</Button>
          <Button variant="raised">Dismiss</Button>
        </div>
      </div>
    );
  }
}

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

    return unconfTxList;
  }

  render() {
    const pendingTxs = this.getPendingTxs();

    return (
      <div style={{padding: 24}}>
        <h1>Pending transactions</h1>
        
        {
          pendingTxs.map((tx) => {
            return <PendingTransaction key={tx.id} transaction={tx} onConfirm={() => this.props.signTransaction(tx.id)} />
          })
        }
      </div>
    )
  }
}

export default connect((state) => ({
  metamaskState: state.metamask,
}), (dispatch) => ({
  signTransaction: (id) => dispatch(signTransaction(id)),
}))(PendingTransactions);