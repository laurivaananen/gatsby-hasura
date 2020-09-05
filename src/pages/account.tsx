import React, { useEffect } from "react"
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react"
import Layout from "../components/layout"
import Profile from "../components/profile"
import Account from "../components/Account"
import { Router } from "@reach/router"

const AccountPage = () => {
  return (
    <Layout>
      <Router basepath="/account">
        <Profile path="/profile" />
        <Account path="/" />
      </Router>
    </Layout>
  )
}

export default withAuthenticationRequired(AccountPage)
