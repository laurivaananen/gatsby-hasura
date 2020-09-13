import React, { useContext, useEffect } from "react"
import { RouteComponentProps } from "@reach/router"
import { gql, useLazyQuery, useApolloClient, useMutation } from "@apollo/client"
import { WireframeContext } from "../utils/contextWrapper"
import { useAuth0 } from "@auth0/auth0-react"

const MOD_OMEGA = gql`
  query OneMod($mod_id: uuid!) {
    one_mod(where: { id: { _eq: $mod_id } }) {
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

const UPVOTE_MOD = gql`
  mutation MyMutation($mod_id: uuid) {
    insert_mod_votes_one(
      object: { mod_id: $mod_id }
      on_conflict: { constraint: mod_votes_pkey, update_columns: updated_at }
    ) {
      id
    }
  }
`

const DOWNVOTE_MOD = gql`
  mutation MyMutation($mod_id: uuid = "") {
    delete_mod_votes(where: { mod_id: { _eq: $mod_id } }) {
      affected_rows
    }
  }
`

const UpVoteButton = ({ submitUpvoteMod }) => {
  return (
    <div
      onClick={submitUpvoteMod}
      className={`h-8 w-8 cursor-pointer bg-gray-500 hover:bg-gray-600`}
    ></div>
  )
}

const DownVoteButton = ({ submitDownvoteMod }) => {
  return (
    <div
      onClick={submitDownvoteMod}
      className={`h-8 w-8 cursor-pointer bg-green-500 hover:bg-green-600`}
    ></div>
  )
}
interface ClientModProps extends RouteComponentProps {
  modId?: string
}

const ClientMod: React.FC<ClientModProps> = props => {
  const [fetchModOmega, { data, error }] = useLazyQuery(MOD_OMEGA, {
    fetchPolicy: "network-only",
  })

  const { user } = useAuth0()

  const [upvoteMod] = useMutation(UPVOTE_MOD)

  const [downVoteMod] = useMutation(DOWNVOTE_MOD)

  const wireframe = useContext(WireframeContext)

  const submitUpvoteMod = async event => {
    event.preventDefault()
    upvoteMod({
      variables: { mod_id: data.one_mod[0].id },
      optimisticResponse: true,
      update: (cache, { data }) => {
        cache.modify({
          id: `one_mod:${props.modId}`,
          fields: {
            count(countObject) {
              return countObject + 1
            },
            user_votes() {
              return [
                {
                  id: wireframe.userSub,
                  __typename: "mod_votes_view",
                },
              ]
            },
          },
        })
      },
    })
  }

  const submitDownvoteMod = async event => {
    event.preventDefault()
    downVoteMod({
      variables: { mod_id: data.one_mod[0].id },
      optimisticResponse: true,
      update: (cache, result) => {
        cache.modify({
          id: `one_mod:${props.modId}`,
          fields: {
            count(countObject) {
              return countObject - 1
            },
            user_votes(obj) {
              return []
            },
          },
        })
      },
    })
  }

  const renderVoteButton = () => {
    if (!user) {
      return null
    } else if (data.one_mod[0].user_votes.length > 0) {
      return <DownVoteButton submitDownvoteMod={submitDownvoteMod} />
    } else if (data.one_mod[0].user_votes.length === 0) {
      return <UpVoteButton submitUpvoteMod={submitUpvoteMod} />
    } else {
      return null
    }
  }

  useEffect(() => {
    if (wireframe.clientReady) {
      fetchModOmega({
        variables: {
          mod_id: props.modId,
        },
      })
    }
  }, [wireframe.clientReady])
  if (error) {
    return <h1>{error.message}</h1>
  }

  return (
    <>
      {!data ? (
        <p>Loading..</p>
      ) : (
        <div className="flex mt-8">
          <div className="mr-4 mt-16 flex flex-col items-center">
            {renderVoteButton()}
            <p>{data.one_mod[0].count}</p>
          </div>
          <div>
            <h1 className="text-5xl font-bold">{data.one_mod[0].title}</h1>
            <small className="text-sm text-gray-600 -mt-2">
              <em>Last updated by {data.one_mod[0].username}</em>
            </small>
            <p>{data.one_mod[0].id}</p>
          </div>
        </div>
      )}
    </>
  )
}
export default ClientMod
