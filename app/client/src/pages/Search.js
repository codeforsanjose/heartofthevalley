import React from 'react'
import { BsGrid3X3, BsListUl, BsMapFill } from 'react-icons/bs'

import Mapbox from '../components/Mapbox'
import '../assets/stylesheets/search.css'

function Search() {
  return (
    <div>
      <div className="search-body">
        <div className="container-fluid">
          <div className="search-header">
            <h1>Search Our Collection</h1>
            <input
              type="text"
              className="search"
              placeholder="Search by art, artist or zipcode"
            />
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="search-category">
          <div className="serach-name">
            <p>All | Mural | Interactive | Architecture | Sculpture | Painting | Photography</p>
          </div>
          <div className="result-views">
            <BsGrid3X3 className=" result-icons" />
            <BsListUl className=" result-icons" />
            <BsMapFill className=" result-icons" />
          </div>
        </div>
        <div className="search-result">
          <div className="mapbox">
            <Mapbox />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
