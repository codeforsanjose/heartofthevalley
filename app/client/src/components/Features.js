import React from 'react'
import PropTypes from 'prop-types'

import '../assets/stylesheets/home.css'

function Features({ img, title, description }) {
  return (
    <div className="col-lg-3 col-md-6">
      <div className="card feature-card" style={{ height: '440px' }}>
        <img
          src={img}
          className="card-img-top feature-image"
          alt={title}
          width="276px"
          height="276px"
        />
        <div className="card-body feature-content">
          <h3>{title}</h3>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  )
}

Features.propTypes = {
  img: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default Features
