import {post} from '../request';

import {REFERRAL_TOKEN_LOCALSTORAGE_KEY} from './index';

export const createPendingReferral = async (dto) => {
  return await post('/referrals', dto);
}

export const convertPendingReferral = async () => {
  if (!hasPendingReferral()) return;

  // const token = localStorage.getItem(REFERRAL_TOKEN_LOCALSTORAGE_KEY);
  // await post('/referrals/convert', {token});
  // deletePendingReferral();
}

export const claimReferralToken = async (token) => {
  return await post('/referral_tokens/claim', { token })
}

// utils

export const hasPendingReferral = () => {
  return !!localStorage.getItem(REFERRAL_TOKEN_LOCALSTORAGE_KEY);
}

export const deletePendingReferral = () => {
  localStorage.removeItem(REFERRAL_TOKEN_LOCALSTORAGE_KEY);
}

export const getPendingReferral = () => {
  return JSON.parse(localStorage.getItem(REFERRAL_TOKEN_LOCALSTORAGE_KEY));
}
