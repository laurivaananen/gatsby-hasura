import React from "react"

import Header from "./header"

import "../styles/tailwind.css"

const Layout = ({ children }) => {
  return (
    <div className="antialised">
      <Header />
      <div>
        <main className="max-w-3xl mx-auto w-full">{children}</main>
      </div>
    </div>
  )
}

export default Layout
