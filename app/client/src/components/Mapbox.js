import * as React from 'react'
import '../assets/stylesheets/map.css'
import ReactMapGL, { Marker, Popup, FullscreenControl, NavigationControl } from 'react-map-gl'
import { Component } from 'react'
import { useState, useEffect } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from "axios";
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
  

  

  const ArtData = (url) => {
    const [artData, setArtData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      axios
        .get(url)
        .then((response) => setArtData(response.data))
        .catch((error) => setError(error.message))
        .finally(() => setLoaded(true));
    }, []);
  
    return { artData, error, loaded };
  };
 
  const {artData,error,loaded} = ArtData('http://localhost:3001/v1/heartofvalley/features')
 /*  if(loaded === true){
    artData
      .map((data) => {console.log(data)})
  }
   */
  // Creating markers for the map
  let id = 0
   const markers = (loaded===true) && artData
  .slice(1,50)
   .map((data) => (
      <Marker
        key={data.id}
        latitude={parseFloat(data.latLong[1])}
        longitude={parseFloat(data.latLong[0])}
      >
        <button
          className="button"
          onClick={(e) => {
            e.preventDefault()
            setShowpopup(data)
            console.log(data)
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
      width="100%"
      height="80vh"
      style={{marginTop:"2vh", marginBottom:"2vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      
    >
       {markers}   
      <div className = "mt-3" id="info-box">
        <div className="card popup-card" style={{ width: '20rem' }}>
          <img
            src={showPopup.imagePath}
            className="card-img-top popup-img"
            alt={showPopup.Title}
            width="200"
            height="200"
          />
          <div className="card-body">
            <h4 className="popup-title">{showPopup.Title}</h4>
            <p>{showPopup.Artist}</p>
            <p className="card-text" dangerouslySetInnerHTML={description()}></p>
            <a href="#" class="btn btn-primary popup-button">
              Get Directions
            </a>
          </div>
        </div>
      </div>
      <NavigationControl position="bottom-right" />
    </ReactMapGL>
  )
}

export default Mapbox
