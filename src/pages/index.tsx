import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Layout from "../components/layout"
import Account from "../components/account"
import { Router } from "@reach/router"
import { Link } from "gatsby"

const Profile = ({ user, isAuthenticated }) => {
  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.nickname} />
        <h2>{user.nickname}</h2>
        <p>{user.email}</p>
      </div>
    )
  )
}

const IndexPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  console.log(user)
  console.log("user")
  return (
    <Layout>
      <h1>Gatsby + Hasura example</h1>
      <Profile user={user} isAuthenticated={isAuthenticated} />
      <Link to="/account/user">Account</Link>
      <Router>
        <Account path="/account/user" user={user} />
      </Router>
    </Layout>
  )
}

export default IndexPage
