import {get} from 'lib/backend-client';

export const fetchUser = async () => {
  return await get('/api/me');
}
