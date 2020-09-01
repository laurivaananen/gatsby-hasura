import React, { useEffect, useState } from "react"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import Layout from "../components/layout"
import { useQuery, gql, useLazyQuery } from "@apollo/client"

const ALL_USERS = gql`
  query AllUsers {
    user {
      id
      username
    }
  }
`

const AccountPage = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [loadUsers, { loading, error, data }] = useLazyQuery(ALL_USERS)

  useEffect(() => {
    ;(async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: "https://moved-ferret-33.hasura.app/v1/graphql",
        })

        loadUsers({
          context: { headers: { authorization: `Bearer ${token}` } },
        })
      } catch (e) {
        console.error(e)
      }
    })()
  }, [getAccessTokenSilently])

  return (
    <Layout>
      <h1>List of Users:</h1>
      {error ? (
        <p>Error!</p>
      ) : loading ? (
        <p>Loading..</p>
      ) : (
        <ul>
          {data?.user.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </Layout>
  )
}

export default withAuthenticationRequired(AccountPage)
