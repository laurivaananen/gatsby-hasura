import React from "react"
import { Auth0Provider } from "@auth0/auth0-react"

// class SessionCheck extends React.Component {
//   constructor(props) {
//     console.log("SessionCheck PAGE")
//     super(props)
//     this.state = {
//       loading: true,
//     }
//   }

//   handleCheckSession = () => {
//     this.setState({ loading: false })
//   }

//   componentDidMount() {
//     silentAuth(this.handleCheckSession)
//   }

//   render() {
//     return (
//       this.state.loading === false && (
//         <React.Fragment>{this.props.children}</React.Fragment>
//       )
//     )
//   }
// }

export const wrapRootElement = ({ element }) => {
  return (
    <Auth0Provider
      domain="gatsby.eu.auth0.com"
      clientId="OWyOKW8B4IJyr1O0jABmFppWdDcLeO3F"
      redirectUri="http://localhost:8000"
      audience="https://gatsby.eu.auth0.com/api/v2/"
      scope="read:current_user update:current_user_metadata"
    >
      {element}
    </Auth0Provider>
  )
}
