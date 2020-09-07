import React, { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client"

const FETCH_CURRENT_USER = gql`
  query FetchCurrentUser($auth0_id: String) {
    user(where: { auth0_id: { _eq: $auth0_id } }) {
      id
      username
    }
  }
`

const UPDATE_USER_USERNAME = gql`
  mutation MyMutation($username: String, $auth0_id: String) {
    update_user(
      where: { auth0_id: { _eq: $auth0_id } }
      _set: { username: $username }
    ) {
      returning {
        id
        username
        auth0_id
      }
    }
  }
`

const Account: React.FC<any> = () => {
  const { user, isLoading, getAccessTokenSilently } = useAuth0()
  const { data, loading, error } = useQuery(FETCH_CURRENT_USER, {
    onCompleted: data => setUsername(data.user[0].username),
  })
  const [username, setUsername] = useState("")
  const [JWT, setJWT] = useState("")
  const [
    updateUser,
    { data: updatedUser, loading: updatingUser },
  ] = useMutation(UPDATE_USER_USERNAME)

  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const token = await getAccessTokenSilently({
  //         audience: "https://moved-ferret-33.hasura.app/v1/graphql",
  //       })
  //       setJWT(token)
  //       fetchUser({
  //         context: { headers: { authorization: `Bearer ${token}` } },
  //         variables: { auth0_id: user.sub },
  //       })
  //     } catch (e) {
  //       console.error(e)
  //     }
  //   })()
  // }, [getAccessTokenSilently])

  const handleChange = event => {
    event.preventDefault()
    setUsername(event.target.value)
  }
  const updateUsername = event => {
    event.preventDefault()
    updateUser({
      variables: { username: username, auth0_id: user.sub },
    })
  }

  return (
    <div>
      <input
        onChange={handleChange}
        className="px-4 py-2 border border-gray-400"
        type="text"
        value={username}
      />
      <button
        onClick={updateUsername}
        className={`px-4 py-2 ${
          updatingUser ? "bg-gray-400 " : "bg-green-600 "
        }`}
      >
        Update Username
      </button>
      {error ? (
        <p>Error! {error.message}</p>
      ) : loading ? (
        <p>Loading..</p>
      ) : (
        <p>{data?.user[0].username}</p>
      )}
    </div>
  )
}

export default Account
