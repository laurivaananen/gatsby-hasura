import React from "react"
import { RouteComponentProps } from "@reach/router"
import { gql, useQuery } from "@apollo/client"
import Mod from "./Mod"

export const FETCH_MOD_BY_ID = gql`
  query MyQuery($id: uuid!) {
    mod_by_pk(id: $id) {
      created_at
      description
      id
      title
      updated_at
      user {
        username
      }
    }
  }
`

interface ClientModProps extends RouteComponentProps {
  modId?: string
}

const ClientMod: React.FC<ClientModProps> = props => {
  const { data, error, loading } = useQuery(FETCH_MOD_BY_ID, {
    variables: { id: props.modId },
  })
  console.log(data)
  console.log("data")
  return (
    <>
      {error ? (
        <p>Error.. {error.message}</p>
      ) : loading ? (
        <p>Loading..</p>
      ) : (
        <Mod mod={data.mod_by_pk} />
      )}
    </>
  )
}
export default ClientMod
