import {get, post} from '../request';

export const fetchReferralLinks = async () => {
  return await get(`/referral_links`)
}

export const getOrCreateReferralLink = async (appId) => {
  return await post(`/applications/${appId}/referral_links`)
}
