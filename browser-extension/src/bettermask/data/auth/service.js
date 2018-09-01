import {get} from 'lib/backend-client';

export const fetchVaultUnlockPassword = async () => {
  return await get('/api/vaults/unlock')
}