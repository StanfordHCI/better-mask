const ethUtil = require('ethereumjs-util');

export const hexToText = (hex) => {
  try {
    const stripped = ethUtil.stripHexPrefix(hex);
    const buff = Buffer.from(stripped, 'hex');
    return buff.toString('utf8');
  } catch (e) {
    return hex;
  }
}