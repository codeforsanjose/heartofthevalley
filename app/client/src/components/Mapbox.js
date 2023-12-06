import React, { useState } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl'

import '../assets/stylesheets/map.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapImg from '../assets/img/UntitledMural_LocatedAtVeggielutionFarm_SanJose_photoby_YanYinChoy.jpg'

// TODO: from process.env ?
const MAPBOX_TOKEN = 'pk.eyJ1IjoidW1hcHJlZXRoaSIsImEiOiJja3diNm5wN3RnZWhsMnZwZzlyeTl5eDhhIn0.01MGUHXlsnSkJbv1u-mbmw'

function Mapbox() {
  const [viewport, setViewport] = useState({
    latitude: 37.33829,
    longitude: -121.88382,
    zoom: 14,
  })

  // Calling MapData API to get data
  const [apiData, setApiData] = React.useState([])
  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/features`)
      .then((res) => res.json())
      .then((data) => setApiData(data))
  }, [])

  const mapData = apiData.slice(0, 11)

  // creating popup state for the marker
  const [showPopup, setShowpopup] = React.useState(false)

  // Creating markers for the map
  const markers = mapData
    .filter((location) => (
      !!location.latLong
    ))
    .map((location) => (
      <Marker
        key={location.id}
        latitude={parseFloat(location.latLong[1])}
        longitude={parseFloat(location.latLong[0])}
      >
        <button
          className="button"
          type="button"
          aria-label="show-location"
          onClick={(e) => {
            e.preventDefault()
            setShowpopup(location)
          }}
        >
          <FaMapMarkerAlt className="marker" />
        </button>
      </Marker>
    ))

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
          </div>
        </div>
      </div>
      <NavigationControl position="bottom-right" />
    </ReactMapGL>
  )
}

export default Mapbox
