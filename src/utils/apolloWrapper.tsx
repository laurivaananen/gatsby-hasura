import React, { useState, useEffect, useContext } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client"
import fetch from "cross-fetch"
import { WireframeContext } from "./contextWrapper"

const ApolloWrapper: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null
}> = ({ children }) => {
  const [token, setToken] = useState(undefined)
  const { user, getAccessTokenSilently, isLoading } = useAuth0()
  const wireframe = useContext(WireframeContext)

  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: "https://moved-ferret-33.hasura.app/v1/graphql",
      })
      setToken(accessToken)
      wireframe.setClientReady(true)
    }
    if (user) {
      console.log("USER FOUND! GETTING ACCESS TOKEN")
      getAccessToken()
    } else if (isLoading) {
      console.log("LOADING FOR USER!")
    } else {
      console.log("NO USER :-(")
      wireframe.setClientReady(true)
    }
  }, [getAccessTokenSilently])

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: "https://moved-ferret-33.hasura.app/v1/graphql",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      fetch,
    }),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
