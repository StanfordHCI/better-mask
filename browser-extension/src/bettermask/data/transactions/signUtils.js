import log from 'loglevel';

import getBackground from "../backgroundConnection";

export const signPersonalMsg = async (msgParams) => {
  log.debug('signUtils#signPersonalMsg');

  debugger;

  return new Promise((resolve, reject) => {
    const background = getBackground();

    background.signPersonalMessage(msgParams, (err, newState) => {
      debugger;
      if (err) {
        return reject(err);
      }
      
      return resolve(newState);
    });
  });
}