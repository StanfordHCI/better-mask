import {OAUTH_CROSS_CLIENT_STORAGE_KEY} from '../../constants';
import AsyncStorage from './AsyncStorage';


export const isCrossClientOAuthFlow = async () => {
  const a = await AsyncStorage.get(OAUTH_CROSS_CLIENT_STORAGE_KEY);
  return !!a || false;
}

export const dismissCrossClientOAuthFlow = async () => {
  return await AsyncStorage.set(OAUTH_CROSS_CLIENT_STORAGE_KEY, false);
}
