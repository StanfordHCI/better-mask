import axios from 'axios';
import extension from 'extensionizer';

import {API_TOKEN_STORAGE_KEY} from '../../constants';

export async function getStoredToken() {
  return new Promise(resolve => {
    extension.storage.local.get(API_TOKEN_STORAGE_KEY, (keys) => {
      if (keys[API_TOKEN_STORAGE_KEY]){
        return resolve(keys[API_TOKEN_STORAGE_KEY]);
      };

      resolve(null);
    });
  });
}

// never imported?
export const BACKEND_URL = process.env.BACKEND_URL;

const req = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

async function getOptions() {
  const token = await getStoredToken();
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  return { headers };
}

function handleError(er) {
  if (er.response && er.response.status === 401) {
    console.error("Caught unauthorized error");
    window.location = '/home.html';
  } else {
    throw er;
  }
}

export async function get(url) {
  try {
    const options = await getOptions();
    const res = await req.get(url, options);
    return res.data;
  } catch(er) {
    handleError(er);
  }
}

export async function post(url, body) {
  try {
    const options = await getOptions();
    const res = await req.post(url, body, options);
    return res.data;
  } catch(er) {
    handleError(er);
  }
}
