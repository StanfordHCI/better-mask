import extension from 'extensionizer';
import {API_TOKEN_STORAGE_KEY} from './constants';

async function extractAccessToken() {
  const params = {};
  
  // substring to get rid of #
  const queryString = window.location.hash.substring(1);
  const regex = /([^&=]+)=([^&]*)/g;
  let m = regex.exec(queryString);

  while (m) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    m = regex.exec(queryString);
  }

  if (!process.env.METAMASK_DEBUG) {
    window.history.replaceState({}, "Authenticating...", "/#_=_");
  }

  if (!params.access_token) {
    return;
  }

  const accessToken = params.access_token;

  if (accessToken) {
    const storage = extension.storage.local;
    await storage.set({[API_TOKEN_STORAGE_KEY]: accessToken});
  }
}

extractAccessToken().then(() => {
  redirectOrRenderDebugLink('/home.html#auth-callback');
});

const redirectOrRenderDebugLink = (url) => {
  if (process.env.METAMASK_DEBUG) {
    document.getElementById('debug-redirect-link__a').href = url;
    document.getElementById('debug-redirect-link').style.display = 'block';
    return;
  }
  
  window.location = '/home.html#auth-callback';
}
