const redirectUri = process.env.OAUTH_REDIRECT_URI;
const clientId = process.env.OAUTH_CLIENT_ID;
const backendUrl = process.env.BACKEND_URL;

export const getAuthorizationUrl = () => {
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  return `${backendUrl}/oauth/authorize`
    + `?client_id=${clientId}`
    + `&redirect_uri=${encodedRedirectUri}`
    + '&response_type=token'
    + '&scope=';
}
