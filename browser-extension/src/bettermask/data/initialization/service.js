import {get, post} from 'lib/backend-client';

export const getVault = async () => {
  return await get('/api/vaults');
}

export const createVault = async (dto) => {
  return await post('/api/vaults', dto);
}
