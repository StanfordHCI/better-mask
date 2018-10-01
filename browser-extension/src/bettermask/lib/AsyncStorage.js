import extension from 'extensionizer';

// could be export const get & export const set, but doing it with static methods on a class forces 
// the calling context to explicitely write AsyncStorage.get & AsyncStorage.set (easier to read and
// grep through the code)

export default class AsyncStorage {
  static get = async (key) => {
    const storage = extension.storage.local;
    
    return new Promise((resolve) => {
      storage.get(key, (keys) => {
        // useless condition?
        if (typeof keys[key] !== "undefined") {
          return resolve(keys[key]);
        }
  
        // ???
        resolve(undefined);
      });
    });
  }
  
  static set = async (key, value) => {
    const storage = extension.storage.local;
    
    return new Promise((resolve) => {
      storage.set({[key]: value}, function(value) {
        resolve(value);
      });
    });
  }
}