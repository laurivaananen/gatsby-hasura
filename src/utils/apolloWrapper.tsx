import React, { useState, useEffect, useContext } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  NormalizedCacheObject,
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
      console.log(accessToken)
      console.log("accessToken")
      wireframe.setClientReady(true)
    }
    if (user) {
      wireframe.setUserSub(user.sub)
      getAccessToken()
    } else if (isLoading) {
    } else {
      wireframe.setClientReady(true)
    }
  }, [getAccessTokenSilently])

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            Mods: {
              keyArgs: ["order_by"],
              merge(existing = [], incoming: any[], { variables }) {
                console.log(existing)
                console.log(incoming)
                console.log(variables)
                console.log("WE ARE MERGING")
                if (variables.offset === 0) {
                  return incoming
                }
                return [...existing, ...incoming]
              },
            },
          },
        },
      },
    }),
    link: createHttpLink({
      uri: "https://moved-ferret-33.hasura.app/v1/graphql",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      fetch,
    }),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloWrapper
