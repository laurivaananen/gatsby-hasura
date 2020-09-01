import React from "react"
import { graphql, PageProps, Link } from "gatsby"
import Layout from "../components/layout"

export interface IMod {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

export interface ModPayload {
  hasura: {
    mod: IMod[]
  }
}

const Mods = ({ data }: PageProps<ModPayload>) => {
  return (
    <Layout>
      <div>
        <h1>Mods</h1>
        <ul>
          {data.hasura.mod.map((mod: IMod) => (
            <li>
              <Link to={`/mods/${mod.id}`}>
                <div>
                  <h3>{mod.title}</h3>
                  <p>{mod.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Mods

export const query = graphql`
  query MyQuery {
    hasura {
      mod {
        description
        id
        title
        updated_at
        created_at
      }
    }
  }
`
