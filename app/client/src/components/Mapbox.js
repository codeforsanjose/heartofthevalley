import * as React from 'react'
import '../assets/stylesheets/map.css'
import ReactMapGL, { Marker, Popup, FullscreenControl, NavigationControl } from 'react-map-gl'
import { Component } from 'react'
import { useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapImg from "../assets/img/UntitledMural_LocatedAtVeggielutionFarm_SanJose_photoby_YanYinChoy.jpg"

import { FaMapMarkerAlt } from 'react-icons/fa'

const MAPBOX_TOKEN =
  'pk.eyJ1IjoidW1hcHJlZXRoaSIsImEiOiJja3diNm5wN3RnZWhsMnZwZzlyeTl5eDhhIn0.01MGUHXlsnSkJbv1u-mbmw' // Set your mapbox token here


function Mapbox() {
  const [viewport, setViewport] = useState({
    latitude: 37.33829,
    longitude: -121.88382,
    zoom: 14,
  })

  // Calling MapData API to get data
  const [apiData, setApiData] = React.useState([])
  React.useEffect(() => {
    fetch('http://localhost:3001/v1/heartofvalley/features')
      .then((res) => res.json())
      .then((data) => setApiData(data))
  }, [])

  const mapData = apiData.slice(0, 11)
  
  
  // Creating markers for the map
  const markers = mapData
    .filter((location) => {
      return !!location.latLong
    })
    .map((location) => (
      <Marker
        key={location.id}
        latitude={parseFloat(location.latLong[1])}
        longitude={parseFloat(location.latLong[0])}
      >
        <button
          className="button"
          onClick={(e) => {
            e.preventDefault()
            setShowpopup(location)
          }}
        >
          <FaMapMarkerAlt className="marker" />
        </button>
      </Marker>
    ))

  // creating popup state for the marker
  const [showPopup, setShowpopup] = React.useState(false)

 // Description
  function description() {
    return { __html: showPopup?.artistName }
  }

  return (
    <ReactMapGL
      {...viewport}
      width="80vw"
      height="70vh"
      mapStyle="mapbox://styles/umapreethi/ckxz6deec9a3z14t88tqso5rb"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      {markers}
      
      {/* {showPopup && (
        <Popup
          key={showPopup.id}
          latitude={parseFloat(showPopup.latLong[1])}
          longitude={parseFloat(showPopup.latLong[0])}
          closeButton={true}
          closeOnClick={false}
          onClose={setShowpopup}
          anchor="top"
          className="popup-mapbox"
        >
           <div className="card popup-card" style={{width: "15rem"}}>
                <img
                  src="https://images.unsplash.com/photo-1552596828-4e48cd784320?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  className="card-img-top popup-img"
                  alt={showPopup.title}
                  width="200" height="200"
                />
                <div className="card-body">
                  <h4 className="popup-title">{showPopup.title}</h4>
                  <p>ARTIST</p>
                  <p className="card-text"  dangerouslySetInnerHTML={description()}></p>
                  <a href="#" class="btn btn-primary popup-button">Get Directions</a>
                </div>
              </div>
        
        </Popup>
      )} */}
      <div id="info-box">
        <div className="card popup-card" style={{ width: '16rem' }}>
          <img
            src={mapImg}
            className="card-img-top popup-img"
            alt={showPopup.title}
            width="200"
            height="200"
          />
          <div className="card-body">
            <h4 className="popup-title">{showPopup.title}</h4>
            <p>ARTIST</p>
            <p className="card-text" dangerouslySetInnerHTML={description()}></p>
            <a href="#" class="btn btn-primary popup-button">
              Get Directions
            </a>
          </div>
        </div>
      </div>
      <NavigationControl position="bottom-right" />
      {/* <FullscreenControl /> */}
    </ReactMapGL>
  )
}

export default Mapbox
