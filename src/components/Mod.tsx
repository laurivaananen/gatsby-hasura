import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { gql, useMutation } from "@apollo/client"
import { IMod } from "./modList"

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

const Mod: React.FC<{ mod: IMod }> = ({ mod }) => {
  const { user } = useAuth0()

  const [upvoteMod] = useMutation(UPVOTE_MOD)

  const [downVoteMod] = useMutation(DOWNVOTE_MOD)

  const submitUpvoteMod = async event => {
    event.preventDefault()
    upvoteMod({
      variables: { mod_id: mod.id },
    })
  }

  const submitDownvoteMod = async event => {
    event.preventDefault()
    downVoteMod({
      variables: { mod_id: mod.id },
    })
  }

  const renderVoteButton = () => {
    if (!user) {
      return null
    } else if (mod.has_voted.aggregate.count > 0) {
      return <DownVoteButton submitDownvoteMod={submitDownvoteMod} />
    } else if (mod.has_voted.aggregate.count === 0) {
      return <UpVoteButton submitUpvoteMod={submitUpvoteMod} />
    } else {
      return null
    }
  }

  return (
    <>
      <div className="flex mt-8">
        <div className="mr-4 mt-16 flex flex-col items-center">
          {renderVoteButton()}
          <p>{mod.mod_votes_aggregate.aggregate.count}</p>
        </div>
        <div>
          <h1 className="text-5xl font-bold">{mod.title}</h1>
          <small className="text-sm text-gray-600 -mt-2">
            <em>
              Last updated at {mod.updated_at} by {mod?.user?.username}
            </em>
          </small>
          <p>{mod.id}</p>
          <p className="mt-8">{mod.description}</p>
        </div>
      </div>
    </>
  )
}

export default Mod
