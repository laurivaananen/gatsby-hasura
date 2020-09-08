import React, { useState } from "react"

const defaultState = {
  clientReady: false,
  userSub: undefined,
  setClientReady: (value: boolean) => {},
  setUserSub: (value: string) => {},
}

export const WireframeContext = React.createContext(defaultState)

export const WireframeProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null
}> = ({ children }) => {
  const [clientReady, setClientReady] = useState(false)
  const [userSub, setUserSub] = useState("")

  const setClientReadyValue = (value: boolean) => {
    setClientReady(value)
  }

  const setUserSubValue = (value: string) => {
    setUserSub(value)
  }

  return (
    <WireframeContext.Provider
      value={{
        clientReady,
        setClientReady: setClientReadyValue,
        userSub,
        setUserSub: setUserSubValue,
      }}
    >
      {children}
    </WireframeContext.Provider>
  )
}
