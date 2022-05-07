import * as React from 'react'

import { AsyncStorage, NoopStorage } from '../async-storage'

export interface ProviderContext {
  storage: AsyncStorage
}

export const ProviderContext = React.createContext<ProviderContext | null>(null)

export function useProvider<Output>(
  select: (context: ProviderContext) => Output
) {
  const context = React.useContext(ProviderContext)

  if (!context) {
    throw new Error('useProvider must be used within a Provider')
  }

  return select(context)
}

const DEFAULT_STORAGE = new NoopStorage()

export interface ProviderProps {
  storage: AsyncStorage
  children?: React.ReactNode
}

function Provider({ storage = DEFAULT_STORAGE, children }: ProviderProps) {
  return (
    <ProviderContext.Provider value={{ storage }}>
      {children}
    </ProviderContext.Provider>
  )
}

export default Provider
