import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-secondary-subtle">
        <div className="container-fluid">
          <Link className="navbar-brand mx-auto" to={"/"}>LoveSync</Link>
        </div>
      </nav>
    </div>
  )
}