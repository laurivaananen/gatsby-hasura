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
    <header className="bg-blue-600">
      <div className="flex items-center h-12">
        <Link className="px-4  text-blue-100" to="/">
          Home
        </Link>{" "}
        <Link className="my-auto" to="/mods">
          Mods
        </Link>{" "}
        <Link to="/users">Users</Link>
        {isLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <>
            <Link to="/account">{user.nickname}</Link> <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  )
}

export default Header
