import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import Mapbox from '../components/Mapbox'
import { FeatureContext } from '../contexts/FeatureContext'
import { SearchContext } from '../contexts/SearchContext'
import { FaLongArrowAltRight, FaSistrix } from 'react-icons/fa'

import '../assets/stylesheets/home.css'
import featureData from '../components/FeatureData'

import Features from '../components/Features'
import LocalArts from '../components/LocalArts'
//<<<<<<< HEAD
// import { useNavigate } from "react-router-dom";
// import { useState, useContext } from 'react'
// import { FeatureContext, SearchContext } from '../App'

function Home() {
  const feature = featureData.map((data) => {
    return <Features key={data.id} img={data.img} title={data.title} description={data.content} />
  })
  const [filterType, setFilterType] = useContext(FeatureContext)
  const [searchText,setSearchText] = useContext(SearchContext)
// =======

// import featureData from '../components/FeatureData'

// function Home() {
//   const feature = featureData.map((data) => (
//     <Features key={data.id} img={data.img} title={data.title} description={data.content} />
//   ))
// >>>>>>> 4c9154ef3b7d5d6def6765867814061cd94ab2d8

  const history = useNavigate()
  
  return (
    <div className="home">
      <div className="container-fluid">
        <div className="herobanner">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="title">
                Explore Art
                <br />
                in the Bay Area
              </h1>
            </div>

            <div className="search-home">
              <input
                type="text"
                placeholder="Search by art or zipcode"
                className="home-input"
//<<<<<<< HEAD
                onChange={(e)=>{setSearchText(e.target.value)}}
              ></input>
              <button type="submit" onClick={()=>{history.push("/search",{find_art: searchText})}} className="search-btn">
                <FaSistrix />
              </button> 
{/* =======
              />
              <button type="submit" className="search-btn">
                Search
                <FaSistrix />
              </button>
>>>>>>> 4c9154ef3b7d5d6def6765867814061cd94ab2d8 */}
            </div>
            <div className="local-fav">
              <h3>Local favorites near San Jose</h3>
              <div className="row">
                <LocalArts />
                {/* <LocalArts />
                <LocalArts />
                <LocalArts /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="mapbox">
          <h3>Explore nearby Public Arts</h3>
          <Mapbox />
        </div>
      </div>
      <div className="features">
        <div className="container-fluid">
          <div className="categories">
            <div className="feature-title">
              <h2>Featured Categories</h2>
              <a href="/search" className="feature-link">
                Browse all <FaLongArrowAltRight />
              </a>
            </div>
            <div className="row "><Features /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
