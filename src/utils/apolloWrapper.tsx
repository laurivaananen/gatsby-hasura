import React, { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client"

const ApolloWrapper: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null
}> = ({ children }) => {
  console.log("RENDERING APOLLO WRAPPER")
  const [token, setToken] = useState(undefined)
  const { user, getAccessTokenSilently } = useAuth0()
  useEffect(() => {
    console.log("RENDERING USE EFFECT")
    const getAccessToken = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: "https://moved-ferret-33.hasura.app/v1/graphql",
      })
      console.log(accessToken)
      console.log("accessToken")
      setToken(accessToken)
    }
    if (user) {
      getAccessToken()
    }
  }, [getAccessTokenSilently])
  const client = new ApolloClient({
    // uri: "https://moved-ferret-33.hasura.app/v1/graphql",
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: "https://moved-ferret-33.hasura.app/v1/graphql",
      headers: token && { Authorization: `Bearer ${token}` },
    }),
  })
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
