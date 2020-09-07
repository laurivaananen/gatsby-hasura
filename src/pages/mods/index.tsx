import React from "react"
import { PageProps, Link } from "gatsby"
import Layout from "../../components/layout"
import ClientMod from "../../components/clientMod"
import { Router } from "@reach/router"
import { gql, useQuery } from "@apollo/client"
import NewModPage from "./new"
import { RouteComponentProps } from "@reach/router"

export interface IMod {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
  mod_votes_aggregate: IModVotes
  mod_votes: string[]
  user?: IUser
}

export interface IUser {
  username: string
}

export interface IModVotes {
  aggregate: { count: number }
}

export const ALL_MODS = gql`
  query MyQuery {
    mod {
      updated_at
      title
      description
      id
      mod_votes(where: { user: { id: { _is_null: false } } }) {
        id
      }
      mod_votes_aggregate {
        aggregate {
          count
        }
      }
      user {
        username
      }
      created_at
    }
  }
`

const StaticMods: React.FC<RouteComponentProps> = () => {
  console.log("RENDERING ALL MOD PAGE")
  const { data, loading, error } = useQuery(ALL_MODS)
  return (
    <div>
      <Link
        className="px-4 py-2 rounded bg-teal-600 text-teal-200 mt-4"
        to="/mods/new"
      >
        Create a new Mod
      </Link>
      <ul>
        {error ? (
          <p>Error, {error}</p>
        ) : loading ? (
          <p>Loading..</p>
        ) : (
          data.mod.map((mod: IMod) => (
            <li
              className="rounded border border-gray-200 shadow-md mt-4"
              key={mod.id}
            >
              <Link to={`/mods/${mod.id}`}>
                <div className="p-6 flex items-center">
                  <div
                    className={`mr-6 text-xl font-bold ${
                      mod.mod_votes.length > 0
                        ? "text-green-400 "
                        : "text-gray-400 "
                    }`}
                  >
                    <p>{mod.mod_votes_aggregate.aggregate.count}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{mod.title}</h3>
                    <p className="text-gray-600">{mod.user?.username}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

const Mods = () => {
  return (
    <>
      <Layout>
        <Router basepath="/mods">
          <StaticMods path="/" />
          <ClientMod path="/:modId" />
          <NewModPage path="/new" />
        </Router>
      </Layout>
    </>
  )
}

export default Mods
