import axios from 'axios';
import extension from 'extensionizer';

import {API_TOKEN_STORAGE_KEY, BACKEND_URL} from '../../constants';

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

export async function clearStoredToken() {
  return new Promise((resolve, reject) => {
    extension.storage.local.remove(API_TOKEN_STORAGE_KEY, () => {
      if (extension.runtime.lastError) reject();
      resolve(null);
    });
  });
}

const req = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

async function getOptions() {
  const token = await getStoredToken();
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  return { headers };
}

async function handleError(er) {
  if (er.response && er.response.status === 401) {
    console.error("Caught unauthorized error");
    await clearStoredToken();
    window.location = '/home.html#unlock';
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
    await handleError(er);
  }
}

export async function post(url, body) {
  try {
    const options = await getOptions();
    const res = await req.post(url, body, options);
    return res.data;
  } catch(er) {
    await handleError(er);
  }
}
