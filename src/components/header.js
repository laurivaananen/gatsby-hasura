import { Link } from "gatsby"
import React from "react"

const Header = () => (
  <header>
    <div>
      <Link to="/">Home</Link>
      <Link to="/mods">Mods</Link>
      <Link to="/account">Account</Link>
    </div>
  </header>
)

export default Header
