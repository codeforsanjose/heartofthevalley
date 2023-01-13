import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaSistrix } from 'react-icons/fa'


function Header() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="nav">
      <div class="container-fluid">
        <span class="navbar-brand nav-item-1">
          HEART OF THE VALLEY
          <p className="sub-title nav-item-1">
            Mapping Public arts
          </p>{' '}
        </span>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse  " id="navbarSupportedContent">
          <ul class="navbar-nav">
            <li class="nav-item">
              <NavLink exact className="nav-link nav-item-1 active" to="/">
                Home
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink className="nav-link nav-item-1" to="/about">
                About
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink className="nav-link nav-item-1" to="/contact">
                Contact Us
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink className="nav-link nav-item-1" to="/search">
                Search <FaSistrix />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
