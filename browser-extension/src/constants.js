// Storage config:

export const BACKEND_URL = process.env.BACKEND_URL;

const prefix = 'bettermask__';

export const TOKEN_RECEIVED_MESSAGE_TYPE = prefix + 'access-token-received';
export const OAUTH_CALLBACK_MESSAGE_TYPE = prefix + 'oauth-callback';
export const START_OAUTH_FLOW_MESSAGE_TYPE = prefix + 'start-auth-flow';

export const API_TOKEN_STORAGE_KEY = prefix + 'access-token';
export const OAUTH_CROSS_CLIENT_STORAGE_KEY = prefix + 'cross-client-oauth';
export const AUTH_FLOW_ONGOING_STORAGE_KEY = prefix + 'auth-flow-ongoing';


// UI Config:

export const ADVANCED_MODE = false;


// Network config

export const BETTERMASK_RPC_ENDPOINT = "http://rpc.example.com:8545";
