import React from 'react'

import PalmTrees from '../assets/img/Palm-Trees-Downtown-SanJose.jpg'

export default function LocalArts() {
  return (
    <div className="col-lg-3 col-md-6">
      <div className="card feature-card">
        <img
          src={PalmTrees}
          className="card-img"
          alt="palm-trees-downtown-sanjose"
          style={{ borderRadius: '25px' }}
        />
        <div className="card-img-overlay ">
          <h3 className="card-title local-title">Local Arts Title</h3>
        </div>
      </div>
    </div>
  )
}
