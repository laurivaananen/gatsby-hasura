import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Layout from "../components/layout"
import { Link } from "gatsby"

const IndexPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  return (
    <Layout>
      <h1>Gatsby + Hasura example</h1>
      <Link to="/account">Account</Link>
    </Layout>
  )
}

export default IndexPage
