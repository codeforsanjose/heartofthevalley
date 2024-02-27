import React from 'react'
import { NavLink } from 'react-router-dom'
// import '../assets/stylesheets/footer.css';

function Footer() {
  return (
    <div className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4">Heart of the Valley</div>
          <div className="col-lg-4">
            Made with love by Code for San Jose
          </div>
          <div className="col-lg-4 footer-link">
            <NavLink activeClassName="active" class="nav-item-1" to="/contact">
              Contact Us &#8594;
            </NavLink>
            <br />
            <NavLink className="nav-link nav-item-1" to="/about">
              About &#8594;
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
