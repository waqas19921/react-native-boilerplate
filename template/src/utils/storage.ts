import { MMKV } from 'react-native-mmkv';
import { Storage } from 'redux-persist';

const storage = new MMKV();

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export const loadObj = (key: string): any | null => {
  try {
    const almostThere = storage.getString(key) || '';
    return JSON.parse(almostThere) || null;
  } catch {
    return null;
  }
};

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export const saveObj = (key: string, value: any): boolean => {
  try {
    storage.set(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export default storage;
