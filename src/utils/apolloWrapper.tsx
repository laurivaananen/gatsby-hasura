import React, { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client"
import fetch from "cross-fetch"

const ApolloWrapper: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null
}> = ({ children }) => {
  const [token, setToken] = useState(undefined)
  const { user, getAccessTokenSilently, isLoading } = useAuth0()

  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: "https://moved-ferret-33.hasura.app/v1/graphql",
      })
      setToken(accessToken)
    }
    if (user) {
      getAccessToken()
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

  return (
    <>
      {isLoading ? (
        <p>Loading..</p>
      ) : (
        <ApolloProvider client={client}>{children}</ApolloProvider>
      )}
    </>
  )
}

export default ApolloWrapper
