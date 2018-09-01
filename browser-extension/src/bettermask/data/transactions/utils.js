export const TX_TYPE_TRANSACTION = "TX_TYPE/TRANSACTION"
export const TX_TYPE_SIGNATURE_REQUEST = "TX_TYPE/SIGNATURE_REQUEST"

export const getTxType = (tx) => {
  if (tx.txParams) {
    return TX_TYPE_TRANSACTION;
  }
  if (tx.msgParams) {
    return TX_TYPE_SIGNATURE_REQUEST;
  }

  throw new Error('getTxType: unrecognised transaction type');
}