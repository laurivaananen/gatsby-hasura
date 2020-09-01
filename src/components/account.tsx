/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState, useEffect } from "react"
import Layout from "./layout"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"

const Account: React.FC<any> = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [userMetadata, setUserMetadata] = useState(null)

  useEffect(() => {
    const getUserMetadata = async () => {
      console.log(user)
      const domain = "gatsby.eu.auth0.com"

      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        })

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        const res = await metadataResponse.json()
        console.log(res)
        console.log("res")

        setUserMetadata(res.user_metadata)
      } catch (e) {
        console.log(e.message)
      }
    }

    getUserMetadata()
  }, [])

  return (
    isAuthenticated && (
      <>
        <img src={user.picture} alt={user.name} />
        <h2>{user.nickname}</h2>
        <p>{user.email}</p>
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </>
    )
  )
}

export default withAuthenticationRequired(Account)
