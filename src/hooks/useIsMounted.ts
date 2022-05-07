import * as React from 'react'

function useIsMounted() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)

    return () => {
      // onUnmount?.()
    }
  }, [])

  return isMounted
}

export default useIsMounted
