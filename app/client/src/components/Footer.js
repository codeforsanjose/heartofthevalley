import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaFacebookF,FaInstagram,FaPinterest,FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <div className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4">Heart of the Valley</div>
          <div className="col-lg-4">
            Made with love by Code for San Jose
            {/* <div className="social-media-icons">
              <FaFacebookF className="social-icon" />
              <FaInstagram className="social-icon"  />
              <FaPinterest className="social-icon"  />
              <FaTwitter className="social-icon"  />
            </div> */}
          </div>
          <div className="col-lg-4 footer-link">
            <NavLink activeClassName="active" class="nav-link" id="navItem" to="/about">
              Contact Us &#8594;
            </NavLink>
            <br></br>
            <NavLink activeClassName="active" class="nav-link" id="navItem" to="/about">
              About &#8594;
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
