import { Link } from "gatsby"
import React from "react"
import { useAuth0 } from "@auth0/auth0-react"

export const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  )
}

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return <button onClick={loginWithRedirect}>Log In</button>
}
const Header = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  return (
    <header>
      <div>
        <Link to="/">Home</Link> <Link to="/mods">Mods</Link>{" "}
        <Link to="/users">Users</Link> <Link to="/account">Account</Link>{" "}
        {isLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <>
            <Link to="/account/user">{user.nickname}</Link> <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  )
}

export default Header
