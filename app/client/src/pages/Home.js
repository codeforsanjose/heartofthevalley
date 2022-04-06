import React from 'react'
import Mapbox from '../components/Mapbox'
import Features from '../components/Features'
import '../assets/stylesheets/home.css'
import featureData from '../components/FeatureData'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { FaSistrix } from 'react-icons/fa'
import LocalArts from '../components/LocalArts'

function Home() {
  const feature = featureData.map((data) => {
    return <Features key={data.id} img={data.img} title={data.title} description={data.content} />
  })

  return (
    <div className="home">
      <div className="container-fluid">
        <div className="herobanner">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="title">
                Explore Art<br></br> in the Bay Area
              </h1>
            </div>

            <div className="search-home">
              <input
                type="text"
                placeholder="Search by art, artist, or zipcode"
                className="home-input"
              ></input>
              <button type="submit" className="search-btn">
                Search <FaSistrix />
              </button>
            </div>
            <div className="local-fav">
              <h3>Local favorites near San Jose</h3>
              <div className="row">
                <LocalArts />
                <LocalArts />
                <LocalArts />
                <LocalArts />
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
              <a href="#" className="feature-link">
                Browse all <FaLongArrowAltRight />
              </a>
            </div>
            <div className="row ">{feature}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
