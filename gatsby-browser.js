import React from "react"
import { Auth0Provider } from "@auth0/auth0-react"
import { navigate } from "gatsby"
import client from "./src/utils/apolloClient"
import { ApolloProvider } from "@apollo/client"

const onRedirectCallback = appState => {
  // Use Gatsby's navigate method to replace the url
  navigate(appState?.returnTo || "/", { replace: true })
}

export const wrapRootElement = ({ element }) => {
  return (
    <Auth0Provider
      domain="gatsby.eu.auth0.com"
      clientId="OWyOKW8B4IJyr1O0jABmFppWdDcLeO3F"
      redirectUri="http://localhost:8000"
      audience="https://moved-ferret-33.hasura.app/v1/graphql"
      scope="read:current_user update:current_user_metadata"
      onRedirectCallback={onRedirectCallback}
    >
      <ApolloProvider client={client}>{element}</ApolloProvider>
    </Auth0Provider>
  )
}
