import {get} from 'lib/backend-client';

export const fetchOffers = async () => {
  return await get('/api/offers');
}

export const fetchReferralStats = async () => {
  return await get('/api/referrals');
}

export const fetchReferralLinks = async () => {
  return await get('/api/referral-links');
}
