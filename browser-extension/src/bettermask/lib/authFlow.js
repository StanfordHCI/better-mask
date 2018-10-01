import {AUTH_FLOW_ONGOING_STORAGE_KEY} from '../../constants';
import AsyncStorage from './AsyncStorage';


export const isGoingThroughAuthFlow = async () => {
  const a = await AsyncStorage.get(AUTH_FLOW_ONGOING_STORAGE_KEY);
  return !!a || false;
}

export const dismissOngoingAuthFlow = async () => {
  return await AsyncStorage.set(AUTH_FLOW_ONGOING_STORAGE_KEY, false);
}

export const setOngoingAuthFlow = async () => {
  return await AsyncStorage.set(AUTH_FLOW_ONGOING_STORAGE_KEY, true);
}
