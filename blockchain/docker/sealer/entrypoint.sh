#! /bin/sh

geth --datadir /datadir init becoin.json

echo $SEALER_PASSWORD > /password.txt

geth \
  --datadir /datadir \
  --syncmode 'full' \
  --port 30303 \
  --rpc --rpcaddr '0.0.0.0' \
  --rpcport 8545 \
  --rpcapi 'db,eth,net,web3,shh' \
  --networkid '314' \
  --gasprice '1' \
  --unlock ${SEALER_ADDRESS} \
  --password /password.txt \
  --mine
