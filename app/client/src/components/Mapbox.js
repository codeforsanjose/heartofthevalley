import * as React from "react";
import '../assets/stylesheets/map.css'
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Component } from "react";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import data from "./data";
import { FaMapMarkerAlt } from "react-icons/fa";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidW1hcHJlZXRoaSIsImEiOiJja3diNm5wN3RnZWhsMnZwZzlyeTl5eDhhIn0.01MGUHXlsnSkJbv1u-mbmw"; // Set your mapbox token here

function Mapbox() {
  const [viewport, setViewport] = useState({
    width: "80vw",
    height: "100vh",
    latitude: 37.33829,
    longitude: -121.88382,
    zoom: 14,
  });

  const pop = (data)=>{
     console.log(data);
  }
  const markers = data.map(location=>(
    <Marker key={location.id} latitude={location.geometry.coordinates[1]}
    longitude={location.geometry.coordinates[0]}>
      <button onClick={e =>{
        e.preventDefault();
        setShowpopup(location);
      }}>
         <FaMapMarkerAlt />
      </button> 
    </Marker>
  ));
  const [showPopup, setShowpopup] = React.useState(false);
  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/umapreethi/ckwl7yfkq2fvp14uq290s5ewp"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
     {markers}
     {showPopup &&  <Popup
      key={showPopup.id}
      latitude={showPopup.geometry.coordinates[1]}
      longitude={showPopup.geometry.coordinates[0]}
      closeButton={true}
      closeOnClick={false}
      onClose={setShowpopup}
      anchor="top" 
      >
        
      
      <div><img src={showPopup.properties.image} alt="img" width="200" height="200"></img></div>
      <div><h4>{showPopup.properties.title}</h4></div>
      <div className="pop-description"><p>{showPopup.properties.address}</p></div>
      <div className="pop-description"><p>{showPopup.properties.city}</p></div>
      <div className="pop-description"><p>{showPopup.properties.state}</p></div>
      </Popup>}
   
    </ReactMapGL>
  );
}

export default Mapbox;