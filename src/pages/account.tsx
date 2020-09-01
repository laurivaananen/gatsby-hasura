import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Layout from "../components/layout"
import Account from "../components/account"
import { Router } from "@reach/router"
import { Link } from "gatsby"

const AccountPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  return (
    <Layout>
      <h1>Gatsby + Hasura example</h1>
      <Link to="/account/user">Account</Link>
      <Router>
        <Account path="/account/user" user={user} />
      </Router>
    </Layout>
  )
}

export default AccountPage
