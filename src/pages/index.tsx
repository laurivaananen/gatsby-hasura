import React from "react"
import Layout from "../components/layout"
import { Link } from "gatsby"

const IndexPage = () => {
  return (
    <Layout>
      <h1>Gatsby + Hasura example</h1>
      <Link to="/account">Account</Link>
    </Layout>
  )
}

export default IndexPage
