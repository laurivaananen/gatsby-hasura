import React, { useState } from "react"

const defaultState = {
  clientReady: false,
  setClientReady: (value: boolean) => {},
}

export const WireframeContext = React.createContext(defaultState)

export const WireframeProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null
}> = ({ children }) => {
  const [clientReady, setClientReady] = useState(false)

  const setClientReadyValue = (value: boolean) => {
    setClientReady(value)
  }

  return (
    <WireframeContext.Provider
      value={{ clientReady, setClientReady: setClientReadyValue }}
    >
      {children}
    </WireframeContext.Provider>
  )
}
