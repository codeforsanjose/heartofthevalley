import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup, FullscreenControl, NavigationControl } from 'react-map-gl'
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { API_URL } from '../utils/API_URL';
import { FaMapMarkerAlt } from 'react-icons/fa'

import '../assets/stylesheets/map.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapImg from '../assets/img/UntitledMural_LocatedAtVeggielutionFarm_SanJose_photoby_YanYinChoy.jpg'
// TODO: from process.env ?
const MAPBOX_TOKEN = 'pk.eyJ1IjoidW1hcHJlZXRoaSIsImEiOiJja3diNm5wN3RnZWhsMnZwZzlyeTl5eDhhIn0.01MGUHXlsnSkJbv1u-mbmw'

function Mapbox() {

  const history = useNavigate()

  const [viewport, setViewport] = useState({
    latitude: 37.33829,
    longitude: -121.88382,
    zoom: 14,
    
  })

  // Calling MapData API to get data
// <<<<<<< HEAD

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

  const {artData,error,loaded} = ArtData(`${API_URL}/features`)

    // creating popup state for the marker
    const [showPopup, setShowpopup] = useState(null)


  const markers = (loaded===true) && artData
   .slice(1,50)
   .map((data) => {
      // const selectedData = artData.find((data) => data.id === showPopup);
      return (
        <Marker
          key={data.id}
          latitude={parseFloat(data.latLong[1])}
          longitude={parseFloat(data.latLong[0])}
// =======
//   const [apiData, setApiData] = React.useState([])
//   React.useEffect(() => {
//     fetch(`${API_URL}/features`)
//       .then((res) => res.json())
//       .then((data) => setApiData(data))
//   }, [])

//   const mapData = apiData.slice(0, 11)

//   // creating popup state for the marker
//   const [showPopup, setShowpopup] = React.useState(false)

//   // Creating markers for the map
//   const markers = mapData
//     .filter((location) => (
//       !!location.latLong
//     ))
//     .map((location) => (
//       <Marker
//         key={location.id}
//         latitude={parseFloat(location.latLong[1])}
//         longitude={parseFloat(location.latLong[0])}
//       >
//         <button
//           className="button"
//           type="button"
//           aria-label="show-location"
//           onClick={(e) => {
//             e.preventDefault()
//             setShowpopup(location)
//           }}
// >>>>>>> 4c9154ef3b7d5d6def6765867814061cd94ab2d8
        >
          
          <button
            className={`button ${showPopup === data.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setShowpopup(data)
              console.log(data)
            }}
          >
            <FaMapMarkerAlt className="marker" />
          </button>
        </Marker>
      )
    })
//<<<<<<< HEAD
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
         {showPopup && (
        <Popup
          latitude={parseFloat(showPopup.latLong[1])}
          longitude={parseFloat(showPopup.latLong[0])}
          closeButton = {true}
          closeOnClick = {true}
          closeOnMove = {false}
          anchor = "top"
          onClose={() => setShowpopup(null)}
        >
          <div className = "mt-3" id="info-box">
          <div className="card popup-card" style={{ width: '20rem' }}>
            <div id="img-gradient">
              <img
                src={showPopup.imagePath}
                className="card-img-top popup-img"
                alt={showPopup.Title}
              />

              <h4 
                className="popup-title" 
                onClick={() => {
                  history.push({
                    pathname: '/artDetails',
                    // state: showPopup
                    state: {
                      facility: showPopup.Facility,
                      artist: showPopup.Artist,
                      address: showPopup.Address,
                      description: showPopup.Description,
                      imgAddr: showPopup.imagePath, 
                      title: showPopup.Title,
                      artType: showPopup.ArtType,
                      latLong: showPopup.latLong
                    }
                  })
                }}
              >
                  {showPopup.Title}
              </h4>
              
              <button className="circle" onClick={()=>{console.log('coming here'),window.location.replace(`https://www.google.com/maps/search/?api=1&query=${showPopup.latLong[1]}%2C${showPopup.latLong[0]}`);}}>
              <svg
                    class="map-svg"
                    width="23px" viewBox="0 0 512 512"
                  >
                    <path
                      d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z"
                      fill="currentColor"
                    />
                  </svg>
              </button>
            </div >
  
{/* =======
  // Description
  function description() {
    return { __html: showPopup?.artistName }
  }

  return (
    <ReactMapGL
      {...viewport} // eslint-disable-line react/jsx-props-no-spreading
      width="80vw"
      height="70vh"
      mapStyle="mapbox://styles/umapreethi/ckxz6deec9a3z14t88tqso5rb"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {markers}
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
            <p className="card-text" dangerouslySetInnerHTML={description()} />
            <a // eslint-disable-line jsx-a11y/anchor-is-valid
              href="#"
              className="btn btn-primary popup-button"
            >
              Get Directions
            </a>
>>>>>>> 4c9154ef3b7d5d6def6765867814061cd94ab2d8 */}
          </div>
        </div>
        </Popup>
        )}
       
      <NavigationControl position="bottom-right" />
    </ReactMapGL>
  )
}

export default Mapbox
