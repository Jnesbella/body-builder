import SecureStore from 'react-native-secure-storage'
import { Platform } from 'react-native'

export interface AsyncStorage {
  setItemAsync: (key: string, value: string) => Promise<void>
  getItemAsync: (key: string) => Promise<string | null>
  deleteItemAsync: (key: string) => Promise<void>
}

export class NoopStorage implements AsyncStorage {
  setItemAsync = (_key: string, _value: string) => {
    return Promise.resolve()
  }

  getItemAsync = (_key: string): Promise<string | null> => {
    return Promise.resolve(null)
  }

  deleteItemAsync = (_key: string) => {
    return Promise.resolve()
  }
}

export class MobileStorage extends NoopStorage {
  setItemAsync = (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value)
  }

  getItemAsync = (key: string) => {
    return SecureStore.getItemAsync(key)
  }

  deleteItemAsync = (key: string) => {
    return SecureStore.deleteItemAsync(key)
  }
}

export class WebStorage extends NoopStorage {
  localStorage: Storage

  constructor() {
    super()
    this.localStorage = window.localStorage
  }

  setItemAsync = (key: string, value: string) => {
    this.localStorage.setItem(key, value)
    return Promise.resolve()
  }

  getItemAsync = (key: string) => {
    return Promise.resolve(this.localStorage.getItem(key))
  }

  deleteItemAsync = (key: string) => {
    this.localStorage.removeItem(key)
    return Promise.resolve()
  }
}

export const makeAsyncStorage = (): AsyncStorage => {
  switch (Platform.OS) {
    case 'web':
      return new WebStorage()

    case 'ios':
    case 'android':
      return new MobileStorage()

    default:
      return new NoopStorage()
  }
}
