import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { gql, useMutation, useLazyQuery, useQuery } from "@apollo/client"
import { FETCH_MOD_BY_ID } from "./clientMod"

export interface IMod {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
  user?: IUser
}

export interface IUser {
  username: string
  id: string
}

export interface IUserHasVotedCheck {
  has_voted: boolean
}

export interface IModVotes {
  aggregate: {
    count: number
  }
}

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

const HAS_USER_UPVOTED = gql`
  query MyQuery($id: uuid!) {
    check_user_has_voted_mod_x(args: { search_mod_id: $id }) {
      has_voted
    }
  }
`

const COUNT_MOD_VOTES = gql`
  query MyQuery($mod_id: uuid!) {
    mod_votes_aggregate(where: { mod_id: { _eq: $mod_id } }) {
      aggregate {
        count(columns: id)
      }
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
  const { user, getAccessTokenSilently } = useAuth0()

  const {
    data: modVotesCountData,
    loading: modVotesCountLoading,
    error,
    updateQuery,
  } = useQuery(COUNT_MOD_VOTES, {
    variables: { mod_id: mod.id },
  })

  const [upvoteMod] = useMutation(UPVOTE_MOD)

  const [downVoteMod] = useMutation(DOWNVOTE_MOD)

  const [
    checkUserHasUpvoted,
    { data, loading, updateQuery: updateUserHasUpdatedQuery },
  ] = useLazyQuery(HAS_USER_UPVOTED)

  const submitUpvoteMod = async event => {
    event.preventDefault()
    upvoteMod({
      variables: { mod_id: mod.id },
    })
    updateQuery(previousResult => {
      const previousResultIncremented =
        previousResult.mod_votes_aggregate.aggregate.count + 1

      const newResult = {
        ...previousResult,
        mod_votes_aggregate: {
          ...previousResult.mod_votes_aggregate,
          aggregate: {
            ...previousResult.mod_votes_aggregate.aggregate,
            count: previousResultIncremented,
          },
        },
      }
      return newResult
    })
    updateUserHasUpdatedQuery(previousResult => {
      return { check_user_has_voted_mod_x: [{ has_voted: true }] }
    })
  }

  const submitDownvoteMod = async event => {
    event.preventDefault()
    downVoteMod({
      variables: { mod_id: mod.id },
    })
    updateQuery(previousResult => {
      const previousResultIncremented =
        previousResult.mod_votes_aggregate.aggregate.count - 1

      const newResult = {
        ...previousResult,
        mod_votes_aggregate: {
          ...previousResult.mod_votes_aggregate,
          aggregate: {
            ...previousResult.mod_votes_aggregate.aggregate,
            count: previousResultIncremented,
          },
        },
      }
      return newResult
    })
    updateUserHasUpdatedQuery(previousResult => {
      return { check_user_has_voted_mod_x: [{ has_voted: false }] }
    })
  }

  const calculateVotes = () => {
    const modVotesCount =
      !modVotesCountLoading &&
      modVotesCountData.mod_votes_aggregate.aggregate.count
    return modVotesCount
  }

  const renderVoteButton = () => {
    if (!user) {
      return null
    } else if (loading) {
      return null
    } else if (!data) {
      return null
    } else if (data.check_user_has_voted_mod_x[0].has_voted === true) {
      return <DownVoteButton submitDownvoteMod={submitDownvoteMod} />
    } else if (data.check_user_has_voted_mod_x[0].has_voted === false) {
      return <UpVoteButton submitUpvoteMod={submitUpvoteMod} />
    } else {
      return null
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        checkUserHasUpvoted({
          variables: { id: mod.id },
        })
      } catch (e) {
        console.error(e)
      }
    })()
  }, [getAccessTokenSilently])

  return (
    <>
      <div className="flex mt-8">
        <div className="mr-4 mt-16 flex flex-col items-center">
          {renderVoteButton()}
          <p>{calculateVotes()}</p>
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
