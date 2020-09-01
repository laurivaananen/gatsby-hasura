import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Layout from "../components/layout"
import Account from "../components/account"
import { Router } from "@reach/router"
import { Link } from "gatsby"

const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  )
}

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return <button onClick={() => loginWithRedirect()}>Log In</button>
}

const Profile = ({ user, isAuthenticated }) => {
  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  )
}

const IndexPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  return (
    <Layout>
      <h1>Gatsby + Hasura example</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <LogoutButton />
      ) : (
        <LoginButton />
      )}
      <Profile user={user} isAuthenticated={isAuthenticated} />
      <Link to="/account/user">Account</Link>
      <Router>
        <Account path="/account/user" user={user} />
      </Router>
    </Layout>
  )
}

export default IndexPage
