import React, { useContext } from "react"
import { Link } from "gatsby"
import { gql, useQuery } from "@apollo/client"
import { WireframeContext } from "../utils/contextWrapper"

interface IMod {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
  mod_votes_aggregate: IModVotes
  mod_votes: string[]
  user?: IUser
}

interface IUser {
  username: string
}

interface IModVotes {
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

const ModItem: React.FC<{ mod: IMod }> = ({ mod }) => {
  return (
    <li className="rounded border border-gray-200 shadow-md mt-4" key={mod.id}>
      <Link to={`/mods/${mod.id}`}>
        <div className="p-6 flex items-center">
          <div
            className={`mr-6 text-xl font-bold ${
              mod.mod_votes.length > 0 ? "text-green-400 " : "text-gray-400 "
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
  )
}

const GhostModItem: React.FC<{ id: number }> = ({ id }) => {
  console.log(id)
  return (
    <li className="rounded bg-gray-200 mt-4 p-px" key={id}>
      <div className="p-6 flex items-baseline">
        <div style={{ width: "30px" }}></div>
        <div>
          <div
            className="flex items-center"
            style={{ height: "30px", width: "220px" }}
          >
            <div
              style={{ height: "20px" }}
              className="bg-gray-400 rounded flex-1"
            ></div>
          </div>
          <div
            className="flex items-baseline"
            style={{ height: "24px", width: "120px" }}
          >
            <div
              style={{ height: "16px" }}
              className="bg-gray-300 rounded flex-1"
            ></div>
          </div>
        </div>
      </div>
    </li>
  )
}

const ModList: React.FC<any> = () => {
  const { data, loading, error } = useQuery(ALL_MODS)
  const client = useContext(WireframeContext)
  console.log(client)
  return (
    <>
      <Link
        className="px-4 py-2 rounded bg-teal-600 text-teal-200 mt-4"
        to="/mods/new"
      >
        Create a new Mod
      </Link>
      <ul>
        {!client.clientReady || loading
          ? Array.from(Array(10).keys()).map(id => <GhostModItem id={id} />)
          : data.mod.map((mod: IMod) => <ModItem mod={mod} />)}
      </ul>
    </>
  )
}

export default ModList
