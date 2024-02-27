import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaSistrix } from 'react-icons/fa'


function Header() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="nav">
      <div class="container-fluid">
        <span class="navbar-brand nav-item-1">
          <Link className="header-title-link" to="/">HEART OF THE VALLEY</Link>
          <p className="sub-title nav-item-1">
            Mapping Public Arts
          </p>{' '}
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="navbar-collapse collapse  " id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link nav-item-1 active" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-item-1" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-item-1" to="/contact">
                Contact Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-item-1" to="/search">
                Search
                <FaSistrix />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
