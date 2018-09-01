import {get} from '../request';

export const getApplications = async () => {
  return await get('/apps');
}
