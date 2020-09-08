import React from "react"
import Layout from "../components/layout"
import ClientMod from "../components/clientMod"
import { Router } from "@reach/router"
import NewModPage from "../components/new"
import ModList from "../components/modList"
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react"

const Mods = () => {
  return (
    <>
      <Layout>
        <Router basepath="/mods">
          <ClientMod path="/:modId" />
          <NewModPage path="/new" />
          <ModList path="/" />
        </Router>
      </Layout>
    </>
  )
}

export default Mods
