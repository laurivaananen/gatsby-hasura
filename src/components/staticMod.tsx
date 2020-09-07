import React from "react"
import Layout from "./layout"
import { IMod } from "../pages/mods"
import Mod from "../components/Mod"

const StaticMod = ({ pageContext: mod }: { pageContext: IMod }) => {
  return (
    <Layout>
      <Mod mod={mod} />
    </Layout>
  )
}

export default StaticMod
