import {get} from 'lib/request';

export const fetchCurrentUser = async () => {
  return get('/api/me');
}