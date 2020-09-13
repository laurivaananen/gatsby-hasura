import React, { useContext, useEffect, useState } from "react"
import { Link } from "gatsby"
import {
  gql,
  useLazyQuery,
  WatchQueryFetchPolicy,
  useApolloClient,
} from "@apollo/client"
import { WireframeContext } from "../utils/contextWrapper"

export interface IMod {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
  count: number
  username: string
  user_votes: IModVote[]
  user?: IUser
}

export interface IUser {
  username: string
}

export interface IModVote {
  id: string
}

export const ALL_MODS = gql`
  query ListMods($order_by: [mod_omega_order_by!], $offset: Int, $limit: Int) {
    Mods(order_by: $order_by, limit: $limit, offset: $offset) {
      count
      id
      username
      user_votes {
        id
      }
      title
      created_at
      updated_at
    }
  }
`

enum FilterOptions {
  NEW,
  TOP,
}

const ModListFilterOptions: { [key in FilterOptions]: object } = {
  [FilterOptions.NEW]: { created_at: "desc" },
  [FilterOptions.TOP]: { count: "desc" },
}

const ModItem: React.FC<{ mod: IMod }> = ({ mod }) => {
  return (
    <li className="rounded border border-gray-200 shadow-md mt-4" key={mod.id}>
      <Link to={`/mods/${mod.id}`}>
        <div className="p-6 flex items-center">
          <div
            className={`mr-6 text-xl font-bold ${
              mod.user_votes.length > 0 ? "text-green-400 " : "text-gray-400 "
            }`}
          >
            <p>{mod.count}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{mod.title}</h3>
            <p className="text-gray-600">{mod.username}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

const GhostModItem: React.FC<{ id: number }> = ({ id }) => {
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
  const LIMIT = 6
  const [modListFilter, setModListFilter] = useState<FilterOptions>(
    FilterOptions.NEW
  )
  const [fetchedMoreCount, setFetchedMoreCount] = useState<number>(0)
  const [moreToFetch, setMoreToFetch] = useState<boolean>(false)
  const [fetchAllMods, { data, loading, error, fetchMore }] = useLazyQuery(
    ALL_MODS,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: data => {
        console.log(data)
        console.log("Got some data")
        if (data.Mods.length < (fetchedMoreCount + 1) * LIMIT) {
          setMoreToFetch(false)
        } else {
          setMoreToFetch(true)
        }
        setFetchedMoreCount(fetchedMoreCount + 1)
      },
    }
  )

  const wireframe = useContext(WireframeContext)
  useEffect(() => {
    if (wireframe.clientReady) {
      fetchAllMods({
        variables: {
          order_by: ModListFilterOptions[modListFilter],
          limit: LIMIT,
          offset: fetchedMoreCount * LIMIT,
        },
      })
    }
  }, [wireframe.clientReady, modListFilter])

  const loadMore = () => {
    fetchMore({
      variables: {
        order_by: ModListFilterOptions[modListFilter],
        limit: LIMIT,
        offset: fetchedMoreCount * LIMIT,
      },
    })
  }

  const changeFilter = (filter: FilterOptions): void => {
    setModListFilter(filter)
    setFetchedMoreCount(0)
  }

  return (
    <>
      <Link
        className="px-4 py-2 rounded bg-teal-600 text-teal-200 mt-4"
        to="/mods/new"
      >
        Create a new Mod
      </Link>
      <p>{error?.message}</p>
      <div className="p-8">
        <button
          disabled={modListFilter === FilterOptions.NEW}
          onClick={() => changeFilter(FilterOptions.NEW)}
          className="px-4 py-2 bg-blue-600 text-blue-100 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          New
        </button>
        <button
          disabled={modListFilter === FilterOptions.TOP}
          onClick={() => changeFilter(FilterOptions.TOP)}
          className="px-4 py-2 bg-blue-600 text-blue-100 rounded ml-4 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Top
        </button>
      </div>
      <ul>
        {!data || (fetchedMoreCount === 0 && loading)
          ? Array.from(Array(6).keys()).map(id => (
              <GhostModItem key={id} id={id} />
            ))
          : data.Mods.map((mod: IMod) => <ModItem key={mod.id} mod={mod} />)}
      </ul>
      <div className="pt-8 pb-32">
        <button
          onClick={loadMore}
          className={`px-4 py-2 rounded bg-green-600 text-green-100 ${
            !moreToFetch && "hidden"
          }`}
        >
          Load more
        </button>
      </div>
    </>
  )
}

export default ModList
