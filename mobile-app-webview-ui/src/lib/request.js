import axios from 'axios';

import {store} from 'store';

if (process.env.REACT_APP_BACKEND_URL == null) {
  throw new Error(`
    No backend URL specified in build configuration.
    Provide one using the REACT_APP_BACKEND_URL env variable
  `);
}

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const req = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'}
});

function getOptions() {
  const state = store.getState();
  const token = state.auth.accessToken;
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

  return { headers };
}

function handleError(er) {
  if (er.response && er.response.status === 401) {
    console.log("Caught unauthorized error");
    window.location = '/mobile-app-ui/close.html';
  } else {
    throw er;
  }
}

export async function get(url) {
  try {
    const res = await req.get(url, getOptions());
    return res.data;
  } catch(er) {
    handleError(er);
  }
}

export async function post(url, body) {
  try {
    const res = await req.post(url, body, getOptions());
    return res.data;
  } catch(er) {
    handleError(er);
  }
}
