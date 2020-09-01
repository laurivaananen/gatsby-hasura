import React from "react"
import Layout from "./layout"
import { IMod } from "../pages/mods"
import { PageProps } from "gatsby"

const Mod = ({ pageContext: mod }: { pageContext: IMod }) => {
  return (
    <Layout>
      <h1>{mod.title}</h1>
      <p>{mod.description}</p>

      <small>
        <em>Last updated at {mod.updated_at}</em>
      </small>
    </Layout>
  )
}

export default Mod
