import SecureStore from "react-native-secure-storage";
import { Platform } from "react-native";
import { isString } from "lodash";

import { log } from "../utils";

export interface AsyncStorage {
  setItemAsync: (key: string, value: any) => Promise<void>;
  getItemAsync: (key: string) => Promise<any | null>;
  deleteItemAsync: (key: string) => Promise<void>;
}

export class NoopStorage implements AsyncStorage {
  setItemAsync = (_key: string, _value: string) => {
    return Promise.resolve();
  };

  getItemAsync = (_key: string): Promise<string | null> => {
    return Promise.resolve(null);
  };

  deleteItemAsync = (_key: string) => {
    return Promise.resolve();
  };
}

export class MobileStorage extends NoopStorage {
  setItemAsync = (key: string, value: any) => {
    return SecureStore.setItemAsync(key, JSON.stringify(value));
  };

  getItemAsync = async (key: string) => {
    let value: any = null;

    try {
      const raw = await SecureStore.getItemAsync(key);

      if (isString(raw)) {
        value = JSON.parse(raw);
      }
    } finally {
      return value;
    }
  };

  deleteItemAsync = (key: string) => {
    return SecureStore.deleteItemAsync(key);
  };
}

export class WebStorage extends NoopStorage {
  localStorage: Storage;

  constructor() {
    super();
    this.localStorage = window.localStorage;
  }

  setItemAsync = (key: string, value: any) => {
    const nextValue = JSON.stringify(value);

    this.localStorage.setItem(key, nextValue);

    return Promise.resolve();
  };

  getItemAsync = (key: string) => {
    let value: any = null;

    try {
      const raw = this.localStorage.getItem(key);

      if (isString(raw)) {
        value = JSON.parse(raw);
      }
    } finally {
      return Promise.resolve(value);
    }
  };

  deleteItemAsync = (key: string) => {
    this.localStorage.removeItem(key);
    return Promise.resolve();
  };
}

export const makeAsyncStorage = (): AsyncStorage => {
  switch (Platform.OS) {
    case "web":
      return new WebStorage();

    case "ios":
    case "android":
      return new MobileStorage();

    default:
      return new NoopStorage();
  }
};
