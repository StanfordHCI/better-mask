FROM ethereum/client-go:latest

# Copy genesis file:
COPY ./docker/becoin.json /becoin.json

# Copy entrypoint script:
COPY ./docker/sealer/entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# ENTRYPOINT [ \
#   "geth", \
#   "--syncmode 'full'", \
#   "--port 30310", \
#   "--rpc", "--rpcaddr '0.0.0.0'", \
#   "--rpcport 8545", "--rpcapi 'personal,db,eth,net,web3,txpool,miner'", \
#   "--bootnodes 'enode://eebdc11cff5e48855ca3601260e8217f47c20168ced6726ff62449ca26c4d2369229bab8e959478fe19969f52c06fc31ea812c87e24b30390f2fb2b63f1a8346@172.17.0.3:30310'", \
#   "--networkid 314", \
#   "--gasprice '1'", \
#   "-unlock '0xaf065f9f7094d84418713e89bc5e666044566537'", \
#   "--password password.txt", \
#   "--mine" \
# ]
