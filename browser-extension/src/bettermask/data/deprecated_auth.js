import { get } from './request';

export const ACCESS_TOKEN_LOCALSTORAGE_KEY = '__be_access_token__';

export const fetchUser = async () => {
  return await get('/me');
}
