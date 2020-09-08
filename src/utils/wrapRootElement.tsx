import React from "react"
import { Auth0Provider } from "@auth0/auth0-react"
import { navigate } from "gatsby"
import ApolloWrapper from "./apolloWrapper"
import { WireframeProvider } from "./contextWrapper"

const onRedirectCallback = appState => {
  navigate(appState?.returnTo || "/", { replace: true })
}

export const wrapRootElement = ({ element }) => {
  return (
    <Auth0Provider
      domain="gatsby.eu.auth0.com"
      clientId="OWyOKW8B4IJyr1O0jABmFppWdDcLeO3F"
      redirectUri={process.env.GATSBY_REDIRECT_URL}
      audience="https://moved-ferret-33.hasura.app/v1/graphql"
      scope="read:current_user update:current_user_metadata"
      onRedirectCallback={onRedirectCallback}
    >
      <WireframeProvider>
        <ApolloWrapper>{element}</ApolloWrapper>
      </WireframeProvider>
    </Auth0Provider>
  )
}
