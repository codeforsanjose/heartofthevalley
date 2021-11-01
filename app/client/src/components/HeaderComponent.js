import React from 'react'
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        
        <span class="navbar-brand">HEART OF THE VALLEY<p className="sub-title">Mapping Public arts</p> </span>
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
        <div  class="navbar-collapse collapse  " id="navbarSupportedContent">
          <ul class="navbar-nav   ">
            <li class="nav-item">
              <NavLink
                exact
                activeClassName="active"
                class="nav-link active"
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink activeClassName="active" class="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink activeClassName="active" class="nav-link" to="/projects">
                Projects
              </NavLink>
            </li>
          </ul>
         
          
          </div>
      </div>
    </nav>
  );
}

export default Header;
