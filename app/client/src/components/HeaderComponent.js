import React from 'react'
import { NavLink } from "react-router-dom";
import { FaSistrix } from "react-icons/fa";

function Header() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="nav">
      <div class="container-fluid">
        
        <span class="navbar-brand" id="navItem">HEART OF THE VALLEY<p className="sub-title" id="navItem">Mapping Public arts</p> </span>
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
          <ul class="navbar-nav" >
            <li class="nav-item">
              <NavLink
                exact
                activeClassName="active"
                class="nav-link active"
                id="navItem"
                to="/"
              >
                HOME
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink activeClassName="active" class="nav-link" id="navItem" to="/about">
                ABOUT
              </NavLink>
            </li>
            <li class="nav-item">
              <NavLink activeClassName="active" class="nav-link" id="navItem" to="/contactus">
                CONTACT US
              </NavLink>
            </li>
          </ul>
          <a class="nav-item" href="#">
            
            <FaSistrix />
          </a>
          
          </div>
      </div>
    </nav>
  );
}

export default Header;
