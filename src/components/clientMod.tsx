import React, { useContext, useEffect } from "react"
import { RouteComponentProps } from "@reach/router"
import { gql, useLazyQuery } from "@apollo/client"
import Mod from "./Mod"
import { WireframeContext } from "../utils/contextWrapper"

export const ONE_MOD_WITH_VOTES = gql`
  query MyQuery($user_sub: String!, $mod_id: uuid!) {
    mod(where: { id: { _eq: $mod_id } }) {
      title
      mod_votes_aggregate {
        aggregate {
          count
        }
      }
      has_voted: mod_votes_aggregate(
        where: { user: { auth0_id: { _in: [$user_sub] } } }
      ) {
        aggregate {
          count
        }
      }
      updated_at
      user {
        username
      }
      created_at
      description
      id
    }
  }
`

interface ClientModProps extends RouteComponentProps {
  modId?: string
}

const ClientMod: React.FC<ClientModProps> = props => {
  const [fetchOneMod, { data, error, loading }] = useLazyQuery(
    ONE_MOD_WITH_VOTES
  )

  const wireframe = useContext(WireframeContext)

  useEffect(() => {
    if (wireframe.clientReady) {
      fetchOneMod({
        variables: {
          user_sub: wireframe.userSub,
          mod_id: props.modId,
        },
      })
    }
  }, [wireframe.clientReady])
  console.log(data)
  console.log("data")
  return <>{!data ? <p>Loading..</p> : <Mod mod={data.mod[0]} />}</>
}
export default ClientMod
